package com.secureops.incidentservice.controller;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.secureops.incidentservice.entity.AITrainingExample;
import com.secureops.incidentservice.service.AITrainingService;

@RestController
@RequestMapping("/api/training")
public class AITrainingController {

    private final AITrainingService trainingService;

    public AITrainingController(AITrainingService trainingService) {
        this.trainingService = trainingService;
    }

    @PostMapping("/incident/{incidentId}")
    public AITrainingExample stageTrainingData(
            @PathVariable Long incidentId,
            Authentication authentication) {
        String user = authentication != null ? authentication.getName() : "Analyst";
        return trainingService.createTrainingExample(incidentId, user);
    }

    @GetMapping
    public List<AITrainingExample> getAllTrainingExamples() {
        return trainingService.getAllExamples();
    }

    @GetMapping("/approved")
    public List<AITrainingExample> getApprovedTrainingExamples() {
        return trainingService.getApprovedExamples();
    }

    @PutMapping("/{id}/approve")
    public AITrainingExample approveTrainingExample(
            @PathVariable Long id,
            Authentication authentication) {
        if (authentication == null || authentication.getAuthorities().stream()
                .noneMatch(a -> a.getAuthority().equalsIgnoreCase("ROLE_ADMIN")
                        || a.getAuthority().equalsIgnoreCase("ADMIN")
                        || a.getAuthority().equalsIgnoreCase("ROLE_ROLE_ADMIN"))) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN,
                    "Access Denied: Only ADMIN users can approve training data candidates.");
        }
        String adminUser = authentication.getName();
        return trainingService.approveTrainingExample(id, adminUser);
    }

    @GetMapping("/status")
    public Map<String, Object> getTrainingStatus() {
        return trainingService.getTrainingStatus();
    }

    @PostMapping("/retrain")
    public Map<String, Object> retrainModel(Authentication authentication) {
        if (authentication == null || authentication.getAuthorities().stream()
                .noneMatch(a -> a.getAuthority().equalsIgnoreCase("ROLE_ADMIN")
                        || a.getAuthority().equalsIgnoreCase("ADMIN")
                        || a.getAuthority().equalsIgnoreCase("ROLE_ROLE_ADMIN"))) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN,
                    "Access Denied: Only ADMIN users can trigger model retraining.");
        }
        String adminUser = authentication.getName();

        return trainingService.triggerExplicitRetrain(adminUser);
    }
}


