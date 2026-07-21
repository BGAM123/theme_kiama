package com.docuai.core.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class DashboardDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StatsResponse {
        private long totalUsers;
        private long activeUsers;
        private long totalDocumentTypes;
        private long documentsGenerated;
        private long failedExtractions;
    }
}
