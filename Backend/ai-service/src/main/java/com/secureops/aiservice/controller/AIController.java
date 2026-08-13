package com.secureops.aiservice.controller;

import org.springframework.web.bind.annotation.*;

import com.secureops.aiservice.dto.AIRequest;
import com.secureops.aiservice.dto.AIResponse;
import com.secureops.aiservice.service.AIService;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/analyze")
    public AIResponse analyze(@RequestBody AIRequest request) {

        return aiService.analyzeIncident(request);
    }
}