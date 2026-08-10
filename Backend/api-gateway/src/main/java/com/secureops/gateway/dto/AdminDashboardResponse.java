package com.secureops.gateway.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminDashboardResponse {

    private Object users;

    private Object incidents;

    private Object assignments;
}