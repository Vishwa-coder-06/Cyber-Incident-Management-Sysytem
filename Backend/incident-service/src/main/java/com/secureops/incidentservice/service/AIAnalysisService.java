package com.secureops.incidentservice.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.secureops.incidentservice.dto.IncidentAnalysisResponse.SimilarIncidentInfo;
import com.secureops.incidentservice.entity.Incident;
import com.secureops.incidentservice.entity.IncidentAnalysis;
import com.secureops.incidentservice.repository.IncidentAnalysisRepository;
import com.secureops.incidentservice.repository.IncidentRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Handles async AI analysis calls from incident-service to ai-service.
 *
 * This is a separate Spring bean from IncidentService so that @Async
 * proxy works correctly (Spring cannot proxy @Async on self-calls).
 *
 * IMPORTANT: Three severity concepts are kept separate:
 *   1. reporter severity (future — not yet collected from reporter)
 *   2. aiSeverity — rule-derived from ML-predicted attackType (this class)
 *   3. finalSeverity — analyst-confirmed (Phase 2, Resolution)
 *
 * The AI service only predicts attackType. aiSeverity is rule-inferred.
 */
@Slf4j
@Service
public class AIAnalysisService {

    private final IncidentRepository incidentRepository;
    private final IncidentAnalysisRepository analysisRepository;
    private final ObjectMapper objectMapper;
    private final RestClient aiRestClient;

    public AIAnalysisService(
            IncidentRepository incidentRepository,
            IncidentAnalysisRepository analysisRepository,
            ObjectMapper objectMapper,
            @Value("${ai.service.url:http://localhost:8086}") String aiServiceUrl) {

        this.incidentRepository = incidentRepository;
        this.analysisRepository = analysisRepository;
        this.objectMapper = objectMapper;
        this.aiRestClient = RestClient.builder()
                .baseUrl(aiServiceUrl)
                .build();
    }

    /**
     * Asynchronously triggers AI analysis for a newly submitted incident.
     * Called after incident is saved to DB. Returns immediately to the
     * reporter — analysis runs in a background thread.
     *
     * @param incidentId   ID of the saved incident
     * @param authToken    Bearer token extracted from the original request
     *                     (request context is unavailable in async thread)
     */
    @Async("aiAnalysisExecutor")
    public void triggerAsync(Long incidentId, String authToken) {
        log.info("[AI-ASYNC] Starting async analysis for incident {}", incidentId);
        runAnalysis(incidentId, authToken, "AUTO");
    }

    /**
     * Synchronously runs AI analysis for a manual trigger (analyst/admin).
     *
     * @param incidentId   ID of the incident to analyze
     * @param authToken    Bearer token from the current request
     * @return the saved IncidentAnalysis, or null on failure
     */
    public IncidentAnalysis runSync(Long incidentId, String authToken) {
        log.info("[AI-SYNC] Starting sync analysis for incident {}", incidentId);
        return runAnalysis(incidentId, authToken, "MANUAL");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Core analysis logic (shared by async and sync paths)
    // ─────────────────────────────────────────────────────────────────────────

    private IncidentAnalysis runAnalysis(Long incidentId, String authToken, String source) {

        Incident incident = incidentRepository.findById(incidentId).orElse(null);
        if (incident == null) {
            log.warn("[AI] Incident {} not found — skipping analysis", incidentId);
            return null;
        }

        // Mark as pending
        incident.setAiStatus("PENDING");
        incidentRepository.save(incident);

        try {
            // ── 1. Build AI request ─────────────────────────────────────────
            String description = buildDescription(incident);
            AIServiceRequest aiReq = new AIServiceRequest(incident.getTitle(), description);

            log.info("[AI] Calling ai-service for incident {} | desc preview: {}",
                    incidentId, description.substring(0, Math.min(80, description.length())));

            // ── 2. Call ai-service ──────────────────────────────────────────
            AIServiceResponse aiResp = aiRestClient.post()
                    .uri("/api/ai/analyze")
                    .header("Authorization", authToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(aiReq)
                    .retrieve()
                    .body(AIServiceResponse.class);

            if (aiResp == null) {
                log.error("[AI] ai-service returned null for incident {}", incidentId);
                markFailed(incident);
                return null;
            }

            log.info("[AI] Response: attackType={} confidence={} aiSeverity={}",
                    aiResp.attackType, aiResp.confidence, aiResp.severity);

            // ── 3. Build / update IncidentAnalysis record ───────────────────
            IncidentAnalysis analysis = analysisRepository
                    .findByIncidentId(incidentId)
                    .orElse(new IncidentAnalysis());

            analysis.setIncidentId(incidentId);
            analysis.setAnalyzedAt(LocalDateTime.now());
            analysis.setIncidentSource(source);

            // ML-predicted fields
            analysis.setAttackType(aiResp.attackType);
            analysis.setConfidence(aiResp.confidence);

            // Rule-derived severity (from ai-service's SeverityRuleEngine)
            // aiResp.severity is the rule-derived value, NOT echoed from input
            analysis.setAiSeverity(aiResp.severity);

            // Backward-compat fields
            analysis.setCategory(aiResp.attackType);
            analysis.setSeverity(aiResp.severity);

            analysis.setRootCause(aiResp.rootCause);
            analysis.setImmediateAdvice(aiResp.immediateAdvice);
            analysis.setRecommendedPlaybookTitle(aiResp.recommendedPlaybookTitle);

            // Serialize similar incidents to JSON for storage
            if (aiResp.similarIncidents != null && !aiResp.similarIncidents.isEmpty()) {
                try {
                    analysis.setSimilarIncidentsJson(
                            objectMapper.writeValueAsString(aiResp.similarIncidents));
                } catch (Exception e) {
                    log.warn("[AI] Could not serialize similar incidents: {}", e.getMessage());
                }
            }

            IncidentAnalysis saved = analysisRepository.save(analysis);
            log.info("[AI] IncidentAnalysis saved with id={} for incident {}", saved.getAnalysisId(), incidentId);

            // ── 4. Update incident ──────────────────────────────────────────
            incident.setAiStatus("COMPLETED");
            incident.setCategory(aiResp.attackType);

            // ONLY set severity from AI rule if incident has no severity yet.
            // Never overwrite analyst-confirmed severity.
            if (incident.getSeverity() == null || incident.getSeverity().isBlank()) {
                incident.setSeverity(aiResp.severity);
                log.info("[AI] Set incident {} severity to AI-derived: {}", incidentId, aiResp.severity);
            } else {
                log.info("[AI] Incident {} already has severity={} — not overwriting with AI value",
                        incidentId, incident.getSeverity());
            }

            incident.setUpdatedAt(LocalDateTime.now());
            incidentRepository.save(incident);

            log.info("[AI] Analysis complete for incident {} — aiStatus=COMPLETED", incidentId);
            return saved;

        } catch (Exception e) {
            log.error("[AI] Analysis failed for incident {}: {}", incidentId, e.getMessage(), e);
            markFailed(incident);
            return null;
        }
    }

    private void markFailed(Incident incident) {
        try {
            incident.setAiStatus("FAILED");
            incident.setUpdatedAt(LocalDateTime.now());
            incidentRepository.save(incident);
        } catch (Exception ex) {
            log.error("[AI] Could not mark incident as FAILED: {}", ex.getMessage());
        }
    }

    private String buildDescription(Incident incident) {
        StringBuilder sb = new StringBuilder();
        if (incident.getTitle() != null) sb.append(incident.getTitle()).append(". ");
        if (incident.getDescription() != null) sb.append(incident.getDescription());
        return sb.toString().trim();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DTOs for ai-service communication (internal to this service)
    // ─────────────────────────────────────────────────────────────────────────

    /** Request body sent to ai-service POST /api/ai/analyze */
    private record AIServiceRequest(
            String title,
            String incidentDescription
    ) {}

    /** Response body from ai-service */
    private static class AIServiceResponse {
        public String attackType;
        public Double confidence;
        /** Rule-derived severity from ai-service's SeverityRuleEngine */
        public String severity;
        public String rootCause;
        public String immediateAdvice;
        public String recommendedPlaybookTitle;
        public List<SimilarIncidentInfo> similarIncidents;
    }

    /**
     * Deserializes the stored similarIncidentsJson back into a list.
     * Called by IncidentService.getAnalysis() when building the response.
     */
    public List<SimilarIncidentInfo> parseSimilarIncidents(String json) {
        if (json == null || json.isBlank()) return List.of();
        try {
            return objectMapper.readValue(json,
                    new TypeReference<List<SimilarIncidentInfo>>() {});
        } catch (Exception e) {
            log.warn("[AI] Could not parse similarIncidentsJson: {}", e.getMessage());
            return List.of();
        }
    }
}
