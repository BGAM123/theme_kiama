package com.docuai.documenttype.dto;

import com.docuai.category.dto.CategoryDto;
import com.docuai.user.dto.UserDto;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.ZonedDateTime;
import java.util.UUID;

public class DocumentTypeDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private UUID id;
        private String name;
        private String description;
        private CategoryDto.Response category;
        private String status;
        private Integer sectionsCount;
        private Integer documentsCount;
        private String sourceFileName;
        private CreatorDto createdBy;
        private ZonedDateTime createdAt;
        private ZonedDateTime updatedAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreatorDto {
        private UUID id;
        private String fullName;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateRequest {
        @NotBlank
        private String name;
        private String description;
        private UUID categoryId;
        private String status;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateStructureRequest {
        private java.util.List<StructureNodeDTO> nodes;
    }
}
