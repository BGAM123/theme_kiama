package com.docuai.documenttype.controller;

import com.docuai.common.dto.ApiResponse;
import com.docuai.core.domain.ExtractionJob;
import com.docuai.core.repository.ExtractionJobRepository;
import com.docuai.extraction.dto.ExtractionStatusDTO;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/extraction-jobs")
public class ExtractionJobController {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ExtractionJobRepository jobRepository;

    public ExtractionJobController(RedisTemplate<String, Object> redisTemplate, ExtractionJobRepository jobRepository) {
        this.redisTemplate = redisTemplate;
        this.jobRepository = jobRepository;
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<ApiResponse<ExtractionStatusDTO>> getJobStatus(@PathVariable UUID jobId) {
        String redisKey = "job:" + jobId;
        
        // Check Redis
        Boolean hasKey = redisTemplate.hasKey(redisKey);
        if (Boolean.TRUE.equals(hasKey)) {
            String status = (String) redisTemplate.opsForHash().get(redisKey, "status");
            Integer progress = (Integer) redisTemplate.opsForHash().get(redisKey, "progress");
            String step = (String) redisTemplate.opsForHash().get(redisKey, "step");
            String errorMsg = (String) redisTemplate.opsForHash().get(redisKey, "errorMsg");
            
            return ResponseEntity.ok(ApiResponse.success(
                    new ExtractionStatusDTO(jobId, status, progress, step, errorMsg)
            ));
        }
        
        // Fallback to DB
        ExtractionJob job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
                
        return ResponseEntity.ok(ApiResponse.success(
                new ExtractionStatusDTO(jobId, job.getStatus().name(), job.getProgress(), job.getCurrentStep(), job.getErrorMessage())
        ));
    }
}
