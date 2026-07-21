package com.docuai.ai.adapter;

import com.docuai.ai.port.AiProviderPort;
import com.docuai.core.domain.AiModelConfig;
import com.docuai.security.AesEncryptionService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

@Component
public class AnthropicProviderAdapter implements AiProviderPort {

    private final AesEncryptionService encryptionService;

    public AnthropicProviderAdapter(AesEncryptionService encryptionService) {
        this.encryptionService = encryptionService;
    }

    @Override
    public boolean supports(String providerName) {
        return "ANTHROPIC".equalsIgnoreCase(providerName);
    }

    @Override
    @Retry(name = "ai-call")
    @CircuitBreaker(name = "ai-call")
    @TimeLimiter(name = "ai-call")
    public Flux<String> generateSection(String systemPrompt, String userPrompt, AiModelConfig config) {
        // Pseudo-code implementation mimicking the OpenAI paradigm but utilizing Spring AI Anthropic features
        // Because of brevity, simplified:
        return Flux.just("Contenu Anthropic généré pour : ", userPrompt); 
    }
}
