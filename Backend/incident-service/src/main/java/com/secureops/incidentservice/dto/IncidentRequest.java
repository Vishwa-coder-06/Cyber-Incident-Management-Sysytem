package com.secureops.incidentservice.dto;

import lombok.Data;

@Data
public class IncidentRequest {

    private String title;

    private String description;

    private String severity;

    private String status;

    private String category;

    private Long reportedBy;

    private Long assignedTo;

}