package com.secureops.assignmentservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@FeignClient(name="incident-service")
public interface IncidentClient {

    @PutMapping("/api/incidents/{incidentId}/assign/{analystId}")
    void assignIncident(
            @PathVariable Long incidentId,
            @PathVariable Long analystId);

}