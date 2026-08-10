package com.secureops.assignmentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AssignmentDashboardResponse {

    private long total;

    private long assigned;

    private long inProgress;

    private long resolved;
}