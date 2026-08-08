package com.secureops.assignmentservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.secureops.assignmentservice.config.FeignConfig;
import com.secureops.common.dto.NotificationRequest;

@FeignClient(name = "notification-service",url = "http://localhost:8084")
public interface NotificationClient {

    @PostMapping("/api/notifications")
    void createNotification(
            @RequestBody NotificationRequest request);
}