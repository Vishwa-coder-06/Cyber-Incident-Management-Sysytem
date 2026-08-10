package com.secureops.incidentservice.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.secureops.incidentservice.entity.Incident;

public interface IncidentRepository
        extends JpaRepository<Incident, Long> {

    long countByStatusIgnoreCase(String status);

    long countBySeverity(String severity);

    long countByReportedBy(Long reportedBy);

    long countByReportedByAndStatusIgnoreCase(
            Long reportedBy,
            String status);

    long countByReportedByAndSeverityIgnoreCaseAndStatusIgnoreCase(
            Long reportedBy,
            String severity,
            String status);

    List<Incident> findTop5ByReportedByOrderByCreatedAtDesc(
            Long reportedBy);

    long countByStatusIgnoreCaseAndUpdatedAtAfter(
            String status,
            LocalDateTime date);

    List<Incident> findByAssignedToIsNull();
}