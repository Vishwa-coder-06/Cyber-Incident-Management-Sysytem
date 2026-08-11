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

import com.secureops.common.dto.IncidentSummary;
import com.secureops.common.dto.UserResponse;
import com.secureops.incidentservice.client.UserClient;
import com.secureops.incidentservice.dto.AdminReportResponse;
import com.secureops.incidentservice.dto.AnalystInvestigationResponse;
import com.secureops.incidentservice.dto.IncidentAnalysisResponse;
import com.secureops.incidentservice.dto.IncidentDashboardResponse;
import com.secureops.incidentservice.dto.IncidentRequest;
import com.secureops.incidentservice.dto.IncidentResponse;
import com.secureops.incidentservice.dto.IncidentTimelineResponse;
import com.secureops.incidentservice.dto.IncidentTrendResponse;
import com.secureops.incidentservice.dto.ReporterDashboardResponse;
import com.secureops.incidentservice.dto.ReporterIncidentDetailResponse;
import com.secureops.incidentservice.dto.ReporterIncidentRequest;
import com.secureops.incidentservice.dto.ReporterIncidentResponse;
import com.secureops.incidentservice.dto.SystemReport;
import com.secureops.incidentservice.entity.Incident;
import com.secureops.incidentservice.entity.IncidentAnalysis;
import com.secureops.incidentservice.entity.IncidentTimelineEvent;
import com.secureops.incidentservice.repository.IncidentAnalysisRepository;
import com.secureops.incidentservice.repository.IncidentRepository;
import com.secureops.incidentservice.repository.IncidentTimelineRepository;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final UserClient userClient;
    private final IncidentAnalysisRepository incidentAnalysisRepository;
    private final IncidentTimelineRepository incidentTimelineRepository;
    private final IncidentTimelineRepository incidentTimelineEventRepository;

    public IncidentService(IncidentRepository incidentRepository, UserClient userClient,
    		IncidentAnalysisRepository incidentAnalysisRepository,IncidentTimelineRepository incidentTimelineRepository,
    		IncidentTimelineRepository incidentTimelineEventRepository) {
        this.incidentRepository = incidentRepository;
        this.userClient = userClient;
        this.incidentAnalysisRepository = incidentAnalysisRepository;
        this.incidentTimelineRepository = incidentTimelineRepository;
        this.incidentTimelineEventRepository = incidentTimelineEventRepository;

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

    		return incidentRepository.save(incident);

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

        UserResponse user =
                userClient.getUserByEmail(email);

        Incident incident = new Incident();

        incident.setTitle(request.getTitle());
        incident.setAffectedSystem(request.getAffectedSystem());
        incident.setIncidentDateTime(
                request.getIncidentDateTime());
        incident.setDescription(request.getDescription());

        incident.setReportedBy(user.getUserId());

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

        UserResponse user =
                userClient.getUserByEmail(email);

        Incident incident = new Incident();

        incident.setTitle(request.getTitle());
        incident.setAffectedSystem(
                request.getAffectedSystem());

        incident.setIncidentDateTime(
                request.getIncidentDateTime());

        incident.setDescription(
                request.getDescription());

        incident.setReportedBy(
                user.getUserId());

        incident.setStatus("OPEN");

        incident.setCreatedAt(LocalDateTime.now());
        incident.setUpdatedAt(LocalDateTime.now());

        Incident saved =
                incidentRepository.save(incident);

        //analyzeIncident(saved.getIncidentId());

        return new IncidentResponse(
                saved.getIncidentId(),
                saved.getTitle(),
                saved.getStatus(),
                "Incident Submitted Successfully"
        );
    }
    
    public IncidentAnalysisResponse analyzeIncident(
            Long incidentId) {

        Incident incident =
                incidentRepository.findById(incidentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Incident Not Found"));

        String text =
                (incident.getTitle() + " "
                        + incident.getDescription())
                        .toLowerCase();

        IncidentAnalysis analysis =
                new IncidentAnalysis();

        analysis.setIncidentId(incidentId);
        analysis.setAnalyzedAt(LocalDateTime.now());

        if (text.contains("sql")
                || text.contains("injection")) {

            analysis.setCategory(
                    "Application Security");

            analysis.setSeverity("CRITICAL");

            analysis.setRootCause(
                    "Malicious SQL input may have been "
                    + "used to manipulate application queries.");

            analysis.setImmediateAdvice(
                    "Block the suspicious source, review "
                    + "database logs and validate all inputs.");

            analysis.setRecommendedPlaybookId("PB-001");

            analysis.setRecommendedPlaybookTitle(
                    "SQL Injection Response");

        } else if (text.contains("phishing")
                || text.contains("email")) {

            analysis.setCategory("Email Security");

            analysis.setSeverity("HIGH");

            analysis.setRootCause(
                    "Potential phishing activity detected "
                    + "through suspicious email content.");

            analysis.setImmediateAdvice(
                    "Do not open suspicious links or "
                    + "attachments. Report the sender.");

            analysis.setRecommendedPlaybookId("PB-002");

            analysis.setRecommendedPlaybookTitle(
                    "Phishing Response");

        } else {

            analysis.setCategory("Security Incident");

            analysis.setSeverity("MEDIUM");

            analysis.setRootCause(
                    "Potential security event requiring "
                    + "further investigation.");

            analysis.setImmediateAdvice(
                    "Collect evidence and review relevant "
                    + "system logs.");

            analysis.setRecommendedPlaybookId("PB-003");

            analysis.setRecommendedPlaybookTitle(
                    "General Incident Response");
        }

        incident.setCategory(
                analysis.getCategory());

        incident.setSeverity(
                analysis.getSeverity());

        incident.setUpdatedAt(
                LocalDateTime.now());

        incidentRepository.save(incident);

        IncidentAnalysis saved =
                incidentAnalysisRepository.save(analysis);

        return new IncidentAnalysisResponse(
                incidentId,
                incident.getTitle(),
                saved.getCategory(),
                saved.getSeverity(),
                saved.getRootCause(),
                saved.getImmediateAdvice(),
                saved.getRecommendedPlaybookId(),
                saved.getRecommendedPlaybookTitle(),
                saved.getAnalyzedAt()
        );
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
                                        "Analysis Not Found"));

        return new IncidentAnalysisResponse(
                incidentId,
                incident.getTitle(),
                analysis.getCategory(),
                analysis.getSeverity(),
                analysis.getRootCause(),
                analysis.getImmediateAdvice(),
                analysis.getRecommendedPlaybookId(),
                analysis.getRecommendedPlaybookTitle(),
                analysis.getAnalyzedAt()
        );
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

            analysisResponse =
                    new IncidentAnalysisResponse(
                            incident.getIncidentId(),
                            incident.getTitle(),
                            analysis.getCategory(),
                            analysis.getSeverity(),
                            analysis.getRootCause(),
                            analysis.getImmediateAdvice(),
                            analysis.getRecommendedPlaybookId(),
                            analysis.getRecommendedPlaybookTitle(),
                            analysis.getAnalyzedAt()
                    );
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

        return incidentTimelineEventRepository.save(event);
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
	                    .map(row ->
	                            new SystemReport(
	                                    String.valueOf(
	                                            row[0]),
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
 

}