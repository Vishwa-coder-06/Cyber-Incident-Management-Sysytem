package com.secureops.auditservice.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuditResponse {

    private String id;

    private Long userId;

    private String action;

    private String description;

    private String type;

    private LocalDateTime createdAt;
}