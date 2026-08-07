package com.secureops.assignmentservice.service;

import java.time.LocalDateTime;
import com.secureops.common.dto.UserResponse;
import java.util.List;

import org.springframework.stereotype.Service;

import com.secureops.assignmentservice.client.IncidentClient;
import com.secureops.assignmentservice.client.UserClient;
import com.secureops.assignmentservice.dto.AssignmentRequest;
import com.secureops.assignmentservice.dto.AssignmentResponse;
import com.secureops.assignmentservice.entity.Assignment;
import com.secureops.assignmentservice.repository.AssignmentRepository;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final UserClient userClient;
    private final IncidentClient incidentClient;


    public AssignmentService(AssignmentRepository assignmentRepository,UserClient userClient,
    		IncidentClient incidentClient) {
        this.assignmentRepository = assignmentRepository;
        this.userClient = userClient;
        this.incidentClient=incidentClient;

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

}