package com.docuai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.Executor;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class JpaConfig {

    @Bean
    public AuditorAware<UUID> auditorProvider() {
        return () -> {
            // TODO: Extract UUID from SecurityContext via SecurityContextHolder
            // return Optional.of(userId);
            return Optional.empty();
        };
    }

    @Bean(name = "virtualThreadExecutor")
    public Executor virtualThreadExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        // Configuration for Virtual Threads
        // ThreadPoolTaskExecutor supports virtual threads since Spring Framework 6.1
        // (Spring Boot 3.2+)
        executor.setVirtualThreads(true);
        executor.initialize();
        return executor;
    }
}
