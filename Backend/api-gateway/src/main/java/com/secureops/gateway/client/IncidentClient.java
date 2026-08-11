package com.secureops.gateway.client;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.secureops.gateway.dto.IncidentSummary;

@Component
public class IncidentClient {

    private final WebClient webClient;

    public IncidentClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl("http://localhost:8082")
                .build();
    }

    public IncidentSummary getIncidentById(Long incidentId) {

        return webClient
                .get()
                .uri("/api/incidents/{id}", incidentId)
                .retrieve()
                .bodyToMono(IncidentSummary.class)
                .block();
    }

    public Long getActiveIncidentCount(Long analystId) {

        return webClient
                .get()
                .uri(
                    "/api/incidents/analyst/{analystId}/active-count",
                    analystId
                )
                .retrieve()
                .bodyToMono(Long.class)
                .block();
    }
}