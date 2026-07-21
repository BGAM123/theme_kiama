package com.docuai.common.notification;

import com.docuai.core.domain.Notification;
import com.docuai.core.domain.User;
import com.docuai.core.repository.NotificationRepository;
import com.docuai.core.repository.UserRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.UUID;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Async
    @Transactional
    public void createNotification(UUID userId, String type, String title, String body, String entityType, UUID entityId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return;
        }

        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .title(title)
                .body(body)
                .entityType(entityType)
                .entityId(entityId)
                .isRead(false)
                .createdAt(ZonedDateTime.now())
                .build();
                
        notificationRepository.save(notification);
    }
}
