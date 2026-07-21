package com.docuai.auth.service;

import com.docuai.auth.dto.AuthDto;
import com.docuai.common.audit.AuditService;
import com.docuai.common.exception.AppException;
import com.docuai.core.domain.User;
import com.docuai.core.repository.UserRepository;
import com.docuai.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "accessTokenExpiration", 900L);
    }

    @Test
    void login_Success() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("admin@docuai.com");
        user.setPasswordHash("hashedPassword");
        user.setStatus(User.Status.ACTIVE);
        user.setRoles(new HashSet<>());

        when(userRepository.findAll()).thenReturn(Collections.singletonList(user));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtService.generateAccessToken(any(), any())).thenReturn("access_token");
        when(jwtService.generateRefreshToken(any())).thenReturn("refresh_token");

        AuthDto.LoginRequest request = new AuthDto.LoginRequest("admin@docuai.com", "Password123!");
        AuthDto.TokenResponse response = authService.login(request);

        assertNotNull(response);
        assertNotNull(response.getAccessToken());
    }

    @Test
    void login_InvalidCredentials_ThrowsAppException() {
        when(userRepository.findAll()).thenReturn(Collections.emptyList());

        AuthDto.LoginRequest request = new AuthDto.LoginRequest("unknown@docuai.com", "Password123!");

        assertThrows(AppException.class, () -> authService.login(request));
    }
}
