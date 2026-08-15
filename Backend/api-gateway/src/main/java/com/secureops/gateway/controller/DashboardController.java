package com.secureops.gateway.controller;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import com.secureops.gateway.dto.AdminDashboardResponse;
import com.secureops.gateway.dto.AnalystAssignmentResponse;
import com.secureops.gateway.dto.IncidentSummary;
import com.secureops.gateway.dto.ManagerAssignmentResponse;
import com.secureops.gateway.dto.ManagerWorkloadResponse;

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
    
    @GetMapping("/api/dashboard/manager/assign/{incidentId}")
    public Mono<ManagerAssignmentResponse> getManagerAssignmentData(
            @PathVariable Long incidentId,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {

        // 1. Get incident details
        Mono<IncidentSummary> incident =
                webClient.get()
                        .uri(
                            "http://localhost:8082/api/incidents/{id}",
                            incidentId
                        )
                        .header(
                            HttpHeaders.AUTHORIZATION,
                            token
                        )
                        .retrieve()
                        .bodyToMono(IncidentSummary.class);


        // 2. Get all analysts
        Mono<List<Map<String, Object>>> analysts =
                webClient.get()
                        .uri(
                            "http://localhost:8081/api/users/role/ANALYST"
                        )
                        .header(
                            HttpHeaders.AUTHORIZATION,
                            token
                        )
                        .retrieve()
                        .bodyToMono(
                            new ParameterizedTypeReference<
                                    List<Map<String, Object>>>() {}
                        );


        // 3. Combine incident + analysts
        return Mono.zip(incident, analysts)
                .flatMap(result -> {

                    IncidentSummary incidentData =
                            result.getT1();

                    List<Map<String, Object>> analystList =
                            result.getT2();


                    // 4. Get active incident count for every analyst
                    List<Mono<AnalystAssignmentResponse>>
                            analystRequests =
                            analystList.stream()
                                    .map(analyst -> {

                                        Long analystId =
                                                ((Number) analyst.get("userId"))
                                                        .longValue();

                                        String firstName =
                                                String.valueOf(
                                                        analyst.get("firstName"));

                                        String lastName =
                                                String.valueOf(
                                                        analyst.get("lastName"));

                                        String email =
                                                String.valueOf(
                                                        analyst.get("email"));


                                        return webClient.get()
                                                .uri(
                                                    "http://localhost:8082/api/incidents/analyst/{analystId}/active-count",
                                                    analystId
                                                )
                                                .header(
                                                    HttpHeaders.AUTHORIZATION,
                                                    token
                                                )
                                                .retrieve()
                                                .bodyToMono(Long.class)
                                                .map(count -> {

                                                    String availability;

                                                    if (count <= 3) {
                                                        availability = "HIGH";
                                                    }
                                                    else if (count <= 6) {
                                                        availability = "MEDIUM";
                                                    }
                                                    else {
                                                        availability = "LOW";
                                                    }


                                                    return new AnalystAssignmentResponse(
                                                            analystId,
                                                            firstName
                                                                    + " "
                                                                    + lastName,
                                                            email,
                                                            count,
                                                            availability
                                                    );
                                                });
                                    })
                                    .toList();


                    // 5. Wait for all analyst workload requests
                    return Mono.zip(
                            analystRequests,
                            results -> {

                                List<AnalystAssignmentResponse>
                                        analystResponses =
                                        java.util.Arrays.stream(results)
                                                .map(item ->
                                                        (AnalystAssignmentResponse)
                                                                item)
                                                .toList();


                                // 6. Find analyst with lowest workload
                                AnalystAssignmentResponse
                                        recommendedAnalyst =
                                        analystResponses.stream()
                                                .min(
                                                    Comparator.comparingLong(
                                                        AnalystAssignmentResponse
                                                                ::getActiveIncidents
                                                    )
                                                )
                                                .orElse(null);


                                // 7. Return complete response
                                return new ManagerAssignmentResponse(
                                        incidentData,
                                        analystResponses,
                                        recommendedAnalyst
                                );
                            }
                    );
                });
    }
    
    @GetMapping("/api/dashboard/manager/workload")
    public Mono<ManagerWorkloadResponse> getManagerWorkload(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {

        // Get all analysts
        Mono<List<Map<String, Object>>> analysts =
                webClient.get()
                        .uri("http://localhost:8081/api/users/role/ANALYST")
                        .header(HttpHeaders.AUTHORIZATION, token)
                        .retrieve()
                        .bodyToMono(
                                new ParameterizedTypeReference<
                                        List<Map<String, Object>>>() {}
                        );


        // Get workload for every analyst
        return analysts.flatMap(analystList -> {

            List<Mono<AnalystAssignmentResponse>> requests =
                    analystList.stream()
                            .map(analyst -> {

                                Long analystId =
                                        ((Number) analyst.get("userId"))
                                                .longValue();

                                String firstName =
                                        String.valueOf(
                                                analyst.get("firstName"));

                                String lastName =
                                        String.valueOf(
                                                analyst.get("lastName"));

                                String email =
                                        String.valueOf(
                                                analyst.get("email"));


                                return webClient.get()
                                        .uri(
                                            "http://localhost:8082/api/incidents/analyst/{analystId}/active-count",
                                            analystId
                                        )
                                        .header(
                                            HttpHeaders.AUTHORIZATION,
                                            token
                                        )
                                        .retrieve()
                                        .bodyToMono(Long.class)
                                        .map(count -> {

                                            String availability;

                                            if (count <= 3) {
                                                availability = "LOW";
                                            }
                                            else if (count <= 6) {
                                                availability = "MEDIUM";
                                            }
                                            else {
                                                availability = "HIGH";
                                            }


                                            return new AnalystAssignmentResponse(
                                                    analystId,
                                                    firstName + " " + lastName,
                                                    email,
                                                    count,
                                                    availability
                                            );
                                        });

                            })
                            .toList();


            return Mono.zip(
                    requests,
                    results -> {

                        List<AnalystAssignmentResponse>
                                workload =
                                java.util.Arrays.stream(results)
                                        .map(result ->
                                                (AnalystAssignmentResponse)
                                                        result)
                                        .toList();


                        long totalAnalysts =
                                workload.size();


                        double averageWorkload =
                                workload.stream()
                                        .mapToLong(
                                            AnalystAssignmentResponse
                                                ::getActiveIncidents)
                                        .average()
                                        .orElse(0.0);


                        return new ManagerWorkloadResponse(
                                totalAnalysts,
                                averageWorkload,
                                workload
                        );
                    }
            );
        });
    }
    
    @GetMapping("/api/admin/users")
    public Mono<Object> getAdminUsers(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {

        return webClient.get()
                .uri("http://localhost:8081/api/users")
                .header(HttpHeaders.AUTHORIZATION, token)
                .retrieve()
                .bodyToMono(Object.class);
    }
    
    @GetMapping("/api/admin/users/search")
    public Mono<Object> searchAdminUsers(
            @RequestParam String keyword,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {

        return webClient.get()
                .uri(uriBuilder ->
                        uriBuilder
                                .scheme("http")
                                .host("localhost")
                                .port(8081)
                                .path("/api/users/search")
                                .queryParam("keyword", keyword)
                                .build())
                .header(HttpHeaders.AUTHORIZATION, token)
                .retrieve()
                .bodyToMono(Object.class);
    }
    
    @PostMapping("/api/admin/users")
    public Mono<Object> createAdminUser(
            @RequestBody Object request,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {

        return webClient.post()
                .uri("http://localhost:8081/api/users")
                .header(HttpHeaders.AUTHORIZATION, token)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Object.class);
    }
    
    @PutMapping("/api/admin/users/{id}")
    public Mono<Object> updateAdminUser(
            @PathVariable Long id,
            @RequestBody Object request,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {

        return webClient.put()
                .uri("http://localhost:8081/api/users/{id}", id)
                .header(HttpHeaders.AUTHORIZATION, token)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Object.class);
    }
    
    @GetMapping("/api/dashboard/admin/reports")
    public Mono<Object> getAdminReports(
            @RequestHeader(HttpHeaders.AUTHORIZATION)
            String token) {

        return webClient.get()
                .uri(
                    "http://localhost:8082/api/incidents/reports"
                )
                .header(
                    HttpHeaders.AUTHORIZATION,
                    token
                )
                .retrieve()
                .bodyToMono(Object.class);
    }
    
    @GetMapping("/api/admin/audits")
    public Mono<Object> getAdminAudits(
            @RequestHeader(HttpHeaders.AUTHORIZATION)
            String token) {

        return webClient.get()
                .uri("http://localhost:8087/api/audits")
                .header(
                        HttpHeaders.AUTHORIZATION,
                        token)
                .retrieve()
                .bodyToMono(Object.class);
    }
    
    @GetMapping("/api/admin/audits/search")
    public Mono<Object> searchAdminAudits(
            @RequestParam String keyword,
            @RequestHeader(HttpHeaders.AUTHORIZATION)
            String token) {

        return webClient.get()
                .uri(uriBuilder ->
                        uriBuilder
                                .scheme("http")
                                .host("localhost")
                                .port(8087)
                                .path("/api/audits/search")
                                .queryParam(
                                        "keyword",
                                        keyword)
                                .build())
                .header(
                        HttpHeaders.AUTHORIZATION,
                        token)
                .retrieve()
                .bodyToMono(Object.class);
    }
    
    @GetMapping("/api/admin/audits/action/{action}")
    public Mono<Object> getAuditsByAction(
            @PathVariable String action,
            @RequestHeader(HttpHeaders.AUTHORIZATION)
            String token) {

        return webClient.get()
                .uri(
                    "http://localhost:8087/api/audits/action/{action}",
                    action)
                .header(
                        HttpHeaders.AUTHORIZATION,
                        token)
                .retrieve()
                .bodyToMono(Object.class);
    }
    
    @GetMapping("/api/admin/audits/user/{userId}")
    public Mono<Object> getAuditsByUser(
            @PathVariable Long userId,
            @RequestHeader(HttpHeaders.AUTHORIZATION)
            String token) {

        return webClient.get()
                .uri(
                    "http://localhost:8087/api/audits/user/{userId}",
                    userId)
                .header(
                        HttpHeaders.AUTHORIZATION,
                        token)
                .retrieve()
                .bodyToMono(Object.class);
    }
    
    @GetMapping("/api/admin/settings")
    public Mono<Object> getAdminSettings(
            @RequestHeader(HttpHeaders.AUTHORIZATION)
            String token) {

        return webClient.get()
                .uri("http://localhost:8081/api/settings")
                .header(
                        HttpHeaders.AUTHORIZATION,
                        token)
                .retrieve()
                .bodyToMono(Object.class);
    }
    
    @PutMapping("/api/admin/settings")
    public Mono<Object> updateAdminSettings(
            @RequestBody Object settings,
            @RequestHeader(HttpHeaders.AUTHORIZATION)
            String token) {

        return webClient.put()
                .uri("http://localhost:8081/api/settings")
                .header(
                        HttpHeaders.AUTHORIZATION,
                        token)
                .bodyValue(settings)
                .retrieve()
                .bodyToMono(Object.class);
    }

    @GetMapping("/api/dashboard/profile/stats")
    public Mono<com.secureops.gateway.dto.ProfileStatsResponse> getProfileStats(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {

        return webClient.get()
                .uri("http://localhost:8081/api/users/me")
                .header(HttpHeaders.AUTHORIZATION, token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .flatMap(user -> {
                    String role = String.valueOf(user.getOrDefault("role", "REPORTER")).toUpperCase();
                    Long userId = user.get("userId") != null ? ((Number) user.get("userId")).longValue() : null;

                    if ("REPORTER".equals(role)) {
                        return webClient.get()
                                .uri("http://localhost:8082/api/incidents")
                                .header(HttpHeaders.AUTHORIZATION, token)
                                .retrieve()
                                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                                .map(list -> {
                                    long totalReported = list.stream()
                                            .filter(i -> i.get("reportedBy") != null && String.valueOf(i.get("reportedBy")).equalsIgnoreCase(String.valueOf(userId)))
                                            .count();
                                    long resolvedReported = list.stream()
                                            .filter(i -> i.get("reportedBy") != null && String.valueOf(i.get("reportedBy")).equalsIgnoreCase(String.valueOf(userId)))
                                            .filter(i -> {
                                                String st = String.valueOf(i.getOrDefault("status", "")).toUpperCase();
                                                return "RESOLVED".equals(st) || "CLOSED".equals(st) || "READY_TO_CLOSE".equals(st);
                                            })
                                            .count();
                                    return new com.secureops.gateway.dto.ProfileStatsResponse(
                                            "REPORTER",
                                            totalReported,
                                            "Reported Incidents",
                                            resolvedReported,
                                            "Resolved Reports"
                                    );
                                })
                                .onErrorReturn(new com.secureops.gateway.dto.ProfileStatsResponse("REPORTER", 0, "Reported Incidents", 0, "Resolved Reports"));
                    } else if ("ANALYST".equals(role)) {
                        return webClient.get()
                                .uri("http://localhost:8082/api/incidents")
                                .header(HttpHeaders.AUTHORIZATION, token)
                                .retrieve()
                                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                                .map(list -> {
                                    long totalAssigned = list.stream()
                                            .filter(i -> i.get("assignedTo") != null && String.valueOf(i.get("assignedTo")).equalsIgnoreCase(String.valueOf(userId)))
                                            .count();
                                    long resolvedAssigned = list.stream()
                                            .filter(i -> i.get("assignedTo") != null && String.valueOf(i.get("assignedTo")).equalsIgnoreCase(String.valueOf(userId)))
                                            .filter(i -> {
                                                String st = String.valueOf(i.getOrDefault("status", "")).toUpperCase();
                                                return "RESOLVED".equals(st) || "CLOSED".equals(st) || "READY_TO_CLOSE".equals(st);
                                            })
                                            .count();
                                    return new com.secureops.gateway.dto.ProfileStatsResponse(
                                            "ANALYST",
                                            totalAssigned,
                                            "Assigned Incidents",
                                            resolvedAssigned,
                                            "Resolved Incidents"
                                    );
                                })
                                .onErrorReturn(new com.secureops.gateway.dto.ProfileStatsResponse("ANALYST", 0, "Assigned Incidents", 0, "Resolved Incidents"));
                    } else if ("MANAGER".equals(role)) {
                        return webClient.get()
                                .uri("http://localhost:8082/api/incidents")
                                .header(HttpHeaders.AUTHORIZATION, token)
                                .retrieve()
                                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                                .map(list -> {
                                    long assignedCount = list.stream()
                                            .filter(i -> i.get("assignedTo") != null || i.get("assignedAnalyst") != null)
                                            .count();
                                    long unassignedCount = list.stream()
                                            .filter(i -> i.get("assignedTo") == null && i.get("assignedAnalyst") == null)
                                            .count();
                                    return new com.secureops.gateway.dto.ProfileStatsResponse(
                                            "MANAGER",
                                            assignedCount,
                                            "Assigned",
                                            unassignedCount,
                                            "Unassigned"
                                    );
                                })
                                .onErrorReturn(new com.secureops.gateway.dto.ProfileStatsResponse("MANAGER", 0, "Assigned", 0, "Unassigned"));
                    } else { // ADMIN
                        Mono<List<Map<String, Object>>> playbooksMono = webClient.get()
                                .uri("http://localhost:8085/api/articles/playbooks")
                                .header(HttpHeaders.AUTHORIZATION, token)
                                .retrieve()
                                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                                .onErrorReturn(List.of());

                        Mono<List<Map<String, Object>>> articlesMono = webClient.get()
                                .uri("http://localhost:8085/api/articles")
                                .header(HttpHeaders.AUTHORIZATION, token)
                                .retrieve()
                                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                                .onErrorReturn(List.of());

                        return Mono.zip(playbooksMono, articlesMono)
                                .map(tuple -> new com.secureops.gateway.dto.ProfileStatsResponse(
                                        "ADMIN",
                                        tuple.getT1().size(),
                                        "Playbooks Added",
                                        tuple.getT2().size(),
                                        "Knowledge Articles Added"
                                ));
                    }
                })
                .onErrorReturn(new com.secureops.gateway.dto.ProfileStatsResponse("USER", 0, "Primary", 0, "Secondary"));
    }
}