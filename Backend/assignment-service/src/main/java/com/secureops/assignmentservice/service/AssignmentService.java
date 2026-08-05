package com.secureops.assignmentservice.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.secureops.assignmentservice.dto.AssignmentRequest;
import com.secureops.assignmentservice.dto.AssignmentResponse;
import com.secureops.assignmentservice.entity.Assignment;
import com.secureops.assignmentservice.repository.AssignmentRepository;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;

    public AssignmentService(AssignmentRepository assignmentRepository) {
        this.assignmentRepository = assignmentRepository;
    }

    // Create Assignment

    public AssignmentResponse createAssignment(AssignmentRequest request) {

        Assignment assignment = new Assignment();

        assignment.setIncidentId(request.getIncidentId());
        assignment.setAnalystId(request.getAnalystId());
        assignment.setManagerId(request.getManagerId());
        assignment.setStatus(request.getStatus());
        assignment.setAssignedAt(LocalDateTime.now());

        Assignment saved = assignmentRepository.save(assignment);

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