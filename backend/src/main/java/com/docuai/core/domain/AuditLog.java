package com.docuai.core.domain;
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
