package com.secureops.incidentservice.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
    
    @Query("""
    	    SELECT i
    	    FROM Incident i
    	    WHERE i.createdAt >= :startDate
    	    ORDER BY i.createdAt ASC
    	""")
    	List<Incident> findIncidentsFromDate(
    	        @Param("startDate") LocalDateTime startDate);
    
    
    @Query("""
    		SELECT i FROM Incident i
    		WHERE i.reportedBy = :reportedBy
    		AND (:search IS NULL OR
    		     LOWER(i.title) LIKE LOWER(CONCAT('%', :search, '%')))
    		AND (:status IS NULL OR i.status = :status)
    		AND (:severity IS NULL OR i.severity = :severity)
    		ORDER BY i.createdAt DESC
    		""")
    		List<Incident> findReporterIncidents(
    		        @Param("reportedBy") Long reportedBy,
    		        @Param("search") String search,
    		        @Param("status") String status,
    		        @Param("severity") String severity);
}