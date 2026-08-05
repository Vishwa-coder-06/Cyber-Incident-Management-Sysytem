package com.secureops.incidentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class IncidentResponse {

    private Long incidentId;

    private String title;

    private String status;

    private String message;

}