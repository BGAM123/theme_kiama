package com.docuai.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.UUID;

public class AdminUserDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private UUID id;
        private String firstName;
        private String lastName;
        private String email;
        private String role; // Simplified for frontend: "ADMIN" or "USER"
        private String status; // "ACTIVE" or "INACTIVE"
        private ZonedDateTime lastLoginAt;
        private ZonedDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        private String firstName;
        private String lastName;
        private String email;
        private String role; // "ADMIN" or "USER"
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateRequest {
        private String firstName;
        private String lastName;
        private String role; // "ADMIN" or "USER"
    }
}
