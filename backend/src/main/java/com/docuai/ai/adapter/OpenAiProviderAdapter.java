package com.docuai.ai.adapter;

import com.docuai.ai.port.AiProviderPort;
import com.docuai.core.domain.AiModelConfig;
import com.docuai.security.AesEncryptionService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.SystemPromptTemplate;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

import java.util.List;

@Component
public class OpenAiProviderAdapter implements AiProviderPort {

    private final AesEncryptionService encryptionService;

    public OpenAiProviderAdapter(AesEncryptionService encryptionService) {
        this.encryptionService = encryptionService;
    }

    @Override
    public boolean supports(String providerName) {
        return "OPENAI".equalsIgnoreCase(providerName);
    }

    @Override
    @Retry(name = "ai-call")
    @CircuitBreaker(name = "ai-call")
    @TimeLimiter(name = "ai-call")
    public Flux<String> generateSection(String systemPrompt, String userPrompt, AiModelConfig config) {
        String apiKey = encryptionService.decrypt(config.getApiKeyEncrypted());
        
        OpenAiApi openAiApi = new OpenAiApi(apiKey);
        OpenAiChatOptions options = OpenAiChatOptions.builder()
                .withModel(config.getModelName())
                .withTemperature(config.getTemperature() != null ? config.getTemperature().floatValue() : 0.7f)
                .withMaxTokens(config.getMaxTokens())
                .build();
                
        OpenAiChatModel chatModel = new OpenAiChatModel(openAiApi, options);
        
        SystemPromptTemplate systemPromptTemplate = new SystemPromptTemplate(systemPrompt);
        Prompt prompt = new Prompt(List.of(
            systemPromptTemplate.createMessage(),
            new UserMessage(userPrompt)
        ));

        return chatModel.stream(prompt)
                .map(response -> response.getResult().getOutput().getContent())
                .filter(content -> content != null && !content.isEmpty());
    }
}
