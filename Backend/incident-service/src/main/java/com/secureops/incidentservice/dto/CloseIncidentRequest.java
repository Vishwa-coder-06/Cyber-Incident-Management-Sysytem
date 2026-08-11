package com.secureops.incidentservice.dto;

public class CloseIncidentRequest {

    private String resolutionSummary;

    private String articleTitle;

    private String tags;

    private boolean generateKnowledgeArticle;

    public String getResolutionSummary() {
        return resolutionSummary;
    }

    public void setResolutionSummary(
            String resolutionSummary) {

        this.resolutionSummary =
                resolutionSummary;
    }

    public String getArticleTitle() {
        return articleTitle;
    }

    public void setArticleTitle(
            String articleTitle) {

        this.articleTitle = articleTitle;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public boolean isGenerateKnowledgeArticle() {
        return generateKnowledgeArticle;
    }

    public void setGenerateKnowledgeArticle(
            boolean generateKnowledgeArticle) {

        this.generateKnowledgeArticle =
                generateKnowledgeArticle;
    }
}