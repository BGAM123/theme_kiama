package com.docuai.user.service;

import com.docuai.common.audit.AuditService;
import com.docuai.common.exception.AppException;
import com.docuai.core.domain.User;
import com.docuai.core.repository.RoleRepository;
import com.docuai.core.repository.UserRepository;
import com.docuai.user.dto.UserDto;
import com.docuai.user.mapper.UserMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private UserService userService;

    @Test
    void getUser_Success() {
        UUID userId = UUID.randomUUID();
        User user = new User();
        user.setId(userId);

        UserDto.Response responseDto = new UserDto.Response();
        responseDto.setId(userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userMapper.toDto(user)).thenReturn(responseDto);

        UserDto.Response result = userService.getUser(userId);

        assertEquals(userId, result.getId());
    }

    @Test
    void getUser_NotFound_ThrowsException() {
        UUID userId = UUID.randomUUID();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(AppException.class, () -> userService.getUser(userId));
    }
}
