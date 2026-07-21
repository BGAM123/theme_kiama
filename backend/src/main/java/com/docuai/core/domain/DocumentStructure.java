package com.docuai.core.domain;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "document_structures")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DocumentStructure extends BaseEntity {
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_type_id", nullable = false)
    private DocumentType documentType;
    
    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private String structureJson = "[]";
    
    private ZonedDateTime extractedAt;
    private ZonedDateTime validatedAt;
    private UUID validatedBy;
}
