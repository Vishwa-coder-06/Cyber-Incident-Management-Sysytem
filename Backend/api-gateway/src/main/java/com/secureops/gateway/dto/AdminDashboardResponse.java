package com.secureops.gateway.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {

    private long totalUsers;

    private long activePlaybooks;

    private long kbArticles;

    private long auditEventsToday;

    private Object incidentTrend;

    private Object recentAuditEvents;
}