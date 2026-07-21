package com.docuai.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

public class UserDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private UUID id;
        private String firstName;
        private String lastName;
        private String email;
        private List<RoleDto> roles;
        private List<String> permissions;
        private String status;
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
        private List<UUID> roleIds;
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateRequest {
        private String firstName;
        private String lastName;
        private List<UUID> roleIds;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RoleDto {
        private UUID id;
        private String name;
        private String label;
    }
}
