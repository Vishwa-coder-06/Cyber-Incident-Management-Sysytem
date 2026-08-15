package com.secureops.incidentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KBConversionResponse {

    private Long incidentId;

    private String kbArticleId;

    private String articleTitle;

    private String message;
}
