package com.secureops.knowledgeservice.dto;

import java.util.List;

import lombok.Data;

@Data
public class KnowledgeRequest {

    private String title;

    private String category;

    private String severity;

    private String description;

    private List<String> symptoms;

    private String solution;

    private String prevention;

    private List<String> references;

    private List<String> tags;

    private String createdBy;
    
    private String status;

}