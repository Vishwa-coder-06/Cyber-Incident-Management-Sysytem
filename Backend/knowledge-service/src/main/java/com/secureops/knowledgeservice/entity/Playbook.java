package com.secureops.knowledgeservice.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "playbooks")
public class Playbook {

    @Id
    private String id;

    private String name;

    private String description;

    private String category;

    private String status;

    private LocalDateTime createdAt;
}