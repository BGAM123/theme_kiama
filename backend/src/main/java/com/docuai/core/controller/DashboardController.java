package com.docuai.core.controller;

import com.docuai.common.dto.ApiResponse;
import com.docuai.core.domain.ExtractionJob;
import com.docuai.core.domain.User;
import com.docuai.core.dto.DashboardDto;
import com.docuai.core.repository.DocumentTypeRepository;
import com.docuai.core.repository.ExtractionJobRepository;
import com.docuai.core.repository.GeneratedDocumentRepository;
import com.docuai.core.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@PreAuthorize("hasAuthority('ADMIN_ACCESS')")
public class DashboardController {

    private final UserRepository userRepository;
    private final DocumentTypeRepository documentTypeRepository;
    private final GeneratedDocumentRepository generatedDocumentRepository;
    private final ExtractionJobRepository extractionJobRepository;

    public DashboardController(UserRepository userRepository, DocumentTypeRepository documentTypeRepository, GeneratedDocumentRepository generatedDocumentRepository, ExtractionJobRepository extractionJobRepository) {
        this.userRepository = userRepository;
        this.documentTypeRepository = documentTypeRepository;
        this.generatedDocumentRepository = generatedDocumentRepository;
        this.extractionJobRepository = extractionJobRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardDto.StatsResponse>> getStats() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.findAll().stream().filter(u -> u.getStatus() == User.Status.ACTIVE).count();
        long totalDocTypes = documentTypeRepository.count();
        long totalGenerated = generatedDocumentRepository.count();
        long failedExtractions = extractionJobRepository.findAll().stream().filter(j -> j.getStatus() == ExtractionJob.Status.FAILED).count();

        DashboardDto.StatsResponse stats = DashboardDto.StatsResponse.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .totalDocumentTypes(totalDocTypes)
                .documentsGenerated(totalGenerated)
                .failedExtractions(failedExtractions)
                .build();
                
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
