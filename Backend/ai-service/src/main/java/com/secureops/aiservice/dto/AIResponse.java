package com.secureops.aiservice.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AIResponse {

    private String attackType;

    private Double confidence;

    private String severity;

    private String recommendation;

    private String rootCause;

    private String immediateAdvice;

    private String recommendedPlaybookTitle;

    private List<SimilarIncidentDTO> similarIncidents;
}