package com.docuai.extraction.port;

import com.docuai.documenttype.dto.StructureNodeDTO;

import java.io.InputStream;
import java.util.List;

public interface ExtractionPort {
    
    /**
     * Extracts document structure from an input stream.
     */
    List<StructureNodeDTO> extractStructure(InputStream inputStream, String originalFilename);
    
    /**
     * Extracts document structure asynchronously/remotely when inputStream is not available directly
     * but stored remotely.
     */
    List<StructureNodeDTO> extractStructure(String storageKey, String bucketName);
}
