package com.docuai.core.domain;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import java.time.ZonedDateTime;

@Entity
@Table(name = "conversations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@SQLDelete(sql = "UPDATE conversations SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class Conversation extends BaseEntity {
    private String title;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_type_id")
    private DocumentType documentType;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ai_model_config_id")
    private AiModelConfig aiModelConfig;
    
    private String language = "fr";
    private String tone = "FORMAL";
    private String targetLength = "MEDIUM";
    
    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;
    private ZonedDateTime deletedAt;

    public enum Status { ACTIVE, ARCHIVED }
}
