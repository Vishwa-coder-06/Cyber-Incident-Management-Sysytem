package com.secureops.gateway.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import com.secureops.gateway.dto.AdminDashboardResponse;

import reactor.core.publisher.Mono;

@RestController
public class DashboardController {

    private final WebClient webClient;

    public DashboardController(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @GetMapping("/api/dashboard/admin")
    public Mono<AdminDashboardResponse> getAdminDashboard(
            @RequestHeader(
                    value = HttpHeaders.AUTHORIZATION,
                    required = false
            ) String token) {

        if (token == null) {
            throw new RuntimeException("Authorization token is required");
        }

        Mono<Object> users =
                webClient.get()
                        .uri("http://localhost:8081/api/users/dashboard")
                        .header(HttpHeaders.AUTHORIZATION, token)
                        .retrieve()
                        .bodyToMono(Object.class);

        Mono<Object> incidents =
                webClient.get()
                        .uri("http://localhost:8082/api/incidents/dashboard")
                        .header(HttpHeaders.AUTHORIZATION, token)
                        .retrieve()
                        .bodyToMono(Object.class);

        Mono<Object> assignments =
                webClient.get()
                        .uri("http://localhost:8083/api/assignments/dashboard")
                        .header(HttpHeaders.AUTHORIZATION, token)
                        .retrieve()
                        .bodyToMono(Object.class);

        return Mono.zip(users, incidents, assignments)
                .map(result ->
                        new AdminDashboardResponse(
                                result.getT1(),
                                result.getT2(),
                                result.getT3()
                        ));
    }
    
    @GetMapping("/api/dashboard/reporter/{userId}")
    public Mono<Object> getReporterDashboard(
            @PathVariable Long userId,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {

        return webClient.get()
                .uri("http://localhost:8082/api/incidents/reporter/dashboard/" + userId)
                .header(HttpHeaders.AUTHORIZATION, token)
                .retrieve()
                .bodyToMono(Object.class);
    }
    
    @GetMapping("/api/dashboard/manager")
    public Mono<Object> getManagerDashboard(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {

        return webClient.get()
                .uri("http://localhost:8083/api/assignments/manager/dashboard")
                .header(HttpHeaders.AUTHORIZATION, token)
                .retrieve()
                .bodyToMono(Object.class);
    }
}