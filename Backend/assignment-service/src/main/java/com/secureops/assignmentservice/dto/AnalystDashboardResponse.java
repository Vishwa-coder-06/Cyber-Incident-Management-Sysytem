package com.secureops.assignmentservice.dto;

import java.util.List;

import com.secureops.common.dto.KnowledgeSummary;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AnalystDashboardResponse {

    private long assignedToYou;

    private long resolvedThisWeek;

    private String averageResolutionTime;

    private List<AnalystIncidentResponse> activeIncidents;
    
    private List<KnowledgeSummary> recentKbArticles;

}