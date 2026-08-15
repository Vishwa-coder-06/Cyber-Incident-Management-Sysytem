package com.secureops.incidentservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.secureops.common.dto.UserResponse;
import com.secureops.incidentservice.config.FeignConfig;

@FeignClient(
        name = "user-service",
        url = "http://localhost:8081",
        configuration = FeignConfig.class
)
public interface UserClient {

    @GetMapping("/api/users/email/{email}")
    UserResponse getUserByEmail(
            @PathVariable String email);

    @GetMapping("/api/users/{id}")
    UserResponse getUserById(
            @PathVariable Long id);

    @GetMapping("/api/users/role/{role}")
    java.util.List<UserResponse> getUsersByRole(
            @PathVariable String role);
}