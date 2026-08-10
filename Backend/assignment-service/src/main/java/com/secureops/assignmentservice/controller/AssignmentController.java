package com.secureops.assignmentservice.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.secureops.assignmentservice.client.IncidentClient;
import com.secureops.assignmentservice.client.UserClient;
import com.secureops.assignmentservice.dto.AnalystDashboardResponse;
import com.secureops.assignmentservice.dto.AssignmentDashboardResponse;
import com.secureops.assignmentservice.dto.AssignmentRequest;
import com.secureops.assignmentservice.dto.AssignmentResponse;
import com.secureops.assignmentservice.dto.ManagerDashboardResponse;
import com.secureops.assignmentservice.entity.Assignment;
import com.secureops.assignmentservice.service.AssignmentService;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin("*")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    // Create

    @PostMapping
    public AssignmentResponse createAssignment(@RequestBody AssignmentRequest request) {

        return assignmentService.createAssignment(request);

    }

    // Get All

    @GetMapping
    public List<Assignment> getAllAssignments() {

        return assignmentService.getAllAssignments();

    }

    // Get By ID

    @GetMapping("/{id}")
    public Assignment getAssignmentById(@PathVariable Long id) {

        return assignmentService.getAssignmentById(id);

    }

    // Update

    @PutMapping("/{id}")
    public Assignment updateAssignment(@PathVariable Long id,
                                       @RequestBody Assignment assignment) {

        return assignmentService.updateAssignment(id, assignment);

    }

    // Delete

    @DeleteMapping("/{id}")
    public void deleteAssignment(@PathVariable Long id) {

        assignmentService.deleteAssignment(id);

    }
    
    @PutMapping("/{id}/status")
    public Assignment updateAssignmentStatus(@PathVariable Long id,
    		@RequestParam String status) {
    	
    	return assignmentService.updateAssignmentStatus(id, status);
    }
    
    @GetMapping("/dashboard")
    public AssignmentDashboardResponse getDashboardData() {

        return assignmentService.getDashboardData();
    }
    
    @GetMapping("/analyst/dashboard/{analystId}")
    public AnalystDashboardResponse getAnalystDashboard(
            @PathVariable Long analystId) {

        return assignmentService.getAnalystDashboard(analystId);
    }
    
    @GetMapping("/manager/dashboard")
    public ManagerDashboardResponse getManagerDashboard() {

        return assignmentService.getManagerDashboard();
    }

}