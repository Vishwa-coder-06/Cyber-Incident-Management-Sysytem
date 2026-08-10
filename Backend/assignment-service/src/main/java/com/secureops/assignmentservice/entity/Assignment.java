package com.secureops.assignmentservice.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ASSIGNMENTS")

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ASSIGNMENT_ID")
    private Long assignmentId;

    @Column(name = "INCIDENT_ID")
    private Long incidentId;

    @Column(name = "ANALYST_ID")
    private Long analystId;

    @Column(name = "MANAGER_ID")
    private Long managerId;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "ASSIGNED_AT")
    private LocalDateTime assignedAt;
    
    @Column(name = "RESOLVED_AT")
    private LocalDateTime resolvedAt;

}