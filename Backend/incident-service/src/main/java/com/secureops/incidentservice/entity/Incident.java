package com.secureops.incidentservice.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "INCIDENTS")

@Data
@NoArgsConstructor
@AllArgsConstructor

public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "INCIDENT_ID")
    private Long incidentId;

    @Column(name = "TITLE", nullable = false)
    private String title;

    @Column(name = "DESCRIPTION")
    @Lob
    private String description;

    @Column(name = "SEVERITY")
    private String severity;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "CATEGORY")
    private String category;
    
    @Column(name = "AFFECTEDSYSTEM")
    private String affectedSystem;

    @Column(name = "REPORTED_BY")
    private Long reportedBy;

    @Column(name = "ASSIGNED_TO")
    private Long assignedTo;
    
    @Column(name = "INCIDENTDATETIME")
    private LocalDateTime incidentDateTime;
    
    @Column(name = "ATTACHMENT_URL")
    private String attachmentUrl;

    @Column(name = "AI_STATUS")
    private String aiStatus;

    @Column(name = "KB_ARTICLE_ID")
    private String kbArticleId;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;


}