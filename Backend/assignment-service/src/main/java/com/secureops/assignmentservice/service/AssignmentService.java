package com.secureops.assignmentservice.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.secureops.assignmentservice.client.IncidentClient;
import com.secureops.assignmentservice.client.NotificationClient;
import com.secureops.assignmentservice.client.UserClient;
import com.secureops.assignmentservice.dto.AssignmentRequest;
import com.secureops.assignmentservice.dto.AssignmentResponse;
import com.secureops.assignmentservice.entity.Assignment;
import com.secureops.assignmentservice.repository.AssignmentRepository;
import com.secureops.common.dto.NotificationRequest;
import com.secureops.common.dto.UserResponse;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final UserClient userClient;
    private final IncidentClient incidentClient;
    private final NotificationClient notificationClient;


    public AssignmentService(AssignmentRepository assignmentRepository,UserClient userClient,
    		IncidentClient incidentClient, NotificationClient notificationClient) {
        this.assignmentRepository = assignmentRepository;
        this.userClient = userClient;
        this.incidentClient=incidentClient;
        this.notificationClient = notificationClient;

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

}