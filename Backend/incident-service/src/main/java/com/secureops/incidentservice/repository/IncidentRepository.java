package com.secureops.incidentservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.secureops.incidentservice.entity.Incident;

public interface IncidentRepository extends JpaRepository<Incident, Long>{

}