package com.secureops.gateway.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileStatsResponse {
    private String role;
    private long primaryCount;
    private String primaryLabel;
    private long secondaryCount;
    private String secondaryLabel;
}
