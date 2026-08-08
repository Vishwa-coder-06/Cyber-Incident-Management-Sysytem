package com.secureops.assignmentservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import com.secureops.assignmentservice.config.FeignConfig;
import com.secureops.common.dto.UserResponse;

@FeignClient(name = "user-service", configuration = FeignConfig.class)
public interface UserClient {

	@GetMapping("/api/users/{id}")
	UserResponse getUserById(@PathVariable Long id);

}