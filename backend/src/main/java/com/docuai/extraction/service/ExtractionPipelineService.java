package com.docuai.extraction.service;

import com.docuai.common.audit.AuditService;
import com.docuai.common.notification.NotificationService;
import com.docuai.core.domain.DocumentStructure;
import com.docuai.core.domain.DocumentType;
import com.docuai.core.domain.ExtractionJob;
import com.docuai.core.repository.DocumentStructureRepository;
import com.docuai.core.repository.DocumentTypeRepository;
import com.docuai.core.repository.ExtractionJobRepository;
import com.docuai.documenttype.dto.StructureNodeDTO;
import com.docuai.extraction.adapter.DocxExtractionAdapter;
import com.docuai.extraction.port.ExtractionPort;
import com.docuai.infrastructure.storage.StoragePort;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.tika.Tika;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ExtractionPipelineService {

    private final ExtractionJobRepository jobRepository;
    private final DocumentTypeRepository documentTypeRepository;
    private final DocumentStructureRepository structureRepository;
    private final StoragePort storagePort;
    private final ExtractionPort remoteExtractionPort; // Http or Mock
    private final DocxExtractionAdapter docxAdapter;
    private final RedisTemplate<String, Object> redisTemplate;
    private final NotificationService notificationService;
    private final AuditService auditService;
    private final ObjectMapper objectMapper;
    private final Tika tika = new Tika();

    public ExtractionPipelineService(ExtractionJobRepository jobRepository, DocumentTypeRepository documentTypeRepository, DocumentStructureRepository structureRepository, StoragePort storagePort, @org.springframework.beans.factory.annotation.Qualifier("remoteExtractionPort") ExtractionPort remoteExtractionPort, DocxExtractionAdapter docxAdapter, RedisTemplate<String, Object> redisTemplate, NotificationService notificationService, AuditService auditService, ObjectMapper objectMapper) {
        this.jobRepository = jobRepository;
        this.documentTypeRepository = documentTypeRepository;
        this.structureRepository = structureRepository;
        this.storagePort = storagePort;
        this.remoteExtractionPort = remoteExtractionPort;
        this.docxAdapter = docxAdapter;
        this.redisTemplate = redisTemplate;
        this.notificationService = notificationService;
        this.auditService = auditService;
        this.objectMapper = objectMapper;
    }

    @Async("virtualThreadExecutor")
    @Transactional
    public void startExtraction(ExtractionJob job) {
        DocumentType documentType = job.getDocumentType();
        try {
            updateJobStatus(job, ExtractionJob.Status.RUNNING, 5, "Téléchargement du fichier source");
            
            InputStream fileStream = storagePort.getFile("documents-source", documentType.getSourceFileKey());
            String realMimeType = tika.detect(fileStream, documentType.getSourceFileName());
            
            updateJobStatus(job, ExtractionJob.Status.RUNNING, 20, "Analyse du format " + realMimeType);
            
            List<StructureNodeDTO> structure;
            if (realMimeType.contains("wordprocessingml.document")) {
                structure = docxAdapter.extractStructure(storagePort.getFile("documents-source", documentType.getSourceFileKey()), documentType.getSourceFileName());
            } else {
                updateJobStatus(job, ExtractionJob.Status.RUNNING, 30, "Appel au service d'extraction externe");
                structure = remoteExtractionPort.extractStructure(documentType.getSourceFileKey(), "documents-source");
            }
            
            updateJobStatus(job, ExtractionJob.Status.RUNNING, 80, "Génération de la structure JSONB");
            String jsonStructure = objectMapper.writeValueAsString(structure);
            
            DocumentStructure docStructure = DocumentStructure.builder()
                    .documentType(documentType)
                    .structureJson(jsonStructure)
                    .extractedAt(ZonedDateTime.now())
                    .build();
            structureRepository.save(docStructure);
            
            documentType.setStatus(DocumentType.Status.EXTRACTED);
            documentType.setSectionsCount((int) structure.stream().filter(n -> "H1".equals(n.getType())).count());
            documentTypeRepository.save(documentType);
            
            updateJobStatus(job, ExtractionJob.Status.COMPLETED, 100, "Terminé");
            
            notificationService.createNotification(documentType.getCreatedBy(), "EXTRACTION_COMPLETE", 
                    "Extraction réussie", "Structure de « " + documentType.getName() + " » extraite avec succès.", "DocumentType", documentType.getId());
            
            auditService.log(documentType.getCreatedBy(), "system", "DOCTYPE_EXTRACTION_COMPLETE", "DocumentType", documentType.getId(), documentType.getName(), "Extraction 100%");

        } catch (Exception e) {
            handleExtractionError(job, documentType, e);
        }
    }

    private void handleExtractionError(ExtractionJob job, DocumentType documentType, Exception e) {
        updateJobStatus(job, ExtractionJob.Status.FAILED, job.getProgress(), "Erreur : " + e.getMessage());
        documentType.setStatus(DocumentType.Status.IMPORTED);
        documentTypeRepository.save(documentType);
        
        notificationService.createNotification(documentType.getCreatedBy(), "EXTRACTION_FAILED", 
                "Échec de l'extraction", "L'extraction a échoué pour le document « " + documentType.getName() + " ».", "DocumentType", documentType.getId());
                
        // Log Error here securely
        auditService.log(documentType.getCreatedBy(), "system", "DOCTYPE_EXTRACTION_FAILED", "DocumentType", documentType.getId(), documentType.getName(), e.getMessage());
    }

    private void updateJobStatus(ExtractionJob job, ExtractionJob.Status status, int progress, String step) {
        job.setStatus(status);
        job.setProgress(progress);
        job.setCurrentStep(step);
        if (status == ExtractionJob.Status.COMPLETED || status == ExtractionJob.Status.FAILED) {
            job.setCompletedAt(ZonedDateTime.now());
        }
        jobRepository.save(job);
        
        // Sync to Redis for real-time polling
        String redisKey = "job:" + job.getId();
        redisTemplate.opsForHash().put(redisKey, "status", status.name());
        redisTemplate.opsForHash().put(redisKey, "progress", progress);
        redisTemplate.opsForHash().put(redisKey, "step", step);
        if (job.getErrorMessage() != null) {
            redisTemplate.opsForHash().put(redisKey, "errorMsg", job.getErrorMessage());
        }
    }
}
