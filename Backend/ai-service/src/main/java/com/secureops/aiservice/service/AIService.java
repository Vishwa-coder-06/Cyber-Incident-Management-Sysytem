package com.secureops.aiservice.service;

import org.springframework.stereotype.Service;

import com.secureops.aiservice.dto.AIRequest;
import com.secureops.aiservice.dto.AIResponse;

@Service
public class AIService {

    public AIResponse analyzeIncident(AIRequest request) {

        return new AIResponse(
                "Pending",
                "Pending",
                "AI Module Under Development"
        );

    }

}