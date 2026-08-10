package com.secureops.assignmentservice.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.secureops.assignmentservice.config.FeignConfig;
import com.secureops.common.dto.IncidentSummary;

@FeignClient(name="incident-service",  configuration = FeignConfig.class)
public interface IncidentClient {

    @PutMapping("/api/incidents/{incidentId}/assign/{analystId}")
    void assignIncident(
            @PathVariable Long incidentId,
            @PathVariable Long analystId);
    
    @PutMapping("/api/incidents/{id}/status")
    void updateIncidentStatus(
            @PathVariable Long id,
            @RequestParam String status);
    
    @GetMapping("/api/incidents/{id}/summary")
    IncidentSummary getIncidentSummary(
            @PathVariable Long id);
    
    @GetMapping("/api/incidents/manager/open-count")
    long getOpenIncidentCount();
    
    @GetMapping("/api/incidents/manager/resolved-today")
    long getResolvedToday();
    
    @GetMapping("/api/incidents/manager/unassigned")
    List<IncidentSummary> getUnassignedIncidents();

}