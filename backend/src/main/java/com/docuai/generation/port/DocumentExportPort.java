package com.docuai.generation.port;

import java.util.Map;

public interface DocumentExportPort {

    boolean supports(String format);

    /**
     * Generates a file from sections and structure, returns byte[] representing the file.
     */
    byte[] exportDocument(Map<String, String> sectionContents);
}
