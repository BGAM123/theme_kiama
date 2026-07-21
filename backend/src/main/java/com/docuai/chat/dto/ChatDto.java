package com.docuai.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

public class ChatDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ConversationResponse {
        private UUID id;
        private String title;
        private ZonedDateTime createdAt;
        private List<MessageResponse> messages;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MessageResponse {
        private UUID id;
        private String role; // USER, ASSISTANT, SYSTEM
        private String content;
        private ZonedDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SendMessageRequest {
        private UUID conversationId; // if null, creates new
        private UUID documentTypeId; // required context if new
        private String content;
        private UUID sectionNodeId; // if we want to tie it to a specific document section context
    }
}
