package com.secureops.incidentservice.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.secureops.incidentservice.dto.IncidentRequest;
import com.secureops.incidentservice.dto.IncidentResponse;
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

}