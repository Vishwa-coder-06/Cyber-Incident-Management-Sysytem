package com.secureops.incidentservice.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class IncidentTimelineResponse {

    private String event;

    private String description;

    private LocalDateTime createdAt;
}