package com.secureops.incidentservice.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReporterIncidentDetailResponse {

    private Long incidentId;

    private String title;

    private String affectedSystem;

    private String description;

    private String severity;

    private String status;

    private String reportedByName;

    private String assignedToName;

    private LocalDateTime incidentDateTime;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private IncidentAnalysisResponse analysis;

    private List<IncidentTimelineResponse> timeline;
}