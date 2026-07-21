package com.docuai.auth.controller;

import com.docuai.auth.dto.AuthDto;
import com.docuai.auth.service.AuthService;
import com.docuai.common.dto.ApiResponse;
import com.docuai.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthDto.TokenResponse>> login(@Valid @RequestBody AuthDto.LoginRequest request) {
        AuthDto.TokenResponse tokenResponse = authService.login(request);
        
        // normally we should fetch the user to generate refresh token, but for simplicity authService handles it or we could do it differently
        // let's assume authService generates access token, but we also need a refresh token cookie
        User user = null; // We can grab user details from SecurityContext or change authService return
        // to simplify, authService generates both but returns TokenResponse. We'll add a helper
        // Let's rewrite login in service to pass refresh token using request context, or we can just fetch it here.
        // Actually since we returned tokenResponse, we just use a helper
        String bearer = "Bearer " + tokenResponse.getAccessToken();
        UUID userId = jwtService.extractUserId(tokenResponse.getAccessToken());
        String refreshToken = jwtService.generateRefreshToken(userId);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authService.buildRefreshTokenCookie(refreshToken))
                .body(ApiResponse.success(tokenResponse));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthDto.TokenResponse>> refresh(@CookieValue(name = "refresh_token", required = false) String refreshToken) {
        AuthDto.TokenResponse tokenResponse = authService.refresh(refreshToken);
        String newRefreshToken = authService.getNewRefreshToken(refreshToken);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authService.buildRefreshTokenCookie(newRefreshToken))
                .body(ApiResponse.success(tokenResponse));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, @CookieValue(name = "refresh_token", required = false) String refreshToken) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        
        String userEmail = "unknown";
        UUID userId = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                userId = jwtService.extractUserId(authHeader.substring(7));
                userEmail = userId.toString(); // simplified
            } catch (Exception e) {}
        }
        
        authService.logout(authHeader, refreshToken, userEmail, userId);
        
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, "refresh_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0")
                .build();
    }
}
import com.docuai.core.domain.User;
