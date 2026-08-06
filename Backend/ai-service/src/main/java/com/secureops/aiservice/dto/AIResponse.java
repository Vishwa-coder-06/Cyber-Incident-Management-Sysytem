package com.secureops.aiservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AIResponse {

    private String attackType;

    private String severity;

    private String recommendation;

}