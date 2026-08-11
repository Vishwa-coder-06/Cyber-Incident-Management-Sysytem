package com.secureops.incidentservice.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminReportResponse {

    private double mttdHours;

    private double mttrHours;

    private long incidentsThisMonth;

    private long repeatIncidents;

    private long critical;

    private long high;

    private long medium;

    private long low;

    private List<SystemReport> topAffectedSystems;
}