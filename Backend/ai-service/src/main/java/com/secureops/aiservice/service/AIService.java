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

    public AIService(
            @Value("${ml.service.url:http://localhost:5000}") String mlServiceUrl) {

        this.restClient = RestClient.builder()
                .baseUrl(mlServiceUrl)
                .build();
    }

    public AIResponse analyzeIncident(AIRequest request) {

        if (request == null ||
                request.getIncidentDescription() == null ||
                request.getIncidentDescription().isBlank()) {

            throw new IllegalArgumentException(
                    "Incident description is required"
            );
        }

        PythonAIRequest mlRequest = new PythonAIRequest(
                request.getIncidentDescription()
        );

        PythonAIResponse mlResponse =
                restClient.post()
                        .uri("/predict")
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(mlRequest)
                        .retrieve()
                        .body(PythonAIResponse.class);

        if (mlResponse == null) {
            throw new RuntimeException(
                    "No response received from ML service"
            );
        }

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

        return new AIResponse(
                mlResponse.attackType,
                mlResponse.confidence,
                request.getSeverity(),
                mlResponse.recommendedPlaybookTitle, // recommendation field
                mlResponse.rootCause,
                mlResponse.immediateAdvice,
                mlResponse.recommendedPlaybookTitle,
                mappedSimilar
        );
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