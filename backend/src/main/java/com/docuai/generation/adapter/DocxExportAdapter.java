package com.docuai.generation.adapter;

import com.docuai.generation.port.DocumentExportPort;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.util.Map;

@Component
public class DocxExportAdapter implements DocumentExportPort {

    @Override
    public boolean supports(String format) {
        return "DOCX".equalsIgnoreCase(format);
    }

    @Override
    public byte[] exportDocument(Map<String, String> sectionContents) {
        try (XWPFDocument document = new XWPFDocument();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
             
            for (Map.Entry<String, String> entry : sectionContents.entrySet()) {
                XWPFParagraph title = document.createParagraph();
                title.createRun().setText(entry.getKey()); // Simplified header
                
                String[] lines = entry.getValue().split("\n");
                for (String line : lines) {
                    XWPFParagraph paragraph = document.createParagraph();
                    paragraph.createRun().setText(line);
                }
            }
            document.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur de génération DOCX", e);
        }
    }
}
