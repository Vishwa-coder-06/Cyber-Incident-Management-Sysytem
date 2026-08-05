package com.secureops.assignmentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AssignmentResponse {

    private Long assignmentId;

    private Long incidentId;

    private Long analystId;

    private String message;

}