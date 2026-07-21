package com.docuai.core.controller;

import com.docuai.ai.dto.AiModelConfigDto;
import com.docuai.common.dto.ApiResponse;
import com.docuai.core.domain.AiModelConfig;
import com.docuai.core.repository.AiModelConfigRepository;
import com.docuai.security.AesEncryptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/ai-configs")
@PreAuthorize("hasAuthority('ADMIN_ACCESS')")
public class AiModelConfigController {

    private final AiModelConfigRepository configRepository;
    private final AesEncryptionService encryptionService;

    public AiModelConfigController(AiModelConfigRepository configRepository, AesEncryptionService encryptionService) {
        this.configRepository = configRepository;
        this.encryptionService = encryptionService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AiModelConfigDto.Response>>> getConfig() {
        List<AiModelConfigDto.Response> configs = configRepository.findAll().stream()
                .map(c -> new AiModelConfigDto.Response(c.getId(), c.getProvider(), c.getModelName(), c.getTemperature(), c.getMaxTokens(), c.getIsDefault()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(configs));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AiModelConfigDto.Response>> createConfig(@RequestBody AiModelConfigDto.CreateRequest request) {
        // If this is set as default, unset others
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            List<AiModelConfig> allConfigs = configRepository.findAll();
            allConfigs.forEach(c -> c.setIsDefault(false));
            configRepository.saveAll(allConfigs);
        }

        AiModelConfig config = AiModelConfig.builder()
                .provider(request.getProvider())
                .modelName(request.getModelName())
                .apiKeyEncrypted(encryptionService.encrypt(request.getApiKey()))
                .temperature(request.getTemperature())
                .maxTokens(request.getMaxTokens() != null ? request.getMaxTokens() : 2000)
                .isDefault(request.getIsDefault() != null ? request.getIsDefault() : false)
                .build();
                
        config = configRepository.save(config);
        
        return ResponseEntity.ok(ApiResponse.success(
             new AiModelConfigDto.Response(config.getId(), config.getProvider(), config.getModelName(), config.getTemperature(), config.getMaxTokens(), config.getIsDefault())
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConfig(@PathVariable UUID id) {
        configRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
