package com.docuai.core.domain;
import jakarta.persistence.*;
import lombok.*;
import java.time.ZonedDateTime;

@Entity
@Table(name = "extraction_jobs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ExtractionJob extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_type_id")
    private DocumentType documentType;
    
    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;
    private Integer progress = 0;
    private String currentStep;
    private String errorMessage;
    private ZonedDateTime startedAt;
    private ZonedDateTime completedAt;

    public enum Status { PENDING, RUNNING, COMPLETED, FAILED }
}
