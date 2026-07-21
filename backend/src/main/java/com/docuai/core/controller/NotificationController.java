package com.docuai.core.controller;

import com.docuai.common.dto.ApiResponse;
import com.docuai.core.domain.Notification;
import com.docuai.core.repository.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getMyNotifications(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        List<Notification> notifs = notificationRepository.findAll().stream()
                .filter(n -> n.getUser().getId().equals(userId))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(20)
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(ApiResponse.success(notifs));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable UUID id, Authentication authentication) {
        notificationRepository.findById(id).ifPresent(n -> {
            if (n.getUser().getId().equals(UUID.fromString(authentication.getName()))) {
                n.setIsRead(true);
                notificationRepository.save(n);
            }
        });
        return ResponseEntity.ok().build();
    }
}
