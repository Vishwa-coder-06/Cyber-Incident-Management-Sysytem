package com.secureops.incidentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReporterIncidentResponse {

    private Long incidentId;

    private String title;

    private String category;

    private String severity;

    private String status;
}