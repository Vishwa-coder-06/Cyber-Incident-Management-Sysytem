package com.secureops.knowledgeservice.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.secureops.knowledgeservice.entity.Playbook;

public interface PlaybookRepository
        extends MongoRepository<Playbook, String> {

    // Count active playbooks
    long countByStatusIgnoreCase(String status);

    // Search playbooks by name
    List<Playbook> findByNameContainingIgnoreCase(String keyword);

    // Filter by category
    List<Playbook> findByCategoryIgnoreCase(String category);

    // Filter by status
    List<Playbook> findByStatusIgnoreCase(String status);

    // Get latest playbooks
    List<Playbook> findTop5ByOrderByCreatedAtDesc();
}