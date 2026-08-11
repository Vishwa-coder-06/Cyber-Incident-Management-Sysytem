package com.secureops.knowledgeservice.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;

import com.secureops.knowledgeservice.entity.KnowledgeArticle;

public interface KnowledgeRepository
        extends MongoRepository<KnowledgeArticle,String>{

    List<KnowledgeArticle> findByCategory(String category);

    List<KnowledgeArticle> findBySeverity(String severity);

    List<KnowledgeArticle> findByTagsContaining(String tag);

    List<KnowledgeArticle> findByTitleContainingIgnoreCase(String keyword);
    
    List<KnowledgeArticle> findTop5ByOrderByCreatedAtDesc();
    
    @Query("""
    	    SELECT k
    	    FROM KnowledgeArticle k
    	    WHERE (:search IS NULL OR
    	           LOWER(k.title) LIKE LOWER(CONCAT('%', :search, '%')))
    	      AND (:category IS NULL OR
    	           LOWER(k.category) = LOWER(:category))
    	    ORDER BY k.createdAt DESC
    	""")
    	List<KnowledgeArticle> searchArticles(
    	        @Param("search") String search,
    	        @Param("category") String category);
    
    long countByStatusIgnoreCase(String status);

    List<KnowledgeArticle> findByStatusIgnoreCase(String status);

    long countByCategoryIgnoreCase(String category);


}