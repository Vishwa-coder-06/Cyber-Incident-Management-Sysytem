package com.secureops.gateway.dto;

import java.util.List;

public class ManagerAssignmentResponse {

    private IncidentSummary incident;

    private List<AnalystAssignmentResponse> analysts;

    private AnalystAssignmentResponse recommendedAnalyst;

    public ManagerAssignmentResponse() {
    }

    public ManagerAssignmentResponse(
            IncidentSummary incident,
            List<AnalystAssignmentResponse> analysts,
            AnalystAssignmentResponse recommendedAnalyst) {

        this.incident = incident;
        this.analysts = analysts;
        this.recommendedAnalyst =
                recommendedAnalyst;
    }

    public IncidentSummary getIncident() {
        return incident;
    }

    public void setIncident(
            IncidentSummary incident) {

        this.incident = incident;
    }

    public List<AnalystAssignmentResponse>
    getAnalysts() {

        return analysts;
    }

    public void setAnalysts(
            List<AnalystAssignmentResponse> analysts) {

        this.analysts = analysts;
    }

    public AnalystAssignmentResponse
    getRecommendedAnalyst() {

        return recommendedAnalyst;
    }

    public void setRecommendedAnalyst(
            AnalystAssignmentResponse recommendedAnalyst) {

        this.recommendedAnalyst =
                recommendedAnalyst;
    }
}