package com.secureops.auditservice.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.secureops.auditservice.entity.AuditEvent;

public interface AuditRepository
        extends MongoRepository<AuditEvent, String> {

    long countByCreatedAtAfter(LocalDateTime date);

    List<AuditEvent> findTop5ByOrderByCreatedAtDesc();
}