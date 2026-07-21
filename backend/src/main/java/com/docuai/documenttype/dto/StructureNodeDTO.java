package com.docuai.documenttype.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StructureNodeDTO {
    private UUID id;
    private String type; // COVER, TOC, H1, H2, H3, H4, TABLE, LIST, SIGNATURE, FIELD
    private String label;
    private Integer order;
    private Boolean required;
    private List<StructureNodeDTO> children = new ArrayList<>();
}
