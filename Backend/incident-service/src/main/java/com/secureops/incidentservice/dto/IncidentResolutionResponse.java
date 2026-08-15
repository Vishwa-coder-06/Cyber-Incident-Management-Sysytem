package com.secureops.incidentservice.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncidentResolutionResponse {

    private Long resolutionId;

    private Long incidentId;

    private String resolutionSummary;

    private List<String> resolutionSteps;

    private String rootCause;

    private String finalAttackType;

    private String finalSeverity;

    private String lessonsLearned;

    private Long resolvedBy;

    private String resolvedByName;

    private LocalDateTime resolvedAt;

    private String kbArticleId;
}

