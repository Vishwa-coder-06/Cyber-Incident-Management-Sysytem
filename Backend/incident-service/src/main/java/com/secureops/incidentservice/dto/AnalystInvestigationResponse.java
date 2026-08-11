package com.secureops.incidentservice.dto;

import java.util.List;

import com.secureops.common.dto.IncidentSummary;
import com.secureops.incidentservice.entity.IncidentAnalysis;
import com.secureops.incidentservice.entity.IncidentTimelineEvent;

public class AnalystInvestigationResponse {

    private IncidentSummary incident;

    private IncidentAnalysis analysis;

    private List<IncidentTimelineEvent> timeline;

    public AnalystInvestigationResponse(
            IncidentSummary incident,
            IncidentAnalysis analysis,
            List<IncidentTimelineEvent> timeline) {

        this.incident = incident;
        this.analysis = analysis;
        this.timeline = timeline;
    }

    public IncidentSummary getIncident() {
        return incident;
    }

    public IncidentAnalysis getAnalysis() {
        return analysis;
    }

    public List<IncidentTimelineEvent> getTimeline() {
        return timeline;
    }
}