package com.secureops.incidentservice.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ReporterIncidentRequest {

    private String title;

    private String affectedSystem;

    private LocalDateTime incidentDateTime;

    private String description;
}