package com.docuai.common.exception;

import com.docuai.common.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<Void>> handleAppException(AppException ex) {
        HttpStatus status = determineHttpStatus(ex.getErrorCode());
        ApiResponse<Void> response = ApiResponse.error(ex.getErrorCode().name(), ex.getMessage(), ex.getDetails());
        return new ResponseEntity<>(response, status);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }
        ApiResponse<Void> response = ApiResponse.error(ErrorCode.VALIDATION_ERROR.name(), "Validation failed", fieldErrors);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException ex) {
        ApiResponse<Void> response = ApiResponse.error(ErrorCode.AUTH_INSUFFICIENT_PERMISSIONS.name(), "Access Denied");
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthentication(AuthenticationException ex) {
        ApiResponse<Void> response = ApiResponse.error(ErrorCode.AUTH_INVALID_CREDENTIALS.name(), "Authentication Failed");
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex) {
        ApiResponse<Void> response = ApiResponse.error(ErrorCode.INTERNAL_ERROR.name(), "An unexpected error occurred");
        // Log the exception securely here
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private HttpStatus determineHttpStatus(ErrorCode errorCode) {
        switch (errorCode) {
            case AUTH_INVALID_CREDENTIALS:
            case AUTH_TOKEN_EXPIRED:
            case AUTH_TOKEN_REVOKED:
                return HttpStatus.UNAUTHORIZED;
            case AUTH_INSUFFICIENT_PERMISSIONS:
                return HttpStatus.FORBIDDEN;
            case DOCUMENT_TYPE_NOT_FOUND:
            case EXTRACTION_JOB_NOT_FOUND:
            case CONVERSATION_NOT_FOUND:
            case MESSAGE_NOT_FOUND:
            case GENERATED_DOCUMENT_NOT_FOUND:
            case AI_CONFIG_NOT_FOUND:
            case USER_NOT_FOUND:
            case CATEGORY_NOT_FOUND:
                return HttpStatus.NOT_FOUND;
            case VALIDATION_ERROR:
                return HttpStatus.BAD_REQUEST;
            case USER_EMAIL_DUPLICATE:
            case CATEGORY_REFERENCED:
            case DOCUMENT_TYPE_REFERENCED:
            case AI_CONFIG_IS_DEFAULT:
                return HttpStatus.CONFLICT;
            case FILE_TOO_LARGE:
                return HttpStatus.PAYLOAD_TOO_LARGE;
            case FILE_TYPE_NOT_SUPPORTED:
                return HttpStatus.UNSUPPORTED_MEDIA_TYPE;
            default:
                return HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
}
