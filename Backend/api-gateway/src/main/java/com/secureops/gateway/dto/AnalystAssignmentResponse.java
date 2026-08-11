package com.secureops.gateway.dto;

public class AnalystAssignmentResponse {

    private Long analystId;
    private String name;
    private String email;
    private long activeIncidents;
    private String availability;

    public AnalystAssignmentResponse() {
    }

    public AnalystAssignmentResponse(
            Long analystId,
            String name,
            String email,
            long activeIncidents,
            String availability) {

        this.analystId = analystId;
        this.name = name;
        this.email = email;
        this.activeIncidents = activeIncidents;
        this.availability = availability;
    }

    public Long getAnalystId() {
        return analystId;
    }

    public void setAnalystId(Long analystId) {
        this.analystId = analystId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public long getActiveIncidents() {
        return activeIncidents;
    }

    public void setActiveIncidents(
            long activeIncidents) {

        this.activeIncidents = activeIncidents;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(
            String availability) {

        this.availability = availability;
    }
}