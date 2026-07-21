package com.docuai.auth.service;

import com.docuai.auth.dto.AuthDto;
import com.docuai.common.audit.AuditService;
import com.docuai.common.exception.AppException;
import com.docuai.common.exception.ErrorCode;
import com.docuai.core.domain.User;
import com.docuai.core.repository.UserRepository;
import com.docuai.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuditService auditService;

    @Value("${security.jwt.access-token-expiration-seconds}")
    private long accessTokenExpiration;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuditService auditService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.auditService = auditService;
    }

    @Transactional
    public AuthDto.TokenResponse login(AuthDto.LoginRequest request) {
        User user = userRepository.findAll().stream().filter(u -> u.getEmail().equals(request.getEmail())).findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.AUTH_INVALID_CREDENTIALS, "Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AppException(ErrorCode.AUTH_INVALID_CREDENTIALS, "Invalid credentials");
        }

        if (user.getStatus() != User.Status.ACTIVE) {
            throw new AppException(ErrorCode.AUTH_INVALID_CREDENTIALS, "User account is inactive");
        }

        user.setLastLoginAt(ZonedDateTime.now());
        userRepository.save(user);

        List<String> permissions = user.getRoles().stream()
                .flatMap(role -> role.getPermissions().stream())
                .map(p -> p.getName())
                .collect(Collectors.toList());

        String accessToken = jwtService.generateAccessToken(user.getId(), permissions);
        String refreshToken = jwtService.generateRefreshToken(user.getId());

        auditService.log(user.getId(), user.getEmail(), "LOGIN", "User", user.getId(), user.getEmail(), "Login successful");

        return new AuthDto.TokenResponse(accessToken, accessTokenExpiration);
    }
    
    public String buildRefreshTokenCookie(String refreshToken) {
        return "refresh_token=" + refreshToken + "; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800";
    }

    @Transactional
    public AuthDto.TokenResponse refresh(String refreshToken) {
        if (refreshToken == null || !jwtService.isTokenValid(refreshToken)) {
            throw new AppException(ErrorCode.AUTH_TOKEN_EXPIRED, "Invalid or expired refresh token");
        }

        var userId = jwtService.extractUserId(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.AUTH_TOKEN_REVOKED, "User not found"));

        if (user.getStatus() != User.Status.ACTIVE) {
            throw new AppException(ErrorCode.AUTH_TOKEN_REVOKED, "User account is inactive");
        }

        // Invalidate old refresh token
        jwtService.blacklistToken(refreshToken);

        List<String> permissions = user.getRoles().stream()
                .flatMap(role -> role.getPermissions().stream())
                .map(p -> p.getName())
                .collect(Collectors.toList());

        String newAccessToken = jwtService.generateAccessToken(user.getId(), permissions);
        String newRefreshToken = jwtService.generateRefreshToken(user.getId()); // Generated, returned via cookie normally in controller

        return new AuthDto.TokenResponse(newAccessToken, accessTokenExpiration);
    }
    
    public String getNewRefreshToken(String oldRefreshToken) {
         var userId = jwtService.extractUserId(oldRefreshToken);
         return jwtService.generateRefreshToken(userId);
    }

    public void logout(String accessToken, String refreshToken, String userEmail, java.util.UUID userId) {
        if (accessToken != null && accessToken.startsWith("Bearer ")) {
            jwtService.blacklistToken(accessToken.substring(7));
        }
        if (refreshToken != null) {
            jwtService.blacklistToken(refreshToken);
        }
        auditService.log(userId, userEmail, "LOGOUT", "User", userId, userEmail, "Logout successful");
    }
}
