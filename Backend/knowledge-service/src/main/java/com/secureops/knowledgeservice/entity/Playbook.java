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
@Document(collection = "playbooks")
public class Playbook {

    @Id
    private String id;

    // Playbook name
    private String name;

    // Short description
    private String description;

    // Auth, Malware, Phishing, Network, etc.
    private String category;

    // ACTIVE / INACTIVE
    private String status;

    // Steps followed by analyst
    private List<String> steps;

    // Who created the playbook
    private String createdBy;

    // Created date
    private LocalDateTime createdAt;

    // Last modification date
    private LocalDateTime updatedAt;
}