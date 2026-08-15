package com.secureops.incidentservice.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Stores the structured resolution records created by analysts upon closing an incident.
 * Contains analyst-confirmed labels: finalAttackType and finalSeverity.
 * These confirmed labels serve as the ground-truth for future training data.
 */
@Entity
@Table(name = "INCIDENT_RESOLUTIONS")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncidentResolution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RESOLUTION_ID")
    private Long resolutionId;

    @Column(name = "INCIDENT_ID", nullable = false)
    private Long incidentId;

    @Column(name = "RESOLUTION_SUMMARY", columnDefinition = "CLOB")
    @Lob
    private String resolutionSummary;

    /**
     * JSON array of ordered step strings: ["Step 1...", "Step 2..."]
     */
    @Column(name = "RESOLUTION_STEPS_JSON", columnDefinition = "CLOB")
    @Lob
    private String resolutionStepsJson;

    @Column(name = "ROOT_CAUSE", columnDefinition = "CLOB")
    @Lob
    private String rootCause;

    /**
     * Final attack type confirmed by the analyst (e.g. "Phishing", "Ransomware").
     * Ground-truth classification label.
     */
    @Column(name = "FINAL_ATTACK_TYPE")
    private String finalAttackType;

    /**
     * Final severity confirmed by the analyst (LOW / MEDIUM / HIGH / CRITICAL).
     * Ground-truth severity label.
     */
    @Column(name = "FINAL_SEVERITY")
    private String finalSeverity;

    @Column(name = "LESSONS_LEARNED", columnDefinition = "CLOB")
    @Lob
    private String lessonsLearned;

    @Column(name = "RESOLVED_BY")
    private Long resolvedBy;

    @Column(name = "RESOLVED_BY_NAME")
    private String resolvedByName;

    @Column(name = "RESOLVED_AT")
    private LocalDateTime resolvedAt;
}
