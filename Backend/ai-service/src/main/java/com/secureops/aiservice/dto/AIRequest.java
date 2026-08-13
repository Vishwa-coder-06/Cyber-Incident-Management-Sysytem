package com.secureops.aiservice.dto;

import lombok.Data;

@Data
public class AIRequest {

    private String incidentDescription;

    // Optional additional context fields
    private String title;
    private String category;
    private String severity;

}