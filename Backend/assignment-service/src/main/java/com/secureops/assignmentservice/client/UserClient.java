package com.secureops.assignmentservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.secureops.common.dto.UserResponse;

@FeignClient(name = "user-service")
public interface UserClient {

	@GetMapping("/api/users/{id}")
	UserResponse getUserById(@PathVariable Long id);

}