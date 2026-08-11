package com.secureops.incidentservice.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import lombok.Data;

@Entity
@Data
public class IncidentTimelineEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventId;

    private Long incidentId;

    private String event;

    @Column(length = 1000)
    private String description;

    private LocalDateTime createdAt;
}