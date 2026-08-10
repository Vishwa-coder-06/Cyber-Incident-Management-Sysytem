package com.secureops.common.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KnowledgeSummary {

    private String id;

    private String title;

    private LocalDateTime createdAt;

    private Long views;
}