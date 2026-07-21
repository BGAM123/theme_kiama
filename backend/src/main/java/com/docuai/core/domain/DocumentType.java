package com.docuai.core.domain;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.springframework.data.annotation.CreatedBy;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "document_types")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@SQLDelete(sql = "UPDATE document_types SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class DocumentType extends BaseEntity {
    private String name;
    private String description;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
    
    @Enumerated(EnumType.STRING)
    private Status status = Status.IMPORTED;
    
    private String sourceFileKey;
    private String sourceFileName;
    private String sourceMimeType;
    private Integer sectionsCount = 0;
    private Integer documentsCount = 0;
    
    @CreatedBy
    private UUID createdBy;
    private ZonedDateTime deletedAt;

    public enum Status { IMPORTED, EXTRACTING, EXTRACTED, ACTIVE, ARCHIVED }
}
