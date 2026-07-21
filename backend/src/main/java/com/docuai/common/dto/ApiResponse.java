package com.docuai.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse<T> {
    
    private T data;
    private ErrorDetails error;
    private MetaDetails meta;

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder().data(data).build();
    }

    public static <T> ApiResponse<T> paginated(T data, int page, int size, long totalElements, int totalPages) {
        return ApiResponse.<T>builder()
                .data(data)
                .meta(new MetaDetails(page, size, totalElements, totalPages))
                .build();
    }

    public static <T> ApiResponse<T> error(String code, String message) {
        return ApiResponse.<T>builder()
                .error(new ErrorDetails(code, message, null))
                .build();
    }

    public static <T> ApiResponse<T> error(String code, String message, Object fieldErrors) {
        return ApiResponse.<T>builder()
                .error(new ErrorDetails(code, message, fieldErrors))
                .build();
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ErrorDetails {
        private String code;
        private String message;
        private Object fieldErrors;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MetaDetails {
        private int page;
        private int size;
        private long totalElements;
        private int totalPages;
    }
}
