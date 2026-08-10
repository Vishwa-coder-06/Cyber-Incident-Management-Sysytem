package com.secureops.knowledgeservice.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.secureops.common.dto.KnowledgeSummary;
import com.secureops.knowledgeservice.dto.KnowledgeRequest;
import com.secureops.knowledgeservice.dto.KnowledgeResponse;
import com.secureops.knowledgeservice.entity.KnowledgeArticle;
import com.secureops.knowledgeservice.service.KnowledgeService;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin("*")
public class KnowledgeController {

    private final KnowledgeService service;

    public KnowledgeController(KnowledgeService service) {
        this.service = service;
    }
    

    @PostMapping
    public KnowledgeResponse createArticle(
            @RequestBody KnowledgeRequest request){
    	

        return service.createArticle(request);

    }

    @GetMapping
    public List<KnowledgeArticle> getAllArticles(){

        return service.getAllArticles();

    }
    
    @GetMapping("/recent")
    public List<KnowledgeSummary> getRecentArticles() {

        return service.getRecentArticles();
    }

    @GetMapping("/{id}")
    public KnowledgeArticle getArticleById(
            @PathVariable String id){

        return service.getArticleById(id);

    }

    @PutMapping("/{id}")
    public KnowledgeArticle updateArticle(
            @PathVariable String id,
            @RequestBody KnowledgeArticle article){

        return service.updateArticle(id,article);

    }

    @DeleteMapping("/{id}")
    public void deleteArticle(
            @PathVariable String id){

        service.deleteArticle(id);

    }

    @GetMapping("/category/{category}")
    public List<KnowledgeArticle> getByCategory(
            @PathVariable String category){

        return service.searchByCategory(category);

    }

    @GetMapping("/severity/{severity}")
    public List<KnowledgeArticle> getBySeverity(
            @PathVariable String severity){

        return service.searchBySeverity(severity);

    }

    @GetMapping("/tag/{tag}")
    public List<KnowledgeArticle> getByTag(
            @PathVariable String tag){

        return service.searchByTag(tag);

    }

    @GetMapping("/search")
    public List<KnowledgeArticle> search(
            @RequestParam String keyword){

        return service.searchByTitle(keyword);

    }
    

}