package com.secureops.incidentservice.service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.secureops.common.dto.IncidentSummary;
import com.secureops.common.dto.UserResponse;
import com.secureops.incidentservice.client.UserClient;
import com.secureops.incidentservice.dto.AdminReportResponse;
import com.secureops.incidentservice.dto.AnalystInvestigationResponse;
import com.secureops.incidentservice.dto.IncidentAnalysisResponse;
import com.secureops.incidentservice.dto.IncidentDashboardResponse;
import com.secureops.incidentservice.dto.IncidentRequest;
import com.secureops.incidentservice.dto.IncidentResolutionResponse;
import com.secureops.incidentservice.dto.IncidentResponse;
import com.secureops.incidentservice.dto.KBConversionResponse;
import com.secureops.incidentservice.dto.IncidentTimelineResponse;

import com.secureops.incidentservice.dto.IncidentTrendResponse;
import com.secureops.incidentservice.dto.ReporterDashboardResponse;
import com.secureops.incidentservice.dto.ReporterIncidentDetailResponse;
import com.secureops.incidentservice.dto.ReporterIncidentRequest;
import com.secureops.incidentservice.dto.ReporterIncidentResponse;
import com.secureops.incidentservice.dto.ResolveIncidentRequest;
import com.secureops.incidentservice.dto.SystemReport;
import com.secureops.incidentservice.entity.Incident;
import com.secureops.incidentservice.entity.IncidentAnalysis;
import com.secureops.incidentservice.entity.IncidentResolution;
import com.secureops.incidentservice.entity.IncidentTimelineEvent;
import com.secureops.incidentservice.repository.IncidentAnalysisRepository;
import com.secureops.incidentservice.repository.IncidentRepository;
import com.secureops.incidentservice.repository.IncidentResolutionRepository;
import com.secureops.incidentservice.repository.IncidentTimelineRepository;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final UserClient userClient;
    private final IncidentAnalysisRepository incidentAnalysisRepository;
    private final IncidentTimelineRepository incidentTimelineRepository;
    private final IncidentTimelineRepository incidentTimelineEventRepository;
    private final AIAnalysisService aiAnalysisService;
    private final IncidentResolutionRepository incidentResolutionRepository;
    private final ObjectMapper objectMapper;
    private final RestClient knowledgeRestClient;
    private final com.secureops.incidentservice.client.AuditServiceClient auditServiceClient;

    public IncidentService(
            IncidentRepository incidentRepository,
            UserClient userClient,
            IncidentAnalysisRepository incidentAnalysisRepository,
            IncidentTimelineRepository incidentTimelineRepository,
            IncidentTimelineRepository incidentTimelineEventRepository,
            AIAnalysisService aiAnalysisService,
            IncidentResolutionRepository incidentResolutionRepository,
            ObjectMapper objectMapper,
            com.secureops.incidentservice.client.AuditServiceClient auditServiceClient,
            @Value("${knowledge.service.url:http://localhost:8085}") String knowledgeServiceUrl) {
        this.incidentRepository = incidentRepository;
        this.userClient = userClient;
        this.incidentAnalysisRepository = incidentAnalysisRepository;
        this.incidentTimelineRepository = incidentTimelineRepository;
        this.incidentTimelineEventRepository = incidentTimelineEventRepository;
        this.aiAnalysisService = aiAnalysisService;
        this.incidentResolutionRepository = incidentResolutionRepository;
        this.objectMapper = objectMapper;
        this.auditServiceClient = auditServiceClient;
        this.knowledgeRestClient = RestClient.builder()
                .baseUrl(knowledgeServiceUrl)
                .build();
    }




    // Create Incident

    public IncidentResponse createIncident(IncidentRequest request) {

        Incident incident = new Incident();

        incident.setTitle(request.getTitle());
        incident.setDescription(request.getDescription());
        incident.setSeverity(request.getSeverity());
        incident.setStatus(request.getStatus());
        incident.setCategory(request.getCategory());
        incident.setReportedBy(request.getReportedBy());
        incident.setAssignedTo(request.getAssignedTo());

        incident.setCreatedAt(LocalDateTime.now());
        incident.setUpdatedAt(LocalDateTime.now());

        Incident savedIncident = incidentRepository.save(incident);

        return new IncidentResponse(
                savedIncident.getIncidentId(),
                savedIncident.getTitle(),
                savedIncident.getStatus(),
                "Incident Created Successfully"
        );
    }

    // Get All Incidents

    public List<Incident> getAllIncidents() {

        return incidentRepository.findAll();

    }

    // Get Incident By ID

    public Incident getIncidentById(Long id) {

        return incidentRepository.findById(id).orElse(null);

    }

    // Update Incident

    public Incident updateIncident(Long id, Incident updatedIncident) {

        Incident incident = incidentRepository.findById(id).orElse(null);

        if (incident == null) {
            return null;
        }

        incident.setTitle(updatedIncident.getTitle());
        incident.setDescription(updatedIncident.getDescription());
        incident.setSeverity(updatedIncident.getSeverity());
        incident.setStatus(updatedIncident.getStatus());
        incident.setCategory(updatedIncident.getCategory());
        incident.setReportedBy(updatedIncident.getReportedBy());
        incident.setAssignedTo(updatedIncident.getAssignedTo());
        incident.setUpdatedAt(LocalDateTime.now());

        return incidentRepository.save(incident);

    }

    // Delete Incident

    public void deleteIncident(Long id) {

        incidentRepository.deleteById(id);

    }
    
    public Incident assignIncident(Long incidentId,
            Long analystId){

    		Incident incident =
    				incidentRepository.findById(incidentId)
    				.orElseThrow(() ->
    				new RuntimeException("Incident Not Found"));
    		
    		incident.setAssignedTo(analystId);

    		incident.setStatus("ASSIGNED");

    		incident.setUpdatedAt(LocalDateTime.now());

    		Incident saved = incidentRepository.save(incident);
    		auditServiceClient.logEvent(analystId, "INCIDENT_ASSIGNED",
    		        "Incident #" + incidentId + " assigned to analyst #" + analystId, "INCIDENT");
    		return saved;

     }

    
    public Incident updateIncidentStatus(Long id, String status) {

        Incident incident =
                incidentRepository.findById(id).orElse(null);

        if (incident == null) {
            return null;
        }

        incident.setStatus(status);
        incident.setUpdatedAt(LocalDateTime.now());

        return incidentRepository.save(incident);
    }
    
    public IncidentDashboardResponse getDashboardData() {

        long total = incidentRepository.count();

        long open =
                incidentRepository.countByStatusIgnoreCase("OPEN");

        long inProgress =
                incidentRepository.countByStatusIgnoreCase("IN_PROGRESS");

        long resolved =
                incidentRepository.countByStatusIgnoreCase("RESOLVED");

        long critical =
                incidentRepository.countBySeverity("CRITICAL");

        return new IncidentDashboardResponse(
                total,
                open,
                inProgress,
                resolved,
                critical
        );
    }
    
    public ReporterDashboardResponse getReporterDashboard(
            Long reportedBy) {

        long totalSubmitted =
                incidentRepository.countByReportedBy(reportedBy);

        long underReview =
                incidentRepository.countByReportedByAndStatusIgnoreCase(
                        reportedBy,
                        "IN_PROGRESS");

        long resolved =
                incidentRepository.countByReportedByAndStatusIgnoreCase(
                        reportedBy,
                        "RESOLVED");

        long criticalOpen =
                incidentRepository
                        .countByReportedByAndSeverityIgnoreCaseAndStatusIgnoreCase(
                                reportedBy,
                                "CRITICAL",
                                "OPEN");

        List<ReporterIncidentResponse> recentIncidents =
                incidentRepository
                        .findTop5ByReportedByOrderByCreatedAtDesc(
                                reportedBy)
                        .stream()
                        .map(incident ->
                                new ReporterIncidentResponse(
                                        incident.getIncidentId(),
                                        incident.getTitle(),
                                        incident.getCategory(),
                                        incident.getSeverity(),
                                        incident.getStatus()
                                ))
                        .toList();

        return new ReporterDashboardResponse(
                totalSubmitted,
                underReview,
                resolved,
                criticalOpen,
                recentIncidents
        );
    }
    public long getOpenIncidentCount() {

        return incidentRepository
                .countByStatusIgnoreCase("OPEN");
    }
    public long getResolvedToday() {

        LocalDateTime startOfDay =
                LocalDateTime.now()
                        .toLocalDate()
                        .atStartOfDay();

        return incidentRepository
                .countByStatusIgnoreCaseAndUpdatedAtAfter(
                        "RESOLVED",
                        startOfDay);
    }
    public List<Incident> getUnassignedIncidents() {

        return incidentRepository.findByAssignedToIsNull();
    }
    
    public List<IncidentTrendResponse> getIncidentTrend() {

        LocalDate today = LocalDate.now();

        LocalDateTime start =
                today.minusDays(6).atStartOfDay();

        List<Incident> incidents =
                incidentRepository.findIncidentsFromDate(start);

        Map<String, Long> counts =
                incidents.stream()
                        .collect(Collectors.groupingBy(
                                incident ->
                                        incident.getCreatedAt()
                                                .getDayOfWeek()
                                                .toString(),
                                Collectors.counting()
                        ));

        List<IncidentTrendResponse> result =
                new ArrayList<>();

        for (int i = 6; i >= 0; i--) {

            LocalDate date =
                    today.minusDays(i);

            String day =
                    date.getDayOfWeek()
                            .toString()
                            .substring(0, 3);

            long count =
                    incidents.stream()
                            .filter(incident ->
                                    incident.getCreatedAt()
                                            .toLocalDate()
                                            .equals(date))
                            .count();

            result.add(
                    new IncidentTrendResponse(
                            day,
                            count
                    )
            );
        }

        return result;
    }
    
    public IncidentResponse saveDraft(
            ReporterIncidentRequest request) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        Long reporterId = 1L;
        try {
            UserResponse user = userClient.getUserByEmail(email);
            if (user != null && user.getUserId() != null) {
                reporterId = user.getUserId();
            }
        } catch (Exception e) {
            log.warn("[INCIDENT] Could not retrieve user for email {}: {}", email, e.getMessage());
        }

        Incident incident = new Incident();

        incident.setTitle(request.getTitle());
        incident.setAffectedSystem(request.getAffectedSystem());
        incident.setIncidentDateTime(
                request.getIncidentDateTime());
        incident.setDescription(request.getDescription());

        incident.setReportedBy(reporterId);

        incident.setStatus("DRAFT");

        incident.setCreatedAt(LocalDateTime.now());
        incident.setUpdatedAt(LocalDateTime.now());

        Incident saved =
                incidentRepository.save(incident);

        return new IncidentResponse(
                saved.getIncidentId(),
                saved.getTitle(),
                saved.getStatus(),
                "Draft Saved Successfully"
        );
    }
    
    public IncidentResponse submitIncident(
            ReporterIncidentRequest request) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        Long reporterId = 1L;
        try {
            UserResponse user = userClient.getUserByEmail(email);
            if (user != null && user.getUserId() != null) {
                reporterId = user.getUserId();
            }
        } catch (Exception e) {
            log.warn("[INCIDENT] Could not retrieve user for email {}: {}", email, e.getMessage());
        }

        Incident incident = new Incident();

        incident.setTitle(request.getTitle());
        incident.setAffectedSystem(
                request.getAffectedSystem());

        incident.setIncidentDateTime(
                request.getIncidentDateTime());

        incident.setDescription(
                request.getDescription());

        incident.setReportedBy(reporterId);

        incident.setStatus("OPEN");
        incident.setAiStatus("PENDING");


        incident.setCreatedAt(LocalDateTime.now());
        incident.setUpdatedAt(LocalDateTime.now());

        Incident saved =
                incidentRepository.save(incident);

        auditServiceClient.logEvent(reporterId, "INCIDENT_SUBMITTED",
                "Incident #" + saved.getIncidentId() + " submitted: " + saved.getTitle(), "INCIDENT");

        // Capture Bearer token BEFORE async dispatch — the request context

        // is unavailable in the background thread.
        String authToken = null;
        try {
            ServletRequestAttributes attrs =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                authToken = attrs.getRequest().getHeader("Authorization");
            }
        } catch (Exception ex) {
            log.warn("[SUBMIT] Could not extract auth token for async AI trigger: {}",
                    ex.getMessage());
        }

        // Trigger AI analysis asynchronously — reporter does NOT wait.
        // AI result is saved to IncidentAnalysis table in background.
        aiAnalysisService.triggerAsync(saved.getIncidentId(), authToken);

        return new IncidentResponse(
                saved.getIncidentId(),
                saved.getTitle(),
                saved.getStatus(),
                "Incident submitted. AI analysis is running in the background."
        );
    }
    
    public IncidentAnalysisResponse analyzeIncident(
            Long incidentId) {

        // Replaced keyword-matching with real AI service call.
        // Capture Bearer token from current request.
        String authToken = null;
        try {
            ServletRequestAttributes attrs =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                authToken = attrs.getRequest().getHeader("Authorization");
            }
        } catch (Exception ex) {
            log.warn("[ANALYZE] Could not extract auth token: {}", ex.getMessage());
        }

        // Synchronous call (analyst/admin manually triggered)
        IncidentAnalysis saved = aiAnalysisService.runSync(incidentId, authToken);

        if (saved == null) {
            throw new RuntimeException(
                    "AI analysis failed for incident " + incidentId
                    + ". Ensure ai-service and Python ML service are running.");
        }

        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident Not Found"));

        return buildAnalysisResponse(incident, saved);
    }
    
    public IncidentAnalysisResponse getAnalysis(
            Long incidentId) {

        Incident incident =
                incidentRepository.findById(incidentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Incident Not Found"));

        IncidentAnalysis analysis =
                incidentAnalysisRepository
                        .findByIncidentId(incidentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Analysis Not Found for incident " + incidentId
                                        + ". aiStatus=" + incident.getAiStatus()));

        return buildAnalysisResponse(incident, analysis);
    }

    /**
     * Builds an enriched IncidentAnalysisResponse from an IncidentAnalysis record.
     * Includes ML-predicted fields (attackType, confidence), rule-derived aiSeverity,
     * and parsed similar incidents.
     */
    private IncidentAnalysisResponse buildAnalysisResponse(
            Incident incident, IncidentAnalysis analysis) {

        List<IncidentAnalysisResponse.SimilarIncidentInfo> similarIncidents =
                aiAnalysisService.parseSimilarIncidents(
                        analysis.getSimilarIncidentsJson());

        IncidentAnalysisResponse response = new IncidentAnalysisResponse();
        response.setIncidentId(incident.getIncidentId());
        response.setTitle(incident.getTitle());

        // Backward-compat fields
        response.setCategory(analysis.getCategory());
        response.setSeverity(analysis.getSeverity());
        response.setRootCause(analysis.getRootCause());
        response.setImmediateAdvice(analysis.getImmediateAdvice());
        response.setRecommendedPlaybookId(analysis.getRecommendedPlaybookId());
        response.setRecommendedPlaybookTitle(analysis.getRecommendedPlaybookTitle());
        response.setAnalyzedAt(analysis.getAnalyzedAt());

        // Enriched AI fields
        response.setAttackType(analysis.getAttackType());
        response.setConfidence(analysis.getConfidence());
        response.setAiSeverity(analysis.getAiSeverity());
        response.setIncidentSource(analysis.getIncidentSource());
        response.setSimilarIncidents(similarIncidents);

        return response;
    }
    
    public Incident submitToManager(Long id) {

        Incident incident =
                incidentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Incident Not Found"));

        incident.setStatus("OPEN");
        incident.setUpdatedAt(LocalDateTime.now());

        return incidentRepository.save(incident);
    }
    
    public List<Incident> getReporterIncidents(
            String search,
            String status,
            String severity) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        UserResponse user =
                userClient.getUserByEmail(
                        authentication.getName());

        return incidentRepository.findReporterIncidents(
                user.getUserId(),
                search,
                status,
                severity
        );
    }
    
    public ReporterIncidentDetailResponse getReporterIncidentDetails(
            Long id) {

        // 1. Get incident
        Incident incident =
                incidentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Incident Not Found"));

        // 2. Get reporter
        UserResponse reporter =
                userClient.getUserById(
                        incident.getReportedBy());

        // 3. Get assigned analyst
        String assignedToName = null;

        if (incident.getAssignedTo() != null) {

            UserResponse analyst =
                    userClient.getUserById(
                            incident.getAssignedTo());

            if (analyst != null) {
                assignedToName =
                        analyst.getFirstName()
                        + " "
                        + analyst.getLastName();
            }
        }

        // 4. Get AI analysis
        IncidentAnalysisResponse analysisResponse = null;

        IncidentAnalysis analysis =
                incidentAnalysisRepository
                        .findByIncidentId(id)
                        .orElse(null);

        if (analysis != null) {
            analysisResponse = buildAnalysisResponse(incident, analysis);
        }

        // 5. Get timeline
        List<IncidentTimelineResponse> timeline =
                incidentTimelineRepository
                        .findByIncidentIdOrderByCreatedAtAsc(id)
                        .stream()
                        .map(event ->
                                new IncidentTimelineResponse(
                                        event.getEvent(),
                                        event.getDescription(),
                                        event.getCreatedAt()
                                )
                        )
                        .toList();

        // 6. Reporter name
        String reporterName = null;

        if (reporter != null) {
            reporterName =
                    reporter.getFirstName()
                    + " "
                    + reporter.getLastName();
        }

        // 7. Return complete response
        return new ReporterIncidentDetailResponse(
                incident.getIncidentId(),
                incident.getTitle(),
                incident.getAffectedSystem(),
                incident.getDescription(),
                incident.getSeverity(),
                incident.getStatus(),
                reporterName,
                assignedToName,
                incident.getIncidentDateTime(),
                incident.getCreatedAt(),
                incident.getUpdatedAt(),
                analysisResponse,
                timeline
        );
    }
    
    public List<Incident> getAnalystIncidents(
            String email,
            String search,
            String severity) {

        UserResponse user =
                userClient.getUserByEmail(email);

        return incidentRepository.findAnalystIncidents(
                user.getUserId(),
                search,
                severity
        );
    }
    
    public IncidentTimelineEvent addInvestigationNote(
            Long incidentId,
            String email,
            String note) {

        UserResponse user =
                userClient.getUserByEmail(email);

        Incident incident =
                incidentRepository.findById(incidentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Incident Not Found"));

        IncidentTimelineEvent event =
                new IncidentTimelineEvent();

        event.setIncidentId(
                incident.getIncidentId());

        event.setEvent("INVESTIGATION_NOTE");

        event.setDescription(
                user.getFirstName()
                + " added investigation note: "
                + note);

        event.setCreatedAt(
                LocalDateTime.now());

        IncidentTimelineEvent savedEvent = incidentTimelineEventRepository.save(event);
        auditServiceClient.logEvent(user != null ? user.getUserId() : 0L, "INVESTIGATION_NOTE_ADDED",
                "Investigation note added to incident #" + incidentId + ": " + (note.length() > 50 ? note.substring(0, 47) + "..." : note), "INVESTIGATION");
        return savedEvent;
    }
    
    public Incident performInvestigationAction(
            Long incidentId,
            String action) {

        Incident incident =
                incidentRepository.findById(incidentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Incident Not Found"));

        IncidentTimelineEvent event =
                new IncidentTimelineEvent();

        event.setIncidentId(incidentId);

        event.setEvent(action.toUpperCase());

        event.setDescription(
                "Analyst performed action: "
                + action);

        event.setCreatedAt(
                LocalDateTime.now());

        incidentTimelineEventRepository.save(event);
        auditServiceClient.logEvent(0L, "INVESTIGATION_ACTION",
                "Executed action '" + action + "' on incident #" + incidentId, "INVESTIGATION");


        if ("RESOLVE".equalsIgnoreCase(action)) {

            incident.setStatus("RESOLVED");
            incident.setUpdatedAt(
                    LocalDateTime.now());

            return incidentRepository.save(incident);
        }

        if ("ESCALATE".equalsIgnoreCase(action)) {

            incident.setStatus("ESCALATED");
            incident.setUpdatedAt(
                    LocalDateTime.now());

            return incidentRepository.save(incident);
        }

        if ("REQUEST_INFO".equalsIgnoreCase(action)) {

            incident.setStatus("INFO_REQUESTED");
            incident.setUpdatedAt(
                    LocalDateTime.now());

            return incidentRepository.save(incident);
        }

        return incident;
    }
    
    public AnalystInvestigationResponse
    getInvestigation(Long incidentId) {

        Incident incident =
                incidentRepository.findById(incidentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Incident Not Found"));

        IncidentAnalysis analysis =
                incidentAnalysisRepository
                        .findByIncidentId(incidentId)
                        .orElse(null);

        List<IncidentTimelineEvent> timeline =
                incidentTimelineEventRepository
                        .findByIncidentIdOrderByCreatedAtAsc(
                                incidentId);

        IncidentSummary summary =
                new IncidentSummary(
                        incident.getIncidentId(),
                        incident.getTitle(),
                        incident.getCategory(),
                        incident.getSeverity(),
                        incident.getStatus()
                );

        return new AnalystInvestigationResponse(
                summary,
                analysis,
                timeline
        );
    }
    
    public IncidentTimelineEvent addResolutionStep(
            Long incidentId,
            String step) {

        IncidentTimelineEvent event =
                new IncidentTimelineEvent();

        event.setIncidentId(incidentId);

        event.setEvent("RESOLUTION_STEP");

        event.setDescription(step);

        event.setCreatedAt(
                LocalDateTime.now());

        return incidentTimelineEventRepository.save(event);
    }
    
    public Incident closeIncident(
            Long incidentId,
            String resolutionSummary) {

        Incident incident =
                incidentRepository.findById(incidentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Incident Not Found"));

        incident.setStatus("RESOLVED");

        incident.setUpdatedAt(
                LocalDateTime.now());

        IncidentTimelineEvent event =
                new IncidentTimelineEvent();

        event.setIncidentId(incidentId);

        event.setEvent("RESOLUTION_COMPLETED");

        event.setDescription(
                resolutionSummary);

        event.setCreatedAt(
                LocalDateTime.now());

        incidentTimelineEventRepository.save(event);

        return incidentRepository.save(incident);
    }

    /**
     * Dedicated structured resolution workflow.
     * Persists:
     *   - resolutionSummary
     *   - ordered resolutionSteps
     *   - rootCause
     *   - finalAttackType (analyst confirmed ground truth)
     *   - finalSeverity (analyst confirmed ground truth)
     *   - lessonsLearned
     *   - resolvedBy / resolvedByName / resolvedAt
     * Updates Incident status to "RESOLVED" and applies the confirmed final severity and attack type.
     */
    public IncidentResolutionResponse resolveIncident(
            Long incidentId,
            ResolveIncidentRequest request,
            String userEmail) {

        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident Not Found: " + incidentId));

        UserResponse user = null;
        if (userEmail != null && !userEmail.isBlank()) {
            try {
                user = userClient.getUserByEmail(userEmail);
            } catch (Exception ex) {
                log.warn("[RESOLVE] Could not fetch user details for {}: {}", userEmail, ex.getMessage());
            }
        }

        Long userId = user != null ? user.getUserId() : null;
        String userName = user != null
                ? (user.getFirstName() + " " + user.getLastName())
                : (userEmail != null ? userEmail : "Analyst");

        // Serialize ordered resolution steps
        String stepsJson = null;
        if (request.getResolutionSteps() != null && !request.getResolutionSteps().isEmpty()) {
            try {
                stepsJson = objectMapper.writeValueAsString(request.getResolutionSteps());
            } catch (Exception e) {
                log.warn("[RESOLVE] Could not serialize resolution steps: {}", e.getMessage());
            }
        }

        IncidentResolution resolution = incidentResolutionRepository
                .findByIncidentId(incidentId)
                .orElse(new IncidentResolution());

        resolution.setIncidentId(incidentId);
        resolution.setResolutionSummary(request.getResolutionSummary());
        resolution.setResolutionStepsJson(stepsJson);
        resolution.setRootCause(request.getRootCause());
        resolution.setFinalAttackType(request.getFinalAttackType());
        resolution.setFinalSeverity(request.getFinalSeverity());
        resolution.setLessonsLearned(request.getLessonsLearned());
        resolution.setResolvedBy(userId);
        resolution.setResolvedByName(userName);
        resolution.setResolvedAt(LocalDateTime.now());

        IncidentResolution saved = incidentResolutionRepository.save(resolution);

        // Update Incident status and apply ground truth final labels
        incident.setStatus("RESOLVED");
        if (request.getFinalSeverity() != null && !request.getFinalSeverity().isBlank()) {
            incident.setSeverity(request.getFinalSeverity());
        }
        if (request.getFinalAttackType() != null && !request.getFinalAttackType().isBlank()) {
            incident.setCategory(request.getFinalAttackType());
        }
        incident.setUpdatedAt(LocalDateTime.now());
        incidentRepository.save(incident);

        // Record resolution in activity timeline
        IncidentTimelineEvent event = new IncidentTimelineEvent();
        event.setIncidentId(incidentId);
        event.setEvent("INCIDENT_RESOLVED");
        event.setDescription("Incident resolved by " + userName + " (" + request.getFinalAttackType() + " / " + request.getFinalSeverity() + ")");
        event.setCreatedAt(LocalDateTime.now());
        incidentTimelineEventRepository.save(event);

        auditServiceClient.logEvent(userId, "INCIDENT_RESOLVED",
                "Incident #" + incidentId + " resolved by " + userName + ": " + request.getFinalAttackType() + " / " + request.getFinalSeverity(), "RESOLUTION");

        return toResolutionResponse(incident, saved, request.getResolutionSteps());
    }

    public IncidentResolutionResponse getIncidentResolution(Long incidentId) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident Not Found: " + incidentId));

        IncidentResolution resolution = incidentResolutionRepository
                .findByIncidentId(incidentId)
                .orElseThrow(() -> new RuntimeException("Resolution record not found for incident " + incidentId));

        List<String> steps = parseResolutionSteps(resolution.getResolutionStepsJson());
        return toResolutionResponse(incident, resolution, steps);
    }

    public KBConversionResponse convertToKnowledgeArticle(Long incidentId, String authToken) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident Not Found: " + incidentId));

        if (incident.getKbArticleId() != null && !incident.getKbArticleId().isBlank()) {
            return new KBConversionResponse(
                    incidentId,
                    incident.getKbArticleId(),
                    "Resolution: " + incident.getTitle(),
                    "Incident is already converted to Knowledge Base article ID " + incident.getKbArticleId()
            );
        }

        IncidentResolution resolution = incidentResolutionRepository
                .findByIncidentId(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident must be resolved before converting to KB article."));

        List<String> steps = parseResolutionSteps(resolution.getResolutionStepsJson());
        StringBuilder solutionText = new StringBuilder();
        if (steps != null && !steps.isEmpty()) {
            for (int i = 0; i < steps.size(); i++) {
                solutionText.append(i + 1).append(". ").append(steps.get(i)).append("\n");
            }
        } else {
            solutionText.append(resolution.getResolutionSummary() != null ? resolution.getResolutionSummary() : "Resolved.");
        }

        String articleTitle = "Resolution: " + incident.getTitle();
        String description = "Incident Overview:\n" + (resolution.getResolutionSummary() != null ? resolution.getResolutionSummary() : "")
                + "\n\nRoot Cause:\n" + (resolution.getRootCause() != null ? resolution.getRootCause() : "N/A");

        Map<String, Object> kbPayload = new HashMap<>();
        kbPayload.put("title", articleTitle);
        kbPayload.put("category", resolution.getFinalAttackType() != null ? resolution.getFinalAttackType() : incident.getCategory());
        kbPayload.put("severity", resolution.getFinalSeverity() != null ? resolution.getFinalSeverity() : incident.getSeverity());
        kbPayload.put("description", description);
        kbPayload.put("solution", solutionText.toString().trim());
        kbPayload.put("prevention", resolution.getLessonsLearned() != null ? resolution.getLessonsLearned() : "Follow standard operating procedures.");
        kbPayload.put("tags", List.of(
                resolution.getFinalAttackType() != null ? resolution.getFinalAttackType() : "Security",
                "Resolution",
                "INC-" + incidentId
        ));
        kbPayload.put("createdBy", resolution.getResolvedByName() != null ? resolution.getResolvedByName() : "Security Analyst");
        kbPayload.put("status", "PUBLISHED");

        // Attach specific AI recommended playbook if present
        incidentAnalysisRepository.findByIncidentId(incidentId).ifPresent(analysis -> {
            if (analysis.getRecommendedPlaybookTitle() != null && !analysis.getRecommendedPlaybookTitle().isBlank()) {
                kbPayload.put("playbookTitle", analysis.getRecommendedPlaybookTitle());
            }
        });

        log.info("[KB-CONVERT] Sending KB article creation request for incident {}", incidentId);

        try {
            Map<?, ?> kbResponse = knowledgeRestClient.post()
                    .uri("/api/articles")
                    .header("Authorization", authToken != null ? authToken : "")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(kbPayload)
                    .retrieve()
                    .body(Map.class);

            String articleId = null;
            if (kbResponse != null) {
                articleId = (String) kbResponse.get("id");
                if (articleId == null && kbResponse.get("data") instanceof Map<?, ?> dataMap) {
                    articleId = (String) dataMap.get("id");
                }
            }

            if (articleId == null) {
                articleId = "KB-" + incidentId + "-" + System.currentTimeMillis();
            }

            incident.setKbArticleId(articleId);
            incident.setUpdatedAt(LocalDateTime.now());
            incidentRepository.save(incident);

            // Record timeline event
            IncidentTimelineEvent event = new IncidentTimelineEvent();
            event.setIncidentId(incidentId);
            event.setEvent("KB_ARTICLE_GENERATED");
            event.setDescription("Converted resolution into Knowledge Base article: " + articleTitle + " (ID: " + articleId + ")");
            event.setCreatedAt(LocalDateTime.now());
            incidentTimelineEventRepository.save(event);

            auditServiceClient.logEvent(0L, "KB_CONVERTED",
                    "Incident #" + incidentId + " converted to Knowledge Base article: " + articleTitle + " (ID: " + articleId + ")", "KNOWLEDGE_BASE");

            log.info("[KB-CONVERT] Successfully created KB article {} for incident {}", articleId, incidentId);
            return new KBConversionResponse(incidentId, articleId, articleTitle, "Knowledge Base article published successfully!");


        } catch (Exception e) {
            log.error("[KB-CONVERT] Failed to create KB article for incident {}: {}", incidentId, e.getMessage(), e);
            throw new RuntimeException("Failed to publish KB article: " + e.getMessage(), e);
        }
    }

    private IncidentResolutionResponse toResolutionResponse(Incident incident, IncidentResolution r, List<String> steps) {
        return new IncidentResolutionResponse(
                r.getResolutionId(),
                r.getIncidentId(),
                r.getResolutionSummary(),
                steps,
                r.getRootCause(),
                r.getFinalAttackType(),
                r.getFinalSeverity(),
                r.getLessonsLearned(),
                r.getResolvedBy(),
                r.getResolvedByName(),
                r.getResolvedAt(),
                incident != null ? incident.getKbArticleId() : null
        );
    }

    private List<String> parseResolutionSteps(String stepsJson) {
        if (stepsJson == null || stepsJson.isBlank()) {
            return List.of();
        }
        try {
            return objectMapper.readValue(stepsJson, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            log.warn("[RESOLVE] Could not parse resolution steps JSON: {}", e.getMessage());
            return List.of();
        }
    }
    
    public List<Incident> getManagerIncidentQueue(
            String search,
            String status,
            String severity) {

        List<Incident> incidents =
                incidentRepository.findAll();

        return incidents.stream()

                .filter(incident -> {

                    if (status != null &&
                        !status.isBlank() &&
                        !status.equalsIgnoreCase("ALL")) {

                        return incident.getStatus()
                                .equalsIgnoreCase(status);
                    }

                    return true;
                })

                .filter(incident -> {

                    if (severity != null &&
                        !severity.isBlank() &&
                        !severity.equalsIgnoreCase("ALL")) {

                        return incident.getSeverity()
                                .equalsIgnoreCase(severity);
                    }

                    return true;
                })

                .filter(incident -> {

                    if (search == null ||
                        search.isBlank()) {

                        return true;
                    }

                    String value =
                            search.toLowerCase();

                    return incident.getTitle()
                            .toLowerCase()
                            .contains(value);
                })

                .toList();
    }
    
 // =====================================================
 // ADMIN REPORTS
 // =====================================================

 public long getIncidentsThisMonth() {

     LocalDateTime now =
             LocalDateTime.now();

     LocalDateTime start =
             now.withDayOfMonth(1)
                .withHour(0)
                .withMinute(0)
                .withSecond(0)
                .withNano(0);

     LocalDateTime end =
             start.plusMonths(1);

     return incidentRepository
             .countByCreatedAtBetween(
                     start,
                     end);
 }


 public long getCriticalCount() {

     return incidentRepository
             .countBySeverityIgnoreCase(
                     "CRITICAL");
 }


 public long getHighCount() {

     return incidentRepository
             .countBySeverityIgnoreCase(
                     "HIGH");
 }


 public long getMediumCount() {

     return incidentRepository
             .countBySeverityIgnoreCase(
                     "MEDIUM");
 }


 public long getLowCount() {

     return incidentRepository
             .countBySeverityIgnoreCase(
                     "LOW");
 }
 
 public List<Object[]> getTopAffectedSystems() {

	    return incidentRepository
	            .countByAffectedSystem();
	}
 
 public AdminReportResponse getAdminReports() {

	    LocalDateTime now =
	            LocalDateTime.now();

	    LocalDateTime start =
	            now.withDayOfMonth(1)
	               .withHour(0)
	               .withMinute(0)
	               .withSecond(0)
	               .withNano(0);

	    LocalDateTime end =
	            start.plusMonths(1);


	    // ==========================================
	    // INCIDENTS THIS MONTH
	    // ==========================================

	    long incidentsThisMonth =
	            incidentRepository
	                    .countByCreatedAtBetween(
	                            start,
	                            end);


	    // ==========================================
	    // SEVERITY
	    // ==========================================

	    long critical =
	            incidentRepository
	                    .countBySeverityIgnoreCase(
	                            "CRITICAL");

	    long high =
	            incidentRepository
	                    .countBySeverityIgnoreCase(
	                            "HIGH");

	    long medium =
	            incidentRepository
	                    .countBySeverityIgnoreCase(
	                            "MEDIUM");

	    long low =
	            incidentRepository
	                    .countBySeverityIgnoreCase(
	                            "LOW");


	    // ==========================================
	    // TOP AFFECTED SYSTEMS
	    // ==========================================

	    List<SystemReport> systems =
	            incidentRepository
	                    .countByAffectedSystem()
	                    .stream()
	                    .filter(row -> row != null && row[0] != null &&
	                            !String.valueOf(row[0]).trim().isEmpty() &&
	                            !String.valueOf(row[0]).trim().equalsIgnoreCase("null") &&
	                            !String.valueOf(row[0]).trim().equalsIgnoreCase("undefined"))
	                    .map(row ->
	                            new SystemReport(
	                                    String.valueOf(
	                                            row[0]).trim(),
	                                    ((Number) row[1])
	                                            .longValue()
	                            ))
	                    .toList();



	    // ==========================================
	    // MTTD / MTTR
	    // ==========================================

	    List<IncidentTimelineEvent> events =
	            incidentTimelineRepository
	                    .findAll();


	    Map<Long, LocalDateTime> submitted =
	            new HashMap<>();

	    Map<Long, LocalDateTime> assigned =
	            new HashMap<>();

	    Map<Long, LocalDateTime> resolved =
	            new HashMap<>();


	    for (IncidentTimelineEvent event :
	            events) {

	        if (event.getIncidentId() == null ||
	                event.getEvent() == null) {
	            continue;
	        }

	        String type =
	                event.getEvent()
	                        .toUpperCase();


	        if (type.equals("SUBMITTED")) {

	            submitted.putIfAbsent(
	                    event.getIncidentId(),
	                    event.getCreatedAt());
	        }


	        if (type.equals("ASSIGNED")) {

	            assigned.putIfAbsent(
	                    event.getIncidentId(),
	                    event.getCreatedAt());
	        }


	        if (type.equals("RESOLVED")) {

	            resolved.putIfAbsent(
	                    event.getIncidentId(),
	                    event.getCreatedAt());
	        }
	    }


	    // ==========================================
	    // CALCULATE MTTD
	    // submitted -> assigned
	    // ==========================================

	    double totalMttd = 0;

	    long mttdCount = 0;

	    for (Long incidentId :
	            submitted.keySet()) {

	        LocalDateTime submittedTime =
	                submitted.get(incidentId);

	        LocalDateTime assignedTime =
	                assigned.get(incidentId);

	        if (assignedTime != null) {

	            totalMttd +=
	                    Duration.between(
	                            submittedTime,
	                            assignedTime)
	                    .toMinutes()
	                    / 60.0;

	            mttdCount++;
	        }
	    }


	    double mttdHours =
	            mttdCount == 0
	                    ? 0
	                    : totalMttd / mttdCount;


	    // ==========================================
	    // CALCULATE MTTR
	    // assigned -> resolved
	    // ==========================================

	    double totalMttr = 0;

	    long mttrCount = 0;

	    for (Long incidentId :
	            assigned.keySet()) {

	        LocalDateTime assignedTime =
	                assigned.get(incidentId);

	        LocalDateTime resolvedTime =
	                resolved.get(incidentId);

	        if (resolvedTime != null) {

	            totalMttr +=
	                    Duration.between(
	                            assignedTime,
	                            resolvedTime)
	                    .toMinutes()
	                    / 60.0;

	            mttrCount++;
	        }
	    }


	    double mttrHours =
	            mttrCount == 0
	                    ? 0
	                    : totalMttr / mttrCount;


	    // ==========================================
	    // REPEAT INCIDENTS
	    // ==========================================

	    Map<String, Long> titleCounts =
	            events.stream()
	                    .filter(e ->
	                            e.getIncidentId() != null)
	                    .collect(
	                        Collectors.groupingBy(
	                            e -> String.valueOf(
	                                    e.getIncidentId()),
	                            Collectors.counting()
	                        ));


//	    long repeatIncidents =
//	            titleCounts.values()
//	                    .stream()
//	                    .filter(count -> count > 1)
//	                    .count();
	    long repeatIncidents = 0;


	    return new AdminReportResponse(
	            Math.round(mttdHours * 100.0) / 100.0,
	            Math.round(mttrHours * 100.0) / 100.0,
	            incidentsThisMonth,
	            repeatIncidents,
	            critical,
	            high,
	            medium,
	            low,
	            systems
	    );
	}
 
 public long getActiveIncidentCount(Long analystId) {
	    return incidentRepository
	            .countByAssignedToAndStatusNot(
	                    analystId,
	                    "RESOLVED"
	            );
	}

}