package com.docuai.generation.controller;

import com.docuai.common.dto.ApiResponse;
import com.docuai.core.domain.GeneratedDocument;
import com.docuai.generation.dto.GenerationDto;
import com.docuai.generation.service.GenerationPipelineService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/generations")
public class GenerationController {

    private final GenerationPipelineService generationService;

    public GenerationController(GenerationPipelineService generationService) {
        this.generationService = generationService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, UUID>>> triggerGeneration(
            @RequestBody GenerationDto.CreateRequest request,
            Authentication authentication) {
            
        // Mock section contents for POC. In reality, retrieved from Database Conversation/Messages.
        Map<String, String> mockContents = new HashMap<>();
        mockContents.put("Titre 1", "Contenu finalisé par l'IA");
        mockContents.put("Titre 2", "Autre paragraphe");

        UUID userId = UUID.fromString(authentication.getName());

        GeneratedDocument doc = generationService.generateAndExport(request, mockContents, userId, "admin@docuai.com");
        
        return ResponseEntity.ok(ApiResponse.success(Map.of("generatedDocumentId", doc.getId())));
    }
}
