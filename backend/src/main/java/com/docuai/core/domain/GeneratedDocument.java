package com.docuai.core.domain;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.Type;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "generated_documents")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@SQLDelete(sql = "UPDATE generated_documents SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class GeneratedDocument extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id")
    private Conversation conversation;
    
    private UUID messageId;
    private String title;
    private String contentHtml;
    
    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private String contentPivot;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_type_id")
    private DocumentType documentType;
    
    private Integer conformityScore = 0;
    
    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private String conformityDetails = "[]";
    
    @Enumerated(EnumType.STRING)
    private Status status = Status.DRAFT;
    
    private String exportDocxKey;
    private String exportPdfKey;
    private String exportMdKey;
    private ZonedDateTime deletedAt;

    public enum Status { DRAFT, EXPORTED }
}
