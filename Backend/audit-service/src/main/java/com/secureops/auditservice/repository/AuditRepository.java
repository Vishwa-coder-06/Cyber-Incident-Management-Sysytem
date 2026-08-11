package com.secureops.auditservice.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.secureops.auditservice.entity.AuditEvent;

public interface AuditRepository
        extends MongoRepository<AuditEvent, String> {

    long countByCreatedAtAfter(LocalDateTime date);

    List<AuditEvent> findTop5ByOrderByCreatedAtDesc();
    
    List<AuditEvent> findByActionContainingIgnoreCase(
            String action);

    List<AuditEvent> findByUserId(
            Long userId);

    List<AuditEvent> findByActionContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String action,
            String description);
}