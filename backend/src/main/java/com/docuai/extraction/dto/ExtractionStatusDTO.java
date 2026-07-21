package com.docuai.extraction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExtractionStatusDTO {
    private UUID jobId;
    private String status;
    private Integer progress;
    private String currentStep;
    private String errorMessage;
}
