package com.secureops.aiservice.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.secureops.aiservice.dto.AIRequest;
import com.secureops.aiservice.dto.AIResponse;
import com.secureops.aiservice.dto.SimilarIncidentDTO;

@Service
public class AIService {

    private final RestClient restClient;
    private final String mlServiceUrl;

    public AIService(
            @Value("${ml.service.url:http://localhost:5000}") String mlServiceUrl) {

        this.mlServiceUrl = mlServiceUrl;
        this.restClient = RestClient.builder()
                .baseUrl(mlServiceUrl)
                .build();
    }

    public AIResponse analyzeIncident(AIRequest request) {

        if (request == null ||
                request.getIncidentDescription() == null ||
                request.getIncidentDescription().isBlank()) {
            throw new IllegalArgumentException("Incident description is required");
        }

        System.out.println("[AI-SERVICE] analyzeIncident called");
        System.out.println("[AI-SERVICE] incidentDescription: " + request.getIncidentDescription());
        System.out.println("[AI-SERVICE] severity: " + request.getSeverity());
        System.out.println("[AI-SERVICE] Calling Python at: " + mlServiceUrl + "/predict");

        PythonAIRequest mlRequest = new PythonAIRequest(request.getIncidentDescription());

        System.out.println("[AI-SERVICE] Python request body: {\"description\": \"" + request.getIncidentDescription() + "\"}");

        PythonAIResponse mlResponse;
        try {
            mlResponse = restClient.post()
                    .uri("/predict")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(mlRequest)
                    .retrieve()
                    .body(PythonAIResponse.class);
            System.out.println("[AI-SERVICE] Python response received: " + mlResponse);
        } catch (Exception e) {
            System.err.println("[AI-SERVICE] ERROR calling Python service: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to call Python ML service: " + e.getMessage(), e);
        }

        if (mlResponse == null) {
            System.err.println("[AI-SERVICE] Python returned null response");
            throw new RuntimeException("No response received from ML service");
        }

        System.out.println("[AI-SERVICE] attackType=" + mlResponse.attackType);
        System.out.println("[AI-SERVICE] confidence=" + mlResponse.confidence);
        System.out.println("[AI-SERVICE] rootCause=" + mlResponse.rootCause);
        System.out.println("[AI-SERVICE] immediateAdvice=" + mlResponse.immediateAdvice);
        System.out.println("[AI-SERVICE] recommendedPlaybookTitle=" + mlResponse.recommendedPlaybookTitle);
        System.out.println("[AI-SERVICE] similarIncidents count=" + (mlResponse.similarIncidents != null ? mlResponse.similarIncidents.size() : 0));

        List<SimilarIncidentDTO> mappedSimilar = null;
        if (mlResponse.similarIncidents != null) {
            mappedSimilar = mlResponse.similarIncidents.stream()
                    .map(item -> new SimilarIncidentDTO(
                            item.category,
                            item.description,
                            item.similarity
                    ))
                    .toList();
        }

        AIResponse aiResponse = new AIResponse(
                mlResponse.attackType,
                mlResponse.confidence,
                request.getSeverity(),
                mlResponse.recommendedPlaybookTitle,
                mlResponse.rootCause,
                mlResponse.immediateAdvice,
                mlResponse.recommendedPlaybookTitle,
                mappedSimilar
        );

        System.out.println("[AI-SERVICE] Returning AIResponse successfully");
        return aiResponse;
    }


    // Request sent to Python
    private record PythonAIRequest(
            String description
    ) {}


    // Response received from Python
    private static class PythonAIResponse {

        public String attackType;

        public Double confidence;

        public String rootCause;

        public String immediateAdvice;

        public String recommendedPlaybookTitle;

        public List<PythonSimilarIncident> similarIncidents;
    }

    private static class PythonSimilarIncident {
        public String category;
        public String description;
        public Double similarity;
    }
}