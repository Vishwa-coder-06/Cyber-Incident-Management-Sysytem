package com.secureops.auditservice.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.secureops.auditservice.dto.AuditResponse;
import com.secureops.auditservice.entity.AuditEvent;
import com.secureops.auditservice.service.AuditService;

@RestController
@RequestMapping("/api/audits")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @PostMapping
    public AuditResponse createAudit(
            @RequestBody AuditEvent event) {

        return auditService.createAudit(event);
    }

    @GetMapping("/today/count")
    public long getTodayCount() {

        return auditService.getTodayCount();
    }

    @GetMapping("/recent")
    public List<AuditResponse> getRecentAudits() {

        return auditService.getRecentAudits();
    }
    
    @GetMapping("/search")
    public List<AuditEvent> searchAudits(
            @RequestParam String keyword) {

        return auditService
                .searchAudits(keyword);
    }


    @GetMapping("/action/{action}")
    public List<AuditEvent> getAuditsByAction(
            @PathVariable String action) {

        return auditService
                .getAuditsByAction(action);
    }


    @GetMapping("/user/{userId}")
    public List<AuditEvent> getAuditsByUser(
            @PathVariable Long userId) {

        return auditService
                .getAuditsByUser(userId);
    }
    @GetMapping
    public List<AuditEvent> getAllAudits() {

        return auditService.getAllAudits();
    }
}