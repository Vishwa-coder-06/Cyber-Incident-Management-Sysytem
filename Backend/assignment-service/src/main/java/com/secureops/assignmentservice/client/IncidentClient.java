package com.secureops.assignmentservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.secureops.assignmentservice.config.FeignConfig;

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

}