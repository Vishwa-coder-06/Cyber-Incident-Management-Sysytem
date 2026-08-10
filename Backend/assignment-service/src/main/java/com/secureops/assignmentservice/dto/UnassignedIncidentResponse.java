package com.secureops.assignmentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UnassignedIncidentResponse {

    private Long incidentId;

    private String title;

    private String severity;
}