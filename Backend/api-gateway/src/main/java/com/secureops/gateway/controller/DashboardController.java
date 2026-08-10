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
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {

        Mono<Object> users =
                webClient.get()
                        .uri("http://localhost:8081/api/users")
                        .header(HttpHeaders.AUTHORIZATION, token)
                        .retrieve()
                        .bodyToMono(Object.class);

        Mono<Object> knowledge =
                webClient.get()
                        .uri("http://localhost:8085/api/articles")
                        .header(HttpHeaders.AUTHORIZATION, token)
                        .retrieve()
                        .bodyToMono(Object.class);

        Mono<Long> auditCount =
                webClient.get()
                        .uri("http://localhost:8087/api/audits/today/count")
                        .header(HttpHeaders.AUTHORIZATION, token)
                        .retrieve()
                        .bodyToMono(Long.class);

        Mono<Object> recentAudits =
                webClient.get()
                        .uri("http://localhost:8087/api/audits/recent")
                        .header(HttpHeaders.AUTHORIZATION, token)
                        .retrieve()
                        .bodyToMono(Object.class);
        
        Mono<Long> activePlaybooks =
                webClient.get()
                        .uri("http://localhost:8085/api/articles/playbooks/active/count")
                        .header(HttpHeaders.AUTHORIZATION, token)
                        .retrieve()
                        .bodyToMono(Long.class);

        Mono<Object> incidentTrend =
                webClient.get()
                        .uri("http://localhost:8082/api/incidents/dashboard/trend")
                        .header(HttpHeaders.AUTHORIZATION, token)
                        .retrieve()
                        .bodyToMono(Object.class);

        return Mono.zip(
                users,
                knowledge,
                auditCount,
                recentAudits,
                activePlaybooks,
                incidentTrend
        ).map(result -> {

            Object usersData = result.getT1();
            Object knowledgeData = result.getT2();

            long totalUsers = 0;
            long kbArticles = 0;

            if (usersData instanceof java.util.List<?> list) {
                totalUsers = list.size();
            }

            if (knowledgeData instanceof java.util.List<?> list) {
                kbArticles = list.size();
            }

            return new AdminDashboardResponse(
            		totalUsers,
                    result.getT5(),
                    kbArticles,
                    result.getT3(),
                    result.getT6(),
                    result.getT4()
            );
        });
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