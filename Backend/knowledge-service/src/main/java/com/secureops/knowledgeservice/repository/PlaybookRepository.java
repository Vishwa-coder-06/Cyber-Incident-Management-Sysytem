package com.secureops.knowledgeservice.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.secureops.knowledgeservice.entity.Playbook;

public interface PlaybookRepository
        extends MongoRepository<Playbook, String> {

    long countByStatusIgnoreCase(String status);
}