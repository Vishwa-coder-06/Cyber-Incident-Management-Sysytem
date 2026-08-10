package com.secureops.incidentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class IncidentDashboardResponse {
	private long total;
	private long open;
	private long inProgress;
	private long resolved;
	private long critical;

}
