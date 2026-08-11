package com.secureops.incidentservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.secureops.incidentservice.entity.IncidentTimelineEvent;

public interface IncidentTimelineRepository
        extends JpaRepository<IncidentTimelineEvent, Long> {

    List<IncidentTimelineEvent>
    findByIncidentIdOrderByCreatedAtAsc(
            Long incidentId);
}