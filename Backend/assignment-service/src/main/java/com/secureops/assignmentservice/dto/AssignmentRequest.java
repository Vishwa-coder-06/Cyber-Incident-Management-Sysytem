package com.secureops.assignmentservice.dto;

import lombok.Data;

@Data
public class AssignmentRequest {

    private Long incidentId;

    private Long analystId;

    private Long managerId;

    private String status;

}