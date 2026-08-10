package com.secureops.incidentservice.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReporterDashboardResponse {

    private long totalSubmitted;

    private long underReview;

    private long resolved;

    private long criticalOpen;

    private List<ReporterIncidentResponse> recentIncidents;
}