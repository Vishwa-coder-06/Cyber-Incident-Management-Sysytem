package com.secureops.assignmentservice.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.secureops.assignmentservice.config.FeignConfig;
import com.secureops.common.dto.UserResponse;

@FeignClient(name = "user-service", configuration = FeignConfig.class)
public interface UserClient {

	@GetMapping("/api/users/{id}")
	UserResponse getUserById(@PathVariable Long id);
	
	@GetMapping("/api/users/role/{role}")
	List<UserResponse> getUsersByRole(
	        @PathVariable String role);

}