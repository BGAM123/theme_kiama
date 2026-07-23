package com.docuai.core.domain;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ai_model_configs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AiModelConfig extends BaseEntity {
    private String provider;
    private String modelName;
    private String apiKeyEncrypted;
    private String baseUrl;
    @Enumerated(EnumType.STRING)
    private Status status = Status.INACTIVE;
    private Boolean isDefault = false;
    private Integer maxTokens = 4096;
    private java.math.BigDecimal temperature = new java.math.BigDecimal("0.70");
    private Long totalRequests = 0L;
    private Long totalTokensUsed = 0L;
    private Integer avgResponseMs = 0;
    @Column(name = "cost_per_1k_tokens")
    private java.math.BigDecimal costPer1kTokens = java.math.BigDecimal.ZERO;

    public enum Status { ACTIVE, INACTIVE }
}
