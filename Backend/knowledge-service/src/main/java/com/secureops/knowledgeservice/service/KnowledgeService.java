package com.secureops.knowledgeservice.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.secureops.common.dto.KnowledgeSummary;
import com.secureops.knowledgeservice.dto.KnowledgeRequest;
import com.secureops.knowledgeservice.dto.KnowledgeResponse;
import com.secureops.knowledgeservice.entity.KnowledgeArticle;
import com.secureops.knowledgeservice.entity.Playbook;
import com.secureops.knowledgeservice.repository.KnowledgeRepository;
import com.secureops.knowledgeservice.repository.PlaybookRepository;

@Service
public class KnowledgeService {

    private final KnowledgeRepository repository;
    private final PlaybookRepository playbookRepository;

    public KnowledgeService(KnowledgeRepository repository,PlaybookRepository playbookRepository) {
        this.repository = repository;
        this.playbookRepository=playbookRepository;
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
        article.setViews(0L);
        if (request.getStatus() == null ||
                request.getStatus().isBlank()) {

            article.setStatus("DRAFT");

        } else {

            article.setStatus(request.getStatus());
        }

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
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Article Not Found"));

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
    
    public List<KnowledgeSummary> getRecentArticles() {

        return repository
                .findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(article ->
                        new KnowledgeSummary(
                                article.getId(),
                                article.getTitle(),
                                article.getCreatedAt(),
                                article.getViews()
                        )
                )
                .toList();
    }
    
    public long getActivePlaybookCount() {

        return playbookRepository
                .countByStatusIgnoreCase("ACTIVE");
    }
    
    public List<KnowledgeArticle> searchArticles(
            String search,
            String category) {

        return repository.searchArticles(
                search,
                category
        );
    }
    
 // =====================================================
 // PLAYBOOK MANAGEMENT
 // =====================================================

 // CREATE PLAYBOOK
 public Playbook createPlaybook(Playbook playbook) {

     playbook.setCreatedAt(LocalDateTime.now());
     playbook.setUpdatedAt(LocalDateTime.now());

     // Default status
     if (playbook.getStatus() == null ||
             playbook.getStatus().isBlank()) {

         playbook.setStatus("ACTIVE");
     }

     return playbookRepository.save(playbook);
 }


 // GET ALL PLAYBOOKS
 public List<Playbook> getAllPlaybooks() {

     return playbookRepository.findAll();
 }


 // GET PLAYBOOK BY ID
 public Playbook getPlaybookById(String id) {

     return playbookRepository
             .findById(id)
             .orElseThrow(() ->
                     new RuntimeException(
                             "Playbook Not Found"));
 }


 // UPDATE PLAYBOOK
 public Playbook updatePlaybook(
         String id,
         Playbook updatedPlaybook) {

     Playbook playbook =
             playbookRepository
                     .findById(id)
                     .orElseThrow(() ->
                             new RuntimeException(
                                     "Playbook Not Found"));

     playbook.setName(
             updatedPlaybook.getName());

     playbook.setDescription(
             updatedPlaybook.getDescription());

     playbook.setCategory(
             updatedPlaybook.getCategory());

     playbook.setStatus(
             updatedPlaybook.getStatus());

     playbook.setSteps(
             updatedPlaybook.getSteps());

     playbook.setCreatedBy(
             updatedPlaybook.getCreatedBy());

     playbook.setUpdatedAt(
             LocalDateTime.now());

     return playbookRepository.save(playbook);
 }


 // DELETE PLAYBOOK
 public void deletePlaybook(String id) {

     if (!playbookRepository.existsById(id)) {

         throw new RuntimeException(
                 "Playbook Not Found");
     }

     playbookRepository.deleteById(id);
 }


 // SEARCH PLAYBOOKS
 public List<Playbook> searchPlaybooks(
         String keyword) {

     return playbookRepository
             .findByNameContainingIgnoreCase(keyword);
 }


 // PLAYBOOKS BY CATEGORY
 public List<Playbook> getPlaybooksByCategory(
         String category) {

     return playbookRepository
             .findByCategoryIgnoreCase(category);
 }


 // PLAYBOOKS BY STATUS
 public List<Playbook> getPlaybooksByStatus(
         String status) {

     return playbookRepository
             .findByStatusIgnoreCase(status);
 }
 
//=====================================================
//KNOWLEDGE BASE STATISTICS
//=====================================================

public long getTotalArticleCount() {

  return repository.count();
}


public long getPublishedArticleCount() {

  return repository
          .countByStatusIgnoreCase("PUBLISHED");
}


public long getDraftArticleCount() {

  return repository
          .countByStatusIgnoreCase("DRAFT");
}

public List<KnowledgeArticle> getArticlesByStatus(
        String status) {

    return repository
            .findByStatusIgnoreCase(status);
}

}