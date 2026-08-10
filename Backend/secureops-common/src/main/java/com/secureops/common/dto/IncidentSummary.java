package com.secureops.common.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncidentSummary {

    private Long incidentId;

    private String title;

    private String severity;

    private String status;

    private String category;
}