package com.secureops.aiservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SimilarIncidentDTO {
    private String category;
    private String description;
    private Double similarity;
}
