package com.secureops.knowledgeservice.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.secureops.knowledgeservice.dto.KnowledgeRequest;
import com.secureops.knowledgeservice.dto.KnowledgeResponse;
import com.secureops.knowledgeservice.entity.KnowledgeArticle;
import com.secureops.knowledgeservice.repository.KnowledgeRepository;

@Service
public class KnowledgeService {

    private final KnowledgeRepository repository;

    public KnowledgeService(KnowledgeRepository repository) {
        this.repository = repository;
    }

    // Create Article

    public KnowledgeResponse createArticle(KnowledgeRequest request) {

        KnowledgeArticle article = new KnowledgeArticle();

        article.setTitle(request.getTitle());
        article.setCategory(request.getCategory());
        article.setSeverity(request.getSeverity());
        article.setDescription(request.getDescription());
        article.setSymptoms(request.getSymptoms());
        article.setSolution(request.getSolution());
        article.setPrevention(request.getPrevention());
        article.setReferences(request.getReferences());
        article.setTags(request.getTags());
        article.setCreatedBy(request.getCreatedBy());
        article.setCreatedAt(LocalDateTime.now());

        KnowledgeArticle saved = repository.save(article);

        return new KnowledgeResponse(
                saved.getId(),
                saved.getTitle(),
                "Knowledge Article Created Successfully"
        );
    }

    // Get All

    public List<KnowledgeArticle> getAllArticles() {
        return repository.findAll();
    }

    // Get By ID

    public KnowledgeArticle getArticleById(String id) {
        return repository.findById(id).orElse(null);
    }

    // Update

    public KnowledgeArticle updateArticle(String id,
                                          KnowledgeArticle updatedArticle) {

        KnowledgeArticle article =
                repository.findById(id).orElse(null);

        if(article == null){
            return null;
        }

        article.setTitle(updatedArticle.getTitle());
        article.setCategory(updatedArticle.getCategory());
        article.setSeverity(updatedArticle.getSeverity());
        article.setDescription(updatedArticle.getDescription());
        article.setSymptoms(updatedArticle.getSymptoms());
        article.setSolution(updatedArticle.getSolution());
        article.setPrevention(updatedArticle.getPrevention());
        article.setReferences(updatedArticle.getReferences());
        article.setTags(updatedArticle.getTags());
        article.setCreatedBy(updatedArticle.getCreatedBy());

        return repository.save(article);

    }

    // Delete

    public void deleteArticle(String id){

        repository.deleteById(id);

    }

    // Search

    public List<KnowledgeArticle> searchByCategory(String category){

        return repository.findByCategory(category);

    }

    public List<KnowledgeArticle> searchBySeverity(String severity){

        return repository.findBySeverity(severity);

    }

    public List<KnowledgeArticle> searchByTag(String tag){

        return repository.findByTagsContaining(tag);

    }

    public List<KnowledgeArticle> searchByTitle(String keyword){

        return repository.findByTitleContainingIgnoreCase(keyword);

    }

}