package com.secureops.incidentservice.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import lombok.Data;

@Entity
@Data
public class IncidentAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long analysisId;

    private Long incidentId;

    private String category;

    private String severity;

    @Column(length = 2000)
    private String rootCause;

    @Column(length = 2000)
    private String immediateAdvice;

    private String recommendedPlaybookId;

    private String recommendedPlaybookTitle;

    private LocalDateTime analyzedAt;
}