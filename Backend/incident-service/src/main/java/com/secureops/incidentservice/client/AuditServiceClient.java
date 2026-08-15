package com.secureops.incidentservice.client;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.secureops.incidentservice.security.JwtUtil;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class AuditServiceClient {

    private final RestClient restClient;
    private final JwtUtil jwtUtil;

    public AuditServiceClient(
            @Value("${audit.service.url:http://localhost:8087}") String auditServiceUrl,
            JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
        log.info("[AUDIT-CLIENT] Initialized with audit service URL: {}", auditServiceUrl);
        this.restClient = RestClient.builder()
                .baseUrl(auditServiceUrl)
                .build();
    }

    public void logEvent(Long userId, String action, String description, String type) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("userId", userId != null ? userId : 0L);
            payload.put("action", action);
            payload.put("description", description);
            payload.put("type", type);
            payload.put("createdAt", LocalDateTime.now().toString());

            String systemToken = jwtUtil.generateToken("system@secureops.com", "ADMIN");

            restClient.post()
                    .uri("/api/audits")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + systemToken)
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();

            log.debug("[AUDIT-CLIENT] Emitted audit event: action={}, type={}, user={}", action, type, userId);
        } catch (Exception e) {
            log.warn("[AUDIT-CLIENT] Non-blocking audit event emission failed: {}", e.getMessage());
        }
    }
}
