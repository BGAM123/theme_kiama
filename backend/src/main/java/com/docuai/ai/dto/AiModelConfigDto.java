package com.docuai.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

public class AiModelConfigDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private UUID id;
        private String provider;
        private String modelName;
        private Double temperature;
        private Integer maxTokens;
        private Boolean isDefault;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        private String provider;
        private String modelName;
        private String apiKey; // Plaintext passing in, will be encrypted in DB
        private Double temperature;
        private Integer maxTokens;
        private Boolean isDefault;
    }
}
