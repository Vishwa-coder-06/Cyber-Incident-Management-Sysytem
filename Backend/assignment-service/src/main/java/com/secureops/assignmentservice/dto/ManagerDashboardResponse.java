package com.secureops.assignmentservice.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ManagerDashboardResponse {

    private long openIncidents;

    private String mttr;

    private long resolvedToday;

    private List<AnalystWorkloadResponse> analystWorkload;

    private List<UnassignedIncidentResponse> unassignedIncidents;
}