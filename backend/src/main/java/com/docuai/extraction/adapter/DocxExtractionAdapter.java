package com.docuai.extraction.adapter;

import com.docuai.documenttype.dto.StructureNodeDTO;
import com.docuai.extraction.port.ExtractionPort;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
public class DocxExtractionAdapter implements ExtractionPort {

    @Override
    public List<StructureNodeDTO> extractStructure(InputStream inputStream, String originalFilename) {
        List<StructureNodeDTO> nodes = new ArrayList<>();
        try (XWPFDocument document = new XWPFDocument(inputStream)) {
            int order = 1;

            // Simplified extraction logic: add Cover Page by default
            nodes.add(createNode("COVER", "Page de garde", order++, true));

            for (XWPFParagraph paragraph : document.getParagraphs()) {
                String style = paragraph.getStyle();
                String text = paragraph.getText().trim();
                
                if (text.isEmpty()) continue;

                if ("Heading1".equalsIgnoreCase(style) || "titre1".equalsIgnoreCase(style)) {
                    nodes.add(createNode("H1", text, order++, true));
                } else if ("Heading2".equalsIgnoreCase(style) || "titre2".equalsIgnoreCase(style)) {
                    nodes.add(createNode("H2", text, order++, false));
                }
            }
            
            // Tables mock
            if (!document.getTables().isEmpty()) {
                nodes.add(createNode("TABLE", "Tableau(x) extrait(s)", order++, false));
            }

            nodes.add(createNode("SIGNATURE", "Zone de signature", order, true));

        } catch (Exception e) {
            throw new RuntimeException("Failed to extract DOCX structure", e);
        }
        return nodes;
    }

    @Override
    public List<StructureNodeDTO> extractStructure(String storageKey, String bucketName) {
        throw new UnsupportedOperationException("DocxExtractionAdapter requires local InputStream");
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
