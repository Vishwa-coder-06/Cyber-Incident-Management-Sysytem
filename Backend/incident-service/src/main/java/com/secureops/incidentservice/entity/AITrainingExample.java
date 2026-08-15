package com.secureops.incidentservice.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a curated machine learning training example generated from a resolved incident.
 * Features: title, description, affectedSystem.
 * Target Ground-Truth Labels: attackTypeLabel (analyst confirmed), severityLabel (analyst confirmed).
 * Supplementary Context: rootCause, resolutionStepsJson, lessonsLearned.
 *
 * Explicit Admin Gate: approved must be true before it can be used for retraining.
 */
@Entity
@Table(name = "AI_TRAINING_EXAMPLES")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AITrainingExample {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TRAINING_EXAMPLE_ID")
    private Long id;

    @Column(name = "INCIDENT_ID", nullable = false, unique = true)
    private Long incidentId;

    // ─── Input Features ──────────────────────────────────────────────────────
    @Column(name = "TITLE", nullable = false)
    private String title;

    @Column(name = "DESCRIPTION", columnDefinition = "CLOB")
    @Lob
    private String description;

    @Column(name = "AFFECTED_SYSTEM")
    private String affectedSystem;

    @Column(name = "INITIAL_CATEGORY")
    private String initialCategory;

    // ─── Analyst Confirmed Ground-Truth Labels ───────────────────────────────
    @Column(name = "ATTACK_TYPE_LABEL", nullable = false)
    private String attackTypeLabel;

    @Column(name = "SEVERITY_LABEL", nullable = false)
    private String severityLabel;

    // ─── Supplementary Resolution Context ───────────────────────────────────
    @Column(name = "ROOT_CAUSE", columnDefinition = "CLOB")
    @Lob
    private String rootCause;

    @Column(name = "RESOLUTION_STEPS_JSON", columnDefinition = "CLOB")
    @Lob
    private String resolutionStepsJson;

    @Column(name = "LESSONS_LEARNED", columnDefinition = "CLOB")
    @Lob
    private String lessonsLearned;

    // ─── Governance / Admin Approval Gate ────────────────────────────────────
    @Column(name = "IS_APPROVED")
    private boolean approved = false;

    @Column(name = "APPROVED_BY")
    private String approvedBy;

    @Column(name = "APPROVED_AT")
    private LocalDateTime approvedAt;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;
}
