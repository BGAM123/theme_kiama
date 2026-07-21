package com.docuai.extraction.adapter;

import com.docuai.documenttype.dto.StructureNodeDTO;
import com.docuai.extraction.port.ExtractionPort;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
@ConditionalOnProperty(name = "extraction.use-mock", havingValue = "true")
public class MockExtractionAdapter implements ExtractionPort {

    @Override
    public List<StructureNodeDTO> extractStructure(InputStream inputStream, String originalFilename) {
        return generateMockStructure();
    }

    @Override
    public List<StructureNodeDTO> extractStructure(String storageKey, String bucketName) {
        return generateMockStructure();
    }

    private List<StructureNodeDTO> generateMockStructure() {
        List<StructureNodeDTO> nodes = new ArrayList<>();
        int order = 1;
        nodes.add(createNode("COVER", "Page de garde mockée", order++, true));
        nodes.add(createNode("H1", "1. Contexte du document", order++, true));
        nodes.add(createNode("H1", "2. Analyse détaillée", order++, true));
        nodes.add(createNode("SIGNATURE", "Zone de signature globale", order, true));
        return nodes;
    }

    private StructureNodeDTO createNode(String type, String label, int order, boolean required) {
        return StructureNodeDTO.builder()
                .id(UUID.randomUUID())
                .type(type)
                .label(label)
                .order(order)
                .required(required)
                .children(new ArrayList<>())
                .build();
    }
}
