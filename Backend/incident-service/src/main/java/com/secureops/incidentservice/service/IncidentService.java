package com.secureops.incidentservice.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.secureops.incidentservice.dto.IncidentDashboardResponse;
import com.secureops.incidentservice.dto.IncidentRequest;
import com.secureops.incidentservice.dto.IncidentResponse;
import com.secureops.incidentservice.dto.IncidentTrendResponse;
import com.secureops.incidentservice.dto.ReporterDashboardResponse;
import com.secureops.incidentservice.dto.ReporterIncidentResponse;
import com.secureops.incidentservice.entity.Incident;
import com.secureops.incidentservice.repository.IncidentRepository;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;

    public IncidentService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    // Create Incident

    public IncidentResponse createIncident(IncidentRequest request) {

        Incident incident = new Incident();

        incident.setTitle(request.getTitle());
        incident.setDescription(request.getDescription());
        incident.setSeverity(request.getSeverity());
        incident.setStatus(request.getStatus());
        incident.setCategory(request.getCategory());
        incident.setReportedBy(request.getReportedBy());
        incident.setAssignedTo(request.getAssignedTo());

        incident.setCreatedAt(LocalDateTime.now());
        incident.setUpdatedAt(LocalDateTime.now());

        Incident savedIncident = incidentRepository.save(incident);

        return new IncidentResponse(
                savedIncident.getIncidentId(),
                savedIncident.getTitle(),
                savedIncident.getStatus(),
                "Incident Created Successfully"
        );
    }

    // Get All Incidents

    public List<Incident> getAllIncidents() {

        return incidentRepository.findAll();

    }

    // Get Incident By ID

    public Incident getIncidentById(Long id) {

        return incidentRepository.findById(id).orElse(null);

    }

    // Update Incident

    public Incident updateIncident(Long id, Incident updatedIncident) {

        Incident incident = incidentRepository.findById(id).orElse(null);

        if (incident == null) {
            return null;
        }

        incident.setTitle(updatedIncident.getTitle());
        incident.setDescription(updatedIncident.getDescription());
        incident.setSeverity(updatedIncident.getSeverity());
        incident.setStatus(updatedIncident.getStatus());
        incident.setCategory(updatedIncident.getCategory());
        incident.setReportedBy(updatedIncident.getReportedBy());
        incident.setAssignedTo(updatedIncident.getAssignedTo());
        incident.setUpdatedAt(LocalDateTime.now());

        return incidentRepository.save(incident);

    }

    // Delete Incident

    public void deleteIncident(Long id) {

        incidentRepository.deleteById(id);

    }
    
    public Incident assignIncident(Long incidentId,
            Long analystId){

    		Incident incident =
    				incidentRepository.findById(incidentId)
    				.orElseThrow(() ->
    				new RuntimeException("Incident Not Found"));
    		
    		incident.setAssignedTo(analystId);

    		incident.setStatus("ASSIGNED");

    		incident.setUpdatedAt(LocalDateTime.now());

    		return incidentRepository.save(incident);

     }
    
    public Incident updateIncidentStatus(Long id, String status) {

        Incident incident =
                incidentRepository.findById(id).orElse(null);

        if (incident == null) {
            return null;
        }

        incident.setStatus(status);
        incident.setUpdatedAt(LocalDateTime.now());

        return incidentRepository.save(incident);
    }
    
    public IncidentDashboardResponse getDashboardData() {

        long total = incidentRepository.count();

        long open =
                incidentRepository.countByStatusIgnoreCase("OPEN");

        long inProgress =
                incidentRepository.countByStatusIgnoreCase("IN_PROGRESS");

        long resolved =
                incidentRepository.countByStatusIgnoreCase("RESOLVED");

        long critical =
                incidentRepository.countBySeverity("CRITICAL");

        return new IncidentDashboardResponse(
                total,
                open,
                inProgress,
                resolved,
                critical
        );
    }
    
    public ReporterDashboardResponse getReporterDashboard(
            Long reportedBy) {

        long totalSubmitted =
                incidentRepository.countByReportedBy(reportedBy);

        long underReview =
                incidentRepository.countByReportedByAndStatusIgnoreCase(
                        reportedBy,
                        "IN_PROGRESS");

        long resolved =
                incidentRepository.countByReportedByAndStatusIgnoreCase(
                        reportedBy,
                        "RESOLVED");

        long criticalOpen =
                incidentRepository
                        .countByReportedByAndSeverityIgnoreCaseAndStatusIgnoreCase(
                                reportedBy,
                                "CRITICAL",
                                "OPEN");

        List<ReporterIncidentResponse> recentIncidents =
                incidentRepository
                        .findTop5ByReportedByOrderByCreatedAtDesc(
                                reportedBy)
                        .stream()
                        .map(incident ->
                                new ReporterIncidentResponse(
                                        incident.getIncidentId(),
                                        incident.getTitle(),
                                        incident.getCategory(),
                                        incident.getSeverity(),
                                        incident.getStatus()
                                ))
                        .toList();

        return new ReporterDashboardResponse(
                totalSubmitted,
                underReview,
                resolved,
                criticalOpen,
                recentIncidents
        );
    }
    public long getOpenIncidentCount() {

        return incidentRepository
                .countByStatusIgnoreCase("OPEN");
    }
    public long getResolvedToday() {

        LocalDateTime startOfDay =
                LocalDateTime.now()
                        .toLocalDate()
                        .atStartOfDay();

        return incidentRepository
                .countByStatusIgnoreCaseAndUpdatedAtAfter(
                        "RESOLVED",
                        startOfDay);
    }
    public List<Incident> getUnassignedIncidents() {

        return incidentRepository.findByAssignedToIsNull();
    }
    
    public List<IncidentTrendResponse> getIncidentTrend() {

        LocalDate today = LocalDate.now();

        LocalDateTime start =
                today.minusDays(6).atStartOfDay();

        List<Incident> incidents =
                incidentRepository.findIncidentsFromDate(start);

        Map<String, Long> counts =
                incidents.stream()
                        .collect(Collectors.groupingBy(
                                incident ->
                                        incident.getCreatedAt()
                                                .getDayOfWeek()
                                                .toString(),
                                Collectors.counting()
                        ));

        List<IncidentTrendResponse> result =
                new ArrayList<>();

        for (int i = 6; i >= 0; i--) {

            LocalDate date =
                    today.minusDays(i);

            String day =
                    date.getDayOfWeek()
                            .toString()
                            .substring(0, 3);

            long count =
                    incidents.stream()
                            .filter(incident ->
                                    incident.getCreatedAt()
                                            .toLocalDate()
                                            .equals(date))
                            .count();

            result.add(
                    new IncidentTrendResponse(
                            day,
                            count
                    )
            );
        }

        return result;
    }

}