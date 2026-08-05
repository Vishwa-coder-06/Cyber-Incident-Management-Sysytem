package com.secureops.userservice.dto;

import lombok.Data;

@Data
public class RegisterRequest {

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String role;
    private String department;
    private String phone;

}