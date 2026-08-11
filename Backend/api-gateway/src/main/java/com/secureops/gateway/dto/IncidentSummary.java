package com.secureops.gateway.dto;

public class IncidentSummary {

    private Long incidentId;
    private String title;
    private String severity;
    private String system;
    private String status;

    public IncidentSummary() {
    }

    public IncidentSummary(
            Long incidentId,
            String title,
            String severity,
            String system,
            String status) {

        this.incidentId = incidentId;
        this.title = title;
        this.severity = severity;
        this.system = system;
        this.status = status;
    }

    public Long getIncidentId() {
        return incidentId;
    }

    public void setIncidentId(Long incidentId) {
        this.incidentId = incidentId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getSystem() {
        return system;
    }

    public void setSystem(String system) {
        this.system = system;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}