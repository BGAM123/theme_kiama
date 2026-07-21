package com.docuai.ai.factory;

import com.docuai.ai.port.AiProviderPort;
import com.docuai.common.exception.AppException;
import com.docuai.common.exception.ErrorCode;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AiProviderFactory {

    private final List<AiProviderPort> providers;

    public AiProviderFactory(List<AiProviderPort> providers) {
        this.providers = providers;
    }

    public AiProviderPort getProvider(String providerName) {
        return providers.stream()
                .filter(p -> p.supports(providerName))
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.AI_PROVIDER_UNAVAILABLE, "No AI provider found for " + providerName));
    }
}
