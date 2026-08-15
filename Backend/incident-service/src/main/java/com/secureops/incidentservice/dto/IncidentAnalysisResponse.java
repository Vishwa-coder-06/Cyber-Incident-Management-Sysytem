package com.secureops.incidentservice.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncidentAnalysisResponse {

    private Long incidentId;

    private String title;

    // ─── Original fields (kept for backward compat) ──────────────────────────
    private String category;

    /** Backward-compat severity field — equals aiSeverity for now. */
    private String severity;

    private String rootCause;

    private String immediateAdvice;

    private String recommendedPlaybookId;

    private String recommendedPlaybookTitle;

    private LocalDateTime analyzedAt;

    // ─── New enriched AI fields ───────────────────────────────────────────────

    /**
     * Attack type predicted by the Python ML model.
     * This is the actual ML classification output.
     */
    private String attackType;

    /**
     * Model confidence for the predicted attackType (0.0–1.0).
     */
    private Double confidence;

    /**
     * Severity derived from attackType via a rule table.
     * NOT ML-predicted. Separate from analyst-confirmed final severity.
     */
    private String aiSeverity;

    /** Source: "AUTO" or "MANUAL". */
    private String incidentSource;

    /** Up to 3 similar historical incidents from the ML service. */
    private List<SimilarIncidentInfo> similarIncidents;

    // ─── Inner DTO for similar incidents ─────────────────────────────────────
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SimilarIncidentInfo {
        private String category;
        private String description;
        private Double similarity;
    }
}