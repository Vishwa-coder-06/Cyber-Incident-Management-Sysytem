package com.secureops.knowledgeservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class KnowledgeResponse {

    private String id;

    private String title;

    private String message;

}