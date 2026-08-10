package com.secureops.assignmentservice.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.secureops.assignmentservice.client.IncidentClient;
import com.secureops.assignmentservice.client.KnowledgeClient;
import com.secureops.assignmentservice.client.NotificationClient;
import com.secureops.assignmentservice.client.UserClient;
import com.secureops.assignmentservice.dto.AnalystDashboardResponse;
import com.secureops.assignmentservice.dto.AnalystIncidentResponse;
import com.secureops.assignmentservice.dto.AnalystWorkloadResponse;
import com.secureops.assignmentservice.dto.AssignmentDashboardResponse;
import com.secureops.assignmentservice.dto.AssignmentRequest;
import com.secureops.assignmentservice.dto.AssignmentResponse;
import com.secureops.assignmentservice.dto.ManagerDashboardResponse;
import com.secureops.assignmentservice.dto.UnassignedIncidentResponse;
import com.secureops.assignmentservice.entity.Assignment;
import com.secureops.assignmentservice.repository.AssignmentRepository;
import com.secureops.common.dto.IncidentSummary;
import com.secureops.common.dto.KnowledgeSummary;
import com.secureops.common.dto.NotificationRequest;
import com.secureops.common.dto.UserResponse;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final UserClient userClient;
    private final IncidentClient incidentClient;
    private final NotificationClient notificationClient;
    private final KnowledgeClient knowledgeClient;


    public AssignmentService(AssignmentRepository assignmentRepository,UserClient userClient,
    		IncidentClient incidentClient, NotificationClient notificationClient, KnowledgeClient knowledgeClient) {
        this.assignmentRepository = assignmentRepository;
        this.userClient = userClient;
        this.incidentClient=incidentClient;
        this.notificationClient = notificationClient;
        this.knowledgeClient = knowledgeClient;


    }

    // Create Assignment

    public AssignmentResponse createAssignment(AssignmentRequest request) {
    	UserResponse analyst =
    	        userClient.getUserById(request.getAnalystId());

    	if (analyst == null) {
    	    throw new RuntimeException("Analyst Not Found");
    	}

    	if (!"ANALYST".equalsIgnoreCase(analyst.getRole())) {
    	    throw new RuntimeException("Selected user is not an Analyst");
    	}

        Assignment assignment = new Assignment();

        assignment.setIncidentId(request.getIncidentId());
        assignment.setAnalystId(request.getAnalystId());
        assignment.setManagerId(request.getManagerId());
        assignment.setStatus("ASSIGNED");
        assignment.setAssignedAt(LocalDateTime.now());

        Assignment saved = assignmentRepository.save(assignment);
        incidentClient.assignIncident(

                saved.getIncidentId(),

                saved.getAnalystId()

        );
        
        NotificationRequest notification =
                new NotificationRequest();

        notification.setUserId(saved.getAnalystId());

        notification.setTitle("New Incident Assigned");

        notification.setMessage(
                "Incident #" + saved.getIncidentId()
                + " has been assigned to you."
        );

        notificationClient.createNotification(notification);

        return new AssignmentResponse(
                saved.getAssignmentId(),
                saved.getIncidentId(),
                saved.getAnalystId(),
                "Assignment Created Successfully"
        );

    }

    // Get All

    public List<Assignment> getAllAssignments() {

        return assignmentRepository.findAll();

    }

    // Get By ID

    public Assignment getAssignmentById(Long id) {

        return assignmentRepository.findById(id).orElse(null);

    }

    // Update

    public Assignment updateAssignment(Long id, Assignment updatedAssignment) {

        Assignment assignment = assignmentRepository.findById(id).orElse(null);

        if (assignment == null) {
            return null;
        }

        assignment.setIncidentId(updatedAssignment.getIncidentId());
        assignment.setAnalystId(updatedAssignment.getAnalystId());
        assignment.setManagerId(updatedAssignment.getManagerId());
        assignment.setStatus(updatedAssignment.getStatus());

        return assignmentRepository.save(assignment);

    }

    // Delete

    public void deleteAssignment(Long id) {

        assignmentRepository.deleteById(id);

    }
    
 // Update Assignment Status
 
    public Assignment updateAssignmentStatus(Long id, String status) {

        Assignment assignment =
                assignmentRepository.findById(id).orElse(null);

        if (assignment == null) {
            return null;
        }

        assignment.setStatus(status);
        
        if ("RESOLVED".equalsIgnoreCase(status)) {
            assignment.setResolvedAt(LocalDateTime.now());
        }

        Assignment saved = assignmentRepository.save(assignment);

        // 1. Update Incident Service
        incidentClient.updateIncidentStatus(
                saved.getIncidentId(),
                status
        );

        // 2. Create Notification
        NotificationRequest notification =
                new NotificationRequest();

        notification.setUserId(saved.getAnalystId());
        notification.setTitle("Incident Status Updated");
        notification.setMessage(
                "Incident " + saved.getIncidentId()
                + " status changed to " + status
        );

        notificationClient.createNotification(notification);

        return saved;
    }
    
    public AssignmentDashboardResponse getDashboardData() {

        long total = assignmentRepository.count();

        long assigned =
                assignmentRepository.countByStatus("ASSIGNED");

        long inProgress =
                assignmentRepository.countByStatus("IN_PROGRESS");

        long resolved =
                assignmentRepository.countByStatus("RESOLVED");

        return new AssignmentDashboardResponse(
                total,
                assigned,
                inProgress,
                resolved
        );
    }
    
    public AnalystDashboardResponse getAnalystDashboard(
            Long analystId) {

        long assignedToYou =
                assignmentRepository.countByAnalystId(analystId);

        LocalDateTime startOfWeek =
                LocalDateTime.now()
                        .with(java.time.DayOfWeek.MONDAY)
                        .toLocalDate()
                        .atStartOfDay();

        long resolvedThisWeek =
                assignmentRepository
                        .countByAnalystIdAndStatusIgnoreCaseAndResolvedAtAfter(
                                analystId,
                                "RESOLVED",
                                startOfWeek);

        List<Assignment> activeAssignments =
                assignmentRepository.findByAnalystId(analystId)
                        .stream()
                        .filter(a ->
                                !"RESOLVED".equalsIgnoreCase(
                                        a.getStatus()))
                        .toList();

        List<AnalystIncidentResponse> activeIncidents =
                activeAssignments.stream()
                        .map(a -> {

                            IncidentSummary incident =
                                    incidentClient.getIncidentSummary(
                                            a.getIncidentId());

                            return new AnalystIncidentResponse(
                                    incident.getIncidentId(),
                                    incident.getTitle(),
                                    incident.getSeverity()
                            );
                        })
                        .toList();

        List<Assignment> resolvedAssignments =
                assignmentRepository.findByAnalystId(analystId)
                        .stream()
                        .filter(a ->
                                "RESOLVED".equalsIgnoreCase(
                                        a.getStatus())
                                && a.getResolvedAt() != null)
                        .toList();

        double averageHours = 0;

        if (!resolvedAssignments.isEmpty()) {

            long totalMinutes =
                    resolvedAssignments.stream()
                            .mapToLong(a ->
                                    java.time.Duration.between(
                                            a.getAssignedAt(),
                                            a.getResolvedAt())
                                    .toMinutes())
                            .sum();

            averageHours =
                    (double) totalMinutes
                    / resolvedAssignments.size()
                    / 60;
        }

        String averageResolutionTime =
                String.format("%.1fh", averageHours);
        
        List<KnowledgeSummary> recentKbArticles =
                knowledgeClient.getRecentArticles();

        return new AnalystDashboardResponse(
                assignedToYou,
                resolvedThisWeek,
                averageResolutionTime,
                activeIncidents,
                recentKbArticles

        );
    }
    
    public ManagerDashboardResponse getManagerDashboard() {

        long openIncidents =
                incidentClient.getOpenIncidentCount();

        long resolvedToday =
               incidentClient.getResolvedToday();

        List<IncidentSummary> unassigned =
                incidentClient.getUnassignedIncidents();

        List<UserResponse> analysts =
                userClient.getUsersByRole("ANALYST");

        List<AnalystWorkloadResponse> workload =
                analysts.stream()
                        .map(analyst -> {

                            long count =
                                    assignmentRepository
                                            .countByAnalystId(
                                                    analyst.getUserId());

                            return new AnalystWorkloadResponse(
                                    analyst.getUserId(),
                                    analyst.getFirstName(),
                                    count
                            );
                        })
                        .toList();

        List<UnassignedIncidentResponse> incidents =
                unassigned.stream()
                        .map(i ->
                                new UnassignedIncidentResponse(
                                        i.getIncidentId(),
                                        i.getTitle(),
                                        i.getSeverity()
                                ))
                        .toList();
        
        List<Assignment> resolvedAssignments =
                assignmentRepository.findAll()
                        .stream()
                        .filter(a ->
                                "RESOLVED".equalsIgnoreCase(a.getStatus())
                                && a.getAssignedAt() != null
                                && a.getResolvedAt() != null)
                        .toList();

        double averageHours = 0;

        if (!resolvedAssignments.isEmpty()) {

            long totalMinutes =
                    resolvedAssignments.stream()
                            .mapToLong(a ->
                                    java.time.Duration.between(
                                            a.getAssignedAt(),
                                            a.getResolvedAt()
                                    ).toMinutes())
                            .sum();

            averageHours =
                    (double) totalMinutes
                    / resolvedAssignments.size()
                    / 60;
        }

        String mttr =
                String.format("%.1fh", averageHours);

        return new ManagerDashboardResponse(
                openIncidents,
                mttr,
                resolvedToday,
                workload,
                incidents
        );
    }

}