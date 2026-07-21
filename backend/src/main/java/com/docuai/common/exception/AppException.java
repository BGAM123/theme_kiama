package com.docuai.common.exception;

import lombok.Getter;

@Getter
public class AppException extends RuntimeException {
    
    private final ErrorCode errorCode;
    private final String message;
    private final Object details;

    public AppException(ErrorCode errorCode) {
        super(errorCode.name());
        this.errorCode = errorCode;
        this.message = errorCode.name();
        this.details = null;
    }

    public AppException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
        this.message = message;
        this.details = null;
    }
    
    public AppException(ErrorCode errorCode, String message, Object details) {
        super(message);
        this.errorCode = errorCode;
        this.message = message;
        this.details = details;
    }

    public AppException(ErrorCode errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.message = message;
        this.details = null;
    }
}
