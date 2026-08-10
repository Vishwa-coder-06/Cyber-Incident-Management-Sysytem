package com.secureops.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDashboardResponse {

    private long total;

    private long active;

    private long analysts;

    private long managers;

    private long admins;
}