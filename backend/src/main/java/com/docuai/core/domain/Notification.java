package com.docuai.core.domain;
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
