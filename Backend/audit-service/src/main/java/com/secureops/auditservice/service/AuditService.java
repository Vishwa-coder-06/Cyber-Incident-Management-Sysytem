package com.secureops.auditservice.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.secureops.auditservice.dto.AuditResponse;
import com.secureops.auditservice.entity.AuditEvent;
import com.secureops.auditservice.repository.AuditRepository;

@Service
public class AuditService {

    private final AuditRepository auditRepository;

    public AuditService(AuditRepository auditRepository) {
        this.auditRepository = auditRepository;
    }

    public AuditResponse createAudit(AuditEvent event) {

        if (event.getCreatedAt() == null) {
            event.setCreatedAt(LocalDateTime.now());
        }

        AuditEvent saved =
                auditRepository.save(event);

        return new AuditResponse(
                saved.getId(),
                saved.getUserId(),
                saved.getAction(),
                saved.getDescription(),
                saved.getType(),
                saved.getCreatedAt()
        );
    }

    public long getTodayCount() {

        LocalDateTime startOfDay =
                LocalDate.now().atStartOfDay();

        return auditRepository
                .countByCreatedAtAfter(startOfDay);
    }

    public List<AuditResponse> getRecentAudits() {

        return auditRepository
                .findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(a ->
                        new AuditResponse(
                                a.getId(),
                                a.getUserId(),
                                a.getAction(),
                                a.getDescription(),
                                a.getType(),
                                a.getCreatedAt()
                        )
                )
                .toList();
    }
    
 // =====================================================
 // ADMIN AUDIT LOGS
 // =====================================================

 public List<AuditEvent> searchAudits(
         String keyword) {

     return auditRepository
             .findByActionContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                     keyword,
                     keyword);
 }


 public List<AuditEvent> getAuditsByAction(
         String action) {

     return auditRepository
             .findByActionContainingIgnoreCase(
                     action);
 }


 public List<AuditEvent> getAuditsByUser(
         Long userId) {

     return auditRepository
             .findByUserId(userId);
 }
}