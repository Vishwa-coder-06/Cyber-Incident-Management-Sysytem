package com.secureops.knowledgeservice.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.secureops.knowledgeservice.entity.KnowledgeArticle;

public interface KnowledgeRepository extends MongoRepository<KnowledgeArticle, String> {

    List<KnowledgeArticle> findByCategory(String category);

    List<KnowledgeArticle> findBySeverity(String severity);

    List<KnowledgeArticle> findByTagsContaining(String tag);

    List<KnowledgeArticle> findByTitleContainingIgnoreCase(String keyword);

    List<KnowledgeArticle> findTop5ByOrderByCreatedAtDesc();

    long countByStatusIgnoreCase(String status);

    List<KnowledgeArticle> findByStatusIgnoreCase(String status);

    long countByCategoryIgnoreCase(String category);
}