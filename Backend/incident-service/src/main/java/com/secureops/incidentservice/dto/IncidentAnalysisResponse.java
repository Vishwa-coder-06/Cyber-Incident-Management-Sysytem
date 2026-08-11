package com.secureops.incidentservice.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class IncidentAnalysisResponse {

    private Long incidentId;

    private String title;

    private String category;

    private String severity;

    private String rootCause;

    private String immediateAdvice;

    private String recommendedPlaybookId;

    private String recommendedPlaybookTitle;

    private LocalDateTime analyzedAt;
}