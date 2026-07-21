package com.docuai.ai.adapter;

import com.docuai.ai.port.AiProviderPort;
import com.docuai.core.domain.AiModelConfig;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

@Component
public class MockAiProviderAdapter implements AiProviderPort {

    @Override
    public boolean supports(String providerName) {
        // Match generic ones not explicitly implemented right now like Mistral, Ollama, Google, DeepSeek
        return "MISTRAL".equalsIgnoreCase(providerName) || "OLLAMA".equalsIgnoreCase(providerName) 
            || "GOOGLE".equalsIgnoreCase(providerName) || "DEEPSEEK".equalsIgnoreCase(providerName);
    }

    @Override
    public Flux<String> generateSection(String systemPrompt, String userPrompt, AiModelConfig config) {
        String chunk1 = "Voici le contenu mocké pour " + config.getProvider() + ". ";
        String chunk2 = "Cette section a été générée via l'adaptateur Mock. ";
        return Flux.just(chunk1, chunk2);
    }
}
