package com.secureops.incidentservice.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "INCIDENT_ANALYSIS")
public class IncidentAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long analysisId;

    private Long incidentId;

    // ─── From original keyword-matching (kept for backward compat) ──────────
    // category is now set to the AI-predicted attackType
    private String category;

    // severity here equals aiSeverity (rule-derived) for backward compat
    private String severity;

    @Column(length = 2000)
    private String rootCause;

    @Column(length = 2000)
    private String immediateAdvice;

    private String recommendedPlaybookId;

    private String recommendedPlaybookTitle;

    private LocalDateTime analyzedAt;

    // ─── New fields for real AI analysis ────────────────────────────────────

    /**
     * Attack type predicted by the Python ML model (e.g. "Phishing", "Ransomware").
     * This is the actual ML output.
     */
    @Column(name = "ATTACK_TYPE")
    private String attackType;

    /**
     * Model confidence score for the predicted attackType (0.0–1.0).
     * From Python model.predict_proba().
     */
    @Column(name = "CONFIDENCE")
    private Double confidence;

    /**
     * Severity derived from attackType using a rule table.
     * NOT ML-predicted. Separate from analyst-confirmed final severity.
     */
    @Column(name = "AI_SEVERITY")
    private String aiSeverity;

    /**
     * JSON array of similar historical incidents from the ML service.
     * Each entry: { "description": "...", "category": "...", "similarity": 0.85 }
     */
    @Column(name = "SIMILAR_INCIDENTS_JSON", columnDefinition = "CLOB")
    private String similarIncidentsJson;

    /**
     * Source of analysis: "AUTO" (triggered on incident creation) or "MANUAL".
     */
    @Column(name = "INCIDENT_SOURCE")
    private String incidentSource;
}