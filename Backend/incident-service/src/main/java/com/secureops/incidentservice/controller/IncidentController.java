package com.secureops.incidentservice.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.secureops.incidentservice.dto.IncidentRequest;
import com.secureops.incidentservice.dto.IncidentResponse;
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

}