package com.docuai.common.audit;

import com.docuai.core.domain.AuditLog;
import com.docuai.core.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.MDC;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.ZonedDateTime;
import java.util.UUID;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Async
    @Transactional
    public void log(UUID userId, String userEmail, String action, String entityType, UUID entityId, String entityLabel, String detail) {
        try {
            String ipAddress = null;
            String userAgent = null;
            
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                ipAddress = request.getRemoteAddr();
                userAgent = request.getHeader("User-Agent");
            }
            
            String traceId = MDC.get("traceId");

            AuditLog log = AuditLog.builder()
                    .userId(userId)
                    .userEmail(userEmail)
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .entityLabel(entityLabel)
                    .detail(detail)
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .traceId(traceId)
                    .createdAt(ZonedDateTime.now())
                    .build();

            auditLogRepository.save(log);
        } catch (Exception e) {
            // Silently catch exceptions to prevent breaking the main transaction
        }
    }
}
