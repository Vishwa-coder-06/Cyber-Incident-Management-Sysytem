package com.secureops.knowledgeservice.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

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