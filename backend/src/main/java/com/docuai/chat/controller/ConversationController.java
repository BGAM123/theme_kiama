package com.docuai.chat.controller;

import com.docuai.chat.dto.ChatDto;
import com.docuai.chat.service.ConversationService;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/chat")
public class ConversationController {

    private final ConversationService conversationService;

    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> sendMessageStream(@RequestBody ChatDto.SendMessageRequest request, Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        return conversationService.processMessageStream(request, userId);
    }
}
