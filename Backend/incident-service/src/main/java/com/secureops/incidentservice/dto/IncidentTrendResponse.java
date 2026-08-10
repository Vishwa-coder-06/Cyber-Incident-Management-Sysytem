package com.secureops.incidentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class IncidentTrendResponse {

    private String day;

    private long count;
}