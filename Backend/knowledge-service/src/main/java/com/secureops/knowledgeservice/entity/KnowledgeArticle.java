package com.secureops.knowledgeservice.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

@Document(collection = "knowledge_articles")
public class KnowledgeArticle {

    @Id
    private String id;

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

    private LocalDateTime createdAt;
    
    private Long views;
    
    private String status;

}