package com.secureops.userservice.controller;

import org.springframework.web.bind.annotation.*;

import com.secureops.userservice.dto.LoginRequest;
import com.secureops.userservice.dto.LoginResponse;
import com.secureops.userservice.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        return authService.login(request);

    }
}