package com.docuai.chat.service;

import com.docuai.ai.factory.AiProviderFactory;
import com.docuai.ai.port.AiProviderPort;
import com.docuai.chat.dto.ChatDto;
import com.docuai.common.exception.AppException;
import com.docuai.common.exception.ErrorCode;
import com.docuai.core.domain.*;
import com.docuai.core.repository.AiModelConfigRepository;
import com.docuai.core.repository.ConversationRepository;
import com.docuai.core.repository.DocumentTypeRepository;
import com.docuai.core.repository.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final DocumentTypeRepository documentTypeRepository;
    private final AiModelConfigRepository aiModelConfigRepository;
    private final AiProviderFactory aiProviderFactory;

    public ConversationService(ConversationRepository conversationRepository, MessageRepository messageRepository, DocumentTypeRepository documentTypeRepository, AiModelConfigRepository aiModelConfigRepository, AiProviderFactory aiProviderFactory) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.documentTypeRepository = documentTypeRepository;
        this.aiModelConfigRepository = aiModelConfigRepository;
        this.aiProviderFactory = aiProviderFactory;
    }

    @Transactional
    public Flux<String> processMessageStream(ChatDto.SendMessageRequest request, UUID userId) {
        Conversation conversation = null;
        if (request.getConversationId() != null) {
            conversation = conversationRepository.findById(request.getConversationId())
                    .orElseThrow(() -> new AppException(ErrorCode.CONVERSATION_NOT_FOUND, "Convo not found"));
        } else {
            DocumentType docType = documentTypeRepository.findById(request.getDocumentTypeId())
                    .orElseThrow(() -> new AppException(ErrorCode.DOCUMENT_TYPE_NOT_FOUND, "Doc type not found"));
                    
            conversation = Conversation.builder()
                    .userId(userId)
                    .documentType(docType)
                    .title("Génération - " + docType.getName())
                    .createdAt(ZonedDateTime.now())
                    .build();
            conversation = conversationRepository.save(conversation);
        }

        // Save User Message
        Message userMsg = Message.builder()
                .conversation(conversation)
                .role("USER")
                .content(request.getContent())
                .createdAt(ZonedDateTime.now())
                .build();
        messageRepository.save(userMsg);

        // Fetch AI Config
        AiModelConfig config = aiModelConfigRepository.findAll().stream().filter(AiModelConfig::getIsDefault).findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.AI_CONFIG_NOT_FOUND, "No default AI config"));

        AiProviderPort aiProvider = aiProviderFactory.getProvider(config.getProvider());
        
        // Pseudo stringbuilder for final save
        final Conversation finalConv = conversation;
        StringBuilder assistantResponse = new StringBuilder();

        // System prompt and context based on RAG would go here. Simplified for now.
        String systemPrompt = "Tu es un assistant de création de documents. Réponds de manière professionnelle aux directives.";

        return aiProvider.generateSection(systemPrompt, request.getContent(), config)
                .map(chunk -> {
                    assistantResponse.append(chunk);
                    return chunk;
                })
                .doOnComplete(() -> {
                    saveAssistantMessage(finalConv, assistantResponse.toString());
                });
    }

    @Transactional // requires new transaction for doOnComplete stream execution if needed, ignored for pseudo code.
    protected void saveAssistantMessage(Conversation conversation, String content) {
        Message assistantMsg = Message.builder()
                .conversation(conversation)
                .role("ASSISTANT")
                .content(content)
                .createdAt(ZonedDateTime.now())
                .build();
        messageRepository.save(assistantMsg);
    }
}
