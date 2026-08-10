package com.secureops.assignmentservice.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import com.secureops.assignmentservice.config.FeignConfig;
import com.secureops.common.dto.KnowledgeSummary;

@FeignClient(
        name = "knowledge-service",
        url = "http://localhost:8085",
        configuration = FeignConfig.class
)
public interface KnowledgeClient {

    @GetMapping("/api/articles/recent")
    List<KnowledgeSummary> getRecentArticles();
}