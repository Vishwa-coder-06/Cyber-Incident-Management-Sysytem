package com.secureops.incidentservice.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResolveIncidentRequest {

    private String resolutionSummary;

    private List<String> resolutionSteps;

    private String rootCause;

    private String finalAttackType;

    private String finalSeverity;

    private String lessonsLearned;
}
