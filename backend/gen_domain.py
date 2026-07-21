import os

base_dir = r"C:\Users\LENOVO\.gemini\antigravity\scratch\backend\src\main\java\com\docuai\core\domain"
repo_dir = r"C:\Users\LENOVO\.gemini\antigravity\scratch\backend\src\main\java\com\docuai\core\repository"

os.makedirs(base_dir, exist_ok=True)
os.makedirs(repo_dir, exist_ok=True)

entities = {
    "BaseEntity": """package com.docuai.core.domain;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.ZonedDateTime;
import java.util.UUID;

@MappedSuperclass
@Getter @Setter
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private ZonedDateTime createdAt;
    
    @LastModifiedDate
    @Column(nullable = false)
    private ZonedDateTime updatedAt;
}
""",

    "User": """package com.docuai.core.domain;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@SQLDelete(sql = "UPDATE users SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class User extends BaseEntity {
    private String firstName;
    private String lastName;
    private String email;
    private String passwordHash;
    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;
    private ZonedDateTime lastLoginAt;
    private ZonedDateTime deletedAt;
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    public enum Status { ACTIVE, INACTIVE }
}
""",

    "Role": """package com.docuai.core.domain;
import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "roles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Role extends BaseEntity {
    private String name;
    private String label;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "role_permissions", joinColumns = @JoinColumn(name = "role_id"), inverseJoinColumns = @JoinColumn(name = "permission_id"))
    private Set<Permission> permissions = new HashSet<>();
}
""",

    "Permission": """package com.docuai.core.domain;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "permissions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String name;
    private String label;
}
""",

    "DocumentType": """package com.docuai.core.domain;
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
""",

    "Category": """package com.docuai.core.domain;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import java.time.ZonedDateTime;

@Entity
@Table(name = "categories")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@SQLDelete(sql = "UPDATE categories SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class Category extends BaseEntity {
    private String name;
    private ZonedDateTime deletedAt;
}
""",

    "DocumentStructure": """package com.docuai.core.domain;
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
""",

    "ExtractionJob": """package com.docuai.core.domain;
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
""",

    "AiModelConfig": """package com.docuai.core.domain;
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
    private Double temperature = 0.70;
    private Long totalRequests = 0L;
    private Long totalTokensUsed = 0L;
    private Integer avgResponseMs = 0;
    private Double costPer1kTokens = 0.0;

    public enum Status { ACTIVE, INACTIVE }
}
""",

    "Conversation": """package com.docuai.core.domain;
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
""",

    "Message": """package com.docuai.core.domain;
import jakarta.persistence.*;
import lombok.*;
import java.time.ZonedDateTime;
import java.util.UUID;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "messages")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@EntityListeners(AuditingEntityListener.class)
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id")
    private Conversation conversation;
    
    private String role;
    private String content;
    private Boolean isComplete = false;
    private Integer conformityScore;
    
    @Column(name = "generated_document_id")
    private UUID generatedDocumentId;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private ZonedDateTime createdAt;
}
""",

    "GeneratedDocument": """package com.docuai.core.domain;
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
""",

    "ReferenceDocument": """package com.docuai.core.domain;
import jakarta.persistence.*;
import lombok.*;
import java.time.ZonedDateTime;
import java.util.UUID;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "reference_documents")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@EntityListeners(AuditingEntityListener.class)
public class ReferenceDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id")
    private Conversation conversation;
    
    private String originalName;
    private String storageKey;
    private String mimeType;
    private Long fileSize;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private ZonedDateTime createdAt;
}
""",

    "AuditLog": """package com.docuai.core.domain;
import jakarta.persistence.*;
import lombok.*;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private UUID userId;
    private String userEmail;
    private String action;
    private String entityType;
    private UUID entityId;
    private String entityLabel;
    private String detail;
    private String ipAddress;
    private String userAgent;
    private String traceId;
    
    @Column(nullable = false, updatable = false)
    private ZonedDateTime createdAt;
}
""",

    "Notification": """package com.docuai.core.domain;
import jakarta.persistence.*;
import lombok.*;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "notifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    private String type;
    private String title;
    private String body;
    private String entityType;
    private UUID entityId;
    private Boolean isRead = false;
    private ZonedDateTime readAt;
    @Column(nullable = false, updatable = false)
    private ZonedDateTime createdAt;
}
"""
}

repos = {
    "UserRepository": "User",
    "RoleRepository": "Role",
    "PermissionRepository": "Permission",
    "DocumentTypeRepository": "DocumentType",
    "CategoryRepository": "Category",
    "DocumentStructureRepository": "DocumentStructure",
    "ExtractionJobRepository": "ExtractionJob",
    "AiModelConfigRepository": "AiModelConfig",
    "ConversationRepository": "Conversation",
    "MessageRepository": "Message",
    "GeneratedDocumentRepository": "GeneratedDocument",
    "ReferenceDocumentRepository": "ReferenceDocument",
    "AuditLogRepository": "AuditLog",
    "NotificationRepository": "Notification"
}

for name, content in entities.items():
    with open(os.path.join(base_dir, f"{name}.java"), "w") as f:
        f.write(content)

for repo, entity in repos.items():
    content = f"""package com.docuai.core.repository;
import com.docuai.core.domain.{entity};
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface {repo} extends JpaRepository<{entity}, UUID> {{
}}
"""
    with open(os.path.join(repo_dir, f"{repo}.java"), "w") as f:
        f.write(content)
