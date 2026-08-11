package com.secureops.gateway.dto;

import java.util.List;

public class ManagerWorkloadResponse {

    private long totalAnalysts;

    private double averageActiveIncidents;

    private List<AnalystAssignmentResponse>
            workload;

    public ManagerWorkloadResponse() {
    }

    public ManagerWorkloadResponse(
            long totalAnalysts,
            double averageActiveIncidents,
            List<AnalystAssignmentResponse>
                    workload) {

        this.totalAnalysts = totalAnalysts;
        this.averageActiveIncidents =
                averageActiveIncidents;
        this.workload = workload;
    }

    public long getTotalAnalysts() {
        return totalAnalysts;
    }

    public void setTotalAnalysts(
            long totalAnalysts) {

        this.totalAnalysts = totalAnalysts;
    }

    public double getAverageActiveIncidents() {
        return averageActiveIncidents;
    }

    public void setAverageActiveIncidents(
            double averageActiveIncidents) {

        this.averageActiveIncidents =
                averageActiveIncidents;
    }

    public List<AnalystAssignmentResponse>
    getWorkload() {

        return workload;
    }

    public void setWorkload(
            List<AnalystAssignmentResponse>
                    workload) {

        this.workload = workload;
    }
}