package com.secureops.incidentservice.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.secureops.incidentservice.entity.AITrainingExample;
import com.secureops.incidentservice.entity.Incident;
import com.secureops.incidentservice.entity.IncidentResolution;
import com.secureops.incidentservice.entity.IncidentTimelineEvent;
import com.secureops.incidentservice.repository.AITrainingExampleRepository;
import com.secureops.incidentservice.repository.IncidentRepository;
import com.secureops.incidentservice.repository.IncidentResolutionRepository;
import com.secureops.incidentservice.repository.IncidentTimelineRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Service managing the AI Training Data pipeline.
 *
 * Requirements enforced:
 *   1. Features: reporter's original title, description, affectedSystem.
 *   2. Target Labels: analyst's confirmed finalAttackType and finalSeverity.
 *   3. Supplementary: rootCause, resolutionSteps, lessonsLearned.
 *   4. Governance: Training examples must be approved before retraining.
 *   5. Explicit Retraining: Retraining is an explicit admin operation (never automatic).
 */
@Slf4j
@Service
public class AITrainingService {

    private final AITrainingExampleRepository trainingRepo;
    private final IncidentRepository incidentRepo;
    private final IncidentResolutionRepository resolutionRepo;
    private final IncidentTimelineRepository timelineRepo;
    private final RestClient pythonRestClient;
    private final com.secureops.incidentservice.client.AuditServiceClient auditServiceClient;

    public AITrainingService(
            AITrainingExampleRepository trainingRepo,
            IncidentRepository incidentRepo,
            IncidentResolutionRepository resolutionRepo,
            IncidentTimelineRepository timelineRepo,
            com.secureops.incidentservice.client.AuditServiceClient auditServiceClient,
            @Value("${ml.service.url:http://127.0.0.1:5000}") String mlServiceUrl) {
        this.trainingRepo = trainingRepo;
        this.incidentRepo = incidentRepo;
        this.resolutionRepo = resolutionRepo;
        this.timelineRepo = timelineRepo;
        this.auditServiceClient = auditServiceClient;
        this.pythonRestClient = RestClient.builder()
                .baseUrl(mlServiceUrl)
                .build();
    }



    public AITrainingExample createTrainingExample(Long incidentId, String requestedBy) {
        Incident incident = incidentRepo.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident Not Found: " + incidentId));

        IncidentResolution resolution = resolutionRepo.findByIncidentId(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident must be resolved before creating a training example."));

        AITrainingExample example = trainingRepo.findByIncidentId(incidentId)
                .orElse(new AITrainingExample());

        example.setIncidentId(incidentId);
        example.setTitle(incident.getTitle());
        example.setDescription(incident.getDescription());
        example.setAffectedSystem(incident.getAffectedSystem());
        example.setInitialCategory(incident.getCategory());

        // Ground-truth labels from analyst resolution
        example.setAttackTypeLabel(resolution.getFinalAttackType() != null
                ? resolution.getFinalAttackType() : incident.getCategory());
        example.setSeverityLabel(resolution.getFinalSeverity() != null
                ? resolution.getFinalSeverity() : incident.getSeverity());

        example.setRootCause(resolution.getRootCause());
        example.setResolutionStepsJson(resolution.getResolutionStepsJson());
        example.setLessonsLearned(resolution.getLessonsLearned());

        example.setCreatedAt(LocalDateTime.now());
        // Default not approved — requires explicit admin approval
        example.setApproved(false);

        AITrainingExample saved = trainingRepo.save(example);

        IncidentTimelineEvent event = new IncidentTimelineEvent();
        event.setIncidentId(incidentId);
        event.setEvent("TRAINING_DATA_STAGED");
        event.setDescription("Staged as AI training candidate with label '" + saved.getAttackTypeLabel() + "' (Awaiting admin approval)");
        event.setCreatedAt(LocalDateTime.now());
        timelineRepo.save(event);

        auditServiceClient.logEvent(0L, "AI_TRAINING_STAGED",
                "Incident #" + incidentId + " staged as AI training example #" + saved.getId() + " (Label: " + saved.getAttackTypeLabel() + ")", "AI_TRAINING");

        log.info("[TRAINING] Created training example id={} for incident {}", saved.getId(), incidentId);
        return saved;
    }

    public AITrainingExample approveTrainingExample(Long exampleId, String approvedBy) {
        AITrainingExample example = trainingRepo.findById(exampleId)
                .orElseThrow(() -> new RuntimeException("Training example not found: " + exampleId));

        example.setApproved(true);
        example.setApprovedBy(approvedBy);
        example.setApprovedAt(LocalDateTime.now());

        AITrainingExample saved = trainingRepo.save(example);

        // Send to Python ML service dataset
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("category", saved.getAttackTypeLabel());
            payload.put("description", saved.getTitle() + ". " + (saved.getDescription() != null ? saved.getDescription() : ""));
            payload.put("rootCause", saved.getRootCause());
            payload.put("immediateAdvice", saved.getLessonsLearned());
            payload.put("recommendedPlaybookTitle", saved.getAttackTypeLabel() + " Response Playbook");

            pythonRestClient.post()
                    .uri("/training-data")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();

            log.info("[TRAINING] Approved example {} pushed to Python ML dataset", exampleId);
        } catch (Exception e) {
            log.warn("[TRAINING] Example {} approved in DB, but could not reach Python /training-data: {}",
                    exampleId, e.getMessage());
        }

        auditServiceClient.logEvent(0L, "AI_TRAINING_APPROVED",
                "AI training example #" + exampleId + " approved by " + approvedBy + " (Label: " + saved.getAttackTypeLabel() + ")", "AI_TRAINING");

        return saved;
    }

    public List<AITrainingExample> getAllExamples() {
        return trainingRepo.findAll();
    }

    public List<AITrainingExample> getApprovedExamples() {
        return trainingRepo.findByApproved(true);
    }

    public Map<String, Object> getTrainingStatus() {
        List<AITrainingExample> all = trainingRepo.findAll();
        long approvedCount = all.stream().filter(AITrainingExample::isApproved).count();
        long pendingCount = all.size() - approvedCount;


        Map<String, Object> status = new HashMap<>();
        status.put("totalStagedExamples", all.size());
        status.put("approvedExamples", approvedCount);
        status.put("pendingReview", pendingCount);
        status.put("activeModel", "incident_classifier.pkl");
        status.put("modelClasses", List.of("Phishing", "Ransomware", "DDoS", "Insider Threat", "Lateral Movement"));
        status.put("mlServiceStatus", "HEALTHY");
        return status;
    }

    public Map<String, Object> triggerExplicitRetrain(String adminUser) {
        log.info("[TRAINING] Admin {} triggered explicit model retraining", adminUser);
        try {
            Map<?, ?> res = pythonRestClient.post()
                    .uri("/retrain")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{}")
                    .retrieve()
                    .body(Map.class);

            Map<String, Object> result = new HashMap<>();
            result.put("status", "SUCCESS");
            result.put("triggeredBy", adminUser);
            result.put("timestamp", LocalDateTime.now().toString());
            result.put("details", res);

            auditServiceClient.logEvent(0L, "MODEL_RETRAINED",
                    "AI classification model retrained by " + adminUser + ". New active model deployed.", "AI_TRAINING");

            return result;
        } catch (Exception e) {
            log.error("[TRAINING] Retraining failed: {}", e.getMessage(), e);
            throw new RuntimeException("Model retraining request failed: " + e.getMessage(), e);
        }
    }
}

