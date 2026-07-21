package com.docuai.generation.service;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.docuai.common.audit.AuditService;
import com.docuai.common.exception.AppException;
import com.docuai.common.exception.ErrorCode;
import com.docuai.core.domain.DocumentType;
import com.docuai.core.domain.GeneratedDocument;
import com.docuai.core.repository.DocumentTypeRepository;
import com.docuai.core.repository.GeneratedDocumentRepository;
import com.docuai.generation.dto.GenerationDto;
import com.docuai.generation.port.DocumentExportPort;
import com.docuai.infrastructure.storage.StoragePort;

@Service
public class GenerationPipelineService {

    private final GeneratedDocumentRepository generatedDocRepo;
    private final DocumentTypeRepository documentTypeRepository;
    private final List<DocumentExportPort> exportPorts;
    private final StoragePort storagePort;
    private final AuditService auditService;

    public GenerationPipelineService(GeneratedDocumentRepository generatedDocRepo, DocumentTypeRepository documentTypeRepository, List<DocumentExportPort> exportPorts, StoragePort storagePort, AuditService auditService) {
        this.generatedDocRepo = generatedDocRepo;
        this.documentTypeRepository = documentTypeRepository;
        this.exportPorts = exportPorts;
        this.storagePort = storagePort;
        this.auditService = auditService;
    }

    @Transactional
    public GeneratedDocument generateAndExport(GenerationDto.CreateRequest request, Map<String, String> sectionContents, UUID userId, String userEmail) {
        DocumentExportPort exportPort = exportPorts.stream()
                .filter(p -> p.supports(request.getFormat()))
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.EXPORT_FAILED, "Format non supporté: " + request.getFormat()));

        byte[] fileBytes = exportPort.exportDocument(sectionContents);
        
        String objectName = UUID.randomUUID() + "." + request.getFormat().toLowerCase();
        storagePort.uploadFile("documents-generated", objectName, new ByteArrayInputStream(fileBytes), "application/" + request.getFormat().toLowerCase(), fileBytes.length);

        DocumentType docType = documentTypeRepository.findById(request.getDocumentTypeId())
                .orElseThrow(() -> new AppException(ErrorCode.DOCUMENT_TYPE_NOT_FOUND, "DocumentType introuvable"));

        GeneratedDocument.GeneratedDocumentBuilder docBuilder = GeneratedDocument.builder()
                .documentType(docType)
                .title(request.getName() != null ? request.getName() : "Generated Doc")
                .status(GeneratedDocument.Status.EXPORTED);

        switch (request.getFormat().toLowerCase()) {
            case "docx" -> docBuilder.exportDocxKey(objectName);
            case "pdf" -> docBuilder.exportPdfKey(objectName);
            case "md" -> docBuilder.exportMdKey(objectName);
            default -> throw new AppException(ErrorCode.EXPORT_FAILED, "Format non supporté: " + request.getFormat());
        }

        GeneratedDocument doc = docBuilder.build();
        doc = generatedDocRepo.save(doc);
        
        auditService.log(userId, userEmail, "DOCUMENT_GENERATED", "GeneratedDocument", doc.getId(), doc.getTitle(), "Généré en " + request.getFormat());
        
        return doc;
    }
}
