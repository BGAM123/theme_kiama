package com.docuai.documenttype.controller;

import com.docuai.common.dto.ApiResponse;
import com.docuai.core.domain.ExtractionJob;
import com.docuai.documenttype.dto.DocumentTypeDto;
import com.docuai.documenttype.dto.StructureNodeDTO;
import com.docuai.documenttype.service.DocumentTypeService;
import com.docuai.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/document-types")
public class DocumentTypeController {

    private final DocumentTypeService docTypeService;

    public DocumentTypeController(DocumentTypeService docTypeService) {
        this.docTypeService = docTypeService;
    }

    @PostMapping("/import")
    @PreAuthorize("hasAuthority('DOCTYPE_CREATE')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> importDocumentType(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("categoryId") UUID categoryId,
            @RequestParam(value = "description", required = false) String description,
            Authentication authentication) {
            
        UUID userId = UUID.fromString(authentication.getName());
        ExtractionJob job = docTypeService.importDocumentType(file, name, categoryId, description, userId, "admin@docuai.com");
        
        Map<String, Object> response = new HashMap<>();
        response.put("jobId", job.getId());
        response.put("documentTypeId", job.getDocumentType().getId());
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}/structure")
    public ResponseEntity<ApiResponse<List<StructureNodeDTO>>> getStructure(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(docTypeService.getStructure(id)));
    }
}
