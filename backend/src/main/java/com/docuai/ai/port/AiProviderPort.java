package com.docuai.ai.port;

import com.docuai.core.domain.AiModelConfig;
import reactor.core.publisher.Flux;

public interface AiProviderPort {
    
    /**
     * Checks if this provider handles the requested provider name configuration
     */
    boolean supports(String providerName);
    
    /**
     * Generates a section utilizing Virtual Threads internally or non-blocking WebClient (handled by Spring AI)
     * Returns a Flux that emits tokens for Server-Sent Events (SSE)
     */
    Flux<String> generateSection(String systemPrompt, String userPrompt, AiModelConfig config);
}
