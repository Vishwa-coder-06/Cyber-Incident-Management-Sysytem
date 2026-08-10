package com.secureops.assignmentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AnalystWorkloadResponse {

    private Long analystId;

    private String analystName;

    private long assignmentCount;
}