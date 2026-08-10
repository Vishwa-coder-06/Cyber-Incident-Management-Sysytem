package com.secureops.auditservice.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "audit_events")
public class AuditEvent {

    @Id
    private String id;

    private Long userId;

    private String action;

    private String description;

    private String type;

    private LocalDateTime createdAt;
}