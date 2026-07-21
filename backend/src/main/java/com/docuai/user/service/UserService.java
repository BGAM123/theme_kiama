package com.docuai.user.service;

import com.docuai.common.audit.AuditService;
import com.docuai.common.exception.AppException;
import com.docuai.common.exception.ErrorCode;
import com.docuai.core.domain.Role;
import com.docuai.core.domain.User;
import com.docuai.core.repository.RoleRepository;
import com.docuai.core.repository.UserRepository;
import com.docuai.user.dto.UserDto;
import com.docuai.user.mapper.UserMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, UserMapper userMapper, PasswordEncoder passwordEncoder, AuditService auditService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public Page<UserDto.Response> listUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::toDto);
    }

    @Transactional(readOnly = true)
    public UserDto.Response getUser(UUID id) {
        return userRepository.findById(id)
                .map(userMapper::toDto)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND, "User not found"));
    }

    @Transactional
    public UserDto.Response createUser(UserDto.CreateRequest request, UUID adminId, String adminEmail) {
        boolean exists = userRepository.findAll().stream().anyMatch(u -> u.getEmail().equals(request.getEmail()));
        if (exists) {
            throw new AppException(ErrorCode.USER_EMAIL_DUPLICATE, "Email already in use");
        }

        String rawPassword = request.getPassword() != null ? request.getPassword() : UUID.randomUUID().toString();
        
        Set<Role> roles = new HashSet<>();
        if (request.getRoleIds() != null) {
            roles.addAll(roleRepository.findAllById(request.getRoleIds()));
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(rawPassword))
                .status(User.Status.ACTIVE)
                .roles(roles)
                .build();

        user = userRepository.save(user);
        auditService.log(adminId, adminEmail, "USER_CREATE", "User", user.getId(), user.getEmail(), "Created user");

        return userMapper.toDto(user);
    }

    @Transactional
    public UserDto.Response updateUser(UUID id, UserDto.UpdateRequest request, UUID adminId, String adminEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND, "User not found"));

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        
        if (request.getRoleIds() != null) {
            Set<Role> roles = new HashSet<>(roleRepository.findAllById(request.getRoleIds()));
            user.setRoles(roles);
        }

        user = userRepository.save(user);
        return userMapper.toDto(user);
    }

    @Transactional
    public void deleteUser(UUID id, UUID adminId, String adminEmail) {
        if (!userRepository.existsById(id)) {
            throw new AppException(ErrorCode.USER_NOT_FOUND, "User not found");
        }
        userRepository.deleteById(id);
    }

    @Transactional
    public UserDto.Response setStatus(UUID id, boolean active, UUID adminId, String adminEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND, "User not found"));

        user.setStatus(active ? User.Status.ACTIVE : User.Status.INACTIVE);
        user = userRepository.save(user);
        
        auditService.log(adminId, adminEmail, active ? "USER_ACTIVATE" : "USER_DEACTIVATE", "User", user.getId(), user.getEmail(), "Status changed");
        
        // TODO: Invalidate tokens if deactivated
        return userMapper.toDto(user);
    }
}
