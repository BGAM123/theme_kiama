package com.docuai.extraction.adapter;

import com.docuai.documenttype.dto.StructureNodeDTO;
import com.docuai.extraction.port.ExtractionPort;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

@Component("remoteExtractionPort")
@ConditionalOnProperty(name = "extraction.use-mock", havingValue = "false", matchIfMissing = true)
public class HttpExtractionAdapter implements ExtractionPort {

    private final RestClient restClient;

    public HttpExtractionAdapter(@Value("${extraction.service-url}") String serviceUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(serviceUrl)
                .build();
    }

    @Override
    public List<StructureNodeDTO> extractStructure(InputStream inputStream, String originalFilename) {
        throw new UnsupportedOperationException("HttpExtractionAdapter uses MinIO directly via storageKey");
    }

    @Override
    public List<StructureNodeDTO> extractStructure(String storageKey, String bucketName) {
        return restClient.post()
                .uri("/extract")
                .body(Map.of("storageKey", storageKey, "bucket", bucketName))
                .retrieve()
                .body(new ParameterizedTypeReference<List<StructureNodeDTO>>() {});
    }
}
