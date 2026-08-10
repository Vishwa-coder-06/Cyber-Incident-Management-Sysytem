package com.secureops.assignmentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AnalystIncidentResponse {

    private Long incidentId;

    private String title;

    private String severity;
}