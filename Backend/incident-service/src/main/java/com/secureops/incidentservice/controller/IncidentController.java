package com.secureops.incidentservice.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.secureops.common.dto.IncidentSummary;
import com.secureops.incidentservice.dto.IncidentDashboardResponse;
import com.secureops.incidentservice.dto.IncidentRequest;
import com.secureops.incidentservice.dto.IncidentResponse;
import com.secureops.incidentservice.dto.IncidentTrendResponse;
import com.secureops.incidentservice.dto.ReporterDashboardResponse;
import com.secureops.incidentservice.entity.Incident;
import com.secureops.incidentservice.service.IncidentService;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin("*")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    // Create

    @PostMapping
    public IncidentResponse createIncident(@RequestBody IncidentRequest request) {

        return incidentService.createIncident(request);

    }

    // Get All

    @GetMapping
    public List<Incident> getAllIncidents() {

        return incidentService.getAllIncidents();

    }

    // Get By ID

    @GetMapping("/{id}")
    public Incident getIncidentById(@PathVariable Long id) {

        return incidentService.getIncidentById(id);

    }

    // Update

    @PutMapping("/{id}")
    public Incident updateIncident(@PathVariable Long id,
                                   @RequestBody Incident incident) {

        return incidentService.updateIncident(id, incident);

    }

    // Delete

    @DeleteMapping("/{id}")
    public void deleteIncident(@PathVariable Long id) {

        incidentService.deleteIncident(id);

    }
    
    @PutMapping("/{incidentId}/assign/{analystId}")
    public Incident assignIncident(
            @PathVariable Long incidentId,
            @PathVariable Long analystId){

        return incidentService.assignIncident(
                incidentId,
                analystId);

    }
    
    @PutMapping("/{id}/status")
    public Incident updateIncidentStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return incidentService.updateIncidentStatus(id, status);
    }
    
    @GetMapping("/dashboard")
    public IncidentDashboardResponse getDashboardData() {
    	return incidentService.getDashboardData();
    }
    
    @GetMapping("/reporter/dashboard/{userId}")
    public ReporterDashboardResponse getReporterDashboard(
            @PathVariable Long userId) {

        return incidentService.getReporterDashboard(userId);
    }
    
    @GetMapping("/{id}/summary")
    public IncidentSummary getIncidentSummary(
            @PathVariable Long id) {

        Incident incident =
                incidentService.getIncidentById(id);

        if (incident == null) {
            return null;
        }

        return new IncidentSummary(
                incident.getIncidentId(),
                incident.getTitle(),
                incident.getSeverity(),
                incident.getStatus(),
                incident.getCategory()
        );
    }
    
    @GetMapping("/manager/open-count")
    public long getOpenIncidentCount() {

        return incidentService.getOpenIncidentCount();
    }
    
    @GetMapping("/manager/resolved-today")
    public long getResolvedToday() {

        return incidentService.getResolvedToday();
    }
    
    @GetMapping("/manager/unassigned")
    public List<Incident> getUnassignedIncidents() {

        return incidentService.getUnassignedIncidents();
    }
    
    @GetMapping("/dashboard/trend")
    public List<IncidentTrendResponse> getIncidentTrend() {

        return incidentService.getIncidentTrend();
    }

}