package com.docuai.user.service;

import com.docuai.common.audit.AuditService;
import com.docuai.common.exception.AppException;
import com.docuai.common.exception.ErrorCode;
import com.docuai.core.domain.Role;
import com.docuai.core.domain.User;
import com.docuai.core.repository.RoleRepository;
import com.docuai.core.repository.UserRepository;
import com.docuai.user.dto.AdminUserDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    public AdminUserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, AuditService auditService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public Page<AdminUserDto.Response> listUsers(Pageable pageable, String search) {
        Page<User> userPage;
        
        if (search != null && !search.trim().isEmpty()) {
            String searchTerm = search.trim().toLowerCase();
            userPage = userRepository.findAllByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                    searchTerm, searchTerm, searchTerm, pageable);
        } else {
            userPage = userRepository.findAll(pageable);
        }
        
        return userPage.map(this::toAdminUserDto);
    }

    @Transactional(readOnly = true)
    public AdminUserDto.Response getUser(UUID id) {
        return userRepository.findById(id)
                .map(this::toAdminUserDto)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND, "User not found"));
    }

    @Transactional
    public AdminUserDto.Response createUser(AdminUserDto.CreateRequest request, UUID adminId, String adminEmail) {
        // Check if email already exists
        boolean exists = userRepository.findAll().stream().anyMatch(u -> u.getEmail().equalsIgnoreCase(request.getEmail()));
        if (exists) {
            throw new AppException(ErrorCode.USER_EMAIL_DUPLICATE, "Email already in use");
        }

        // Find role by name
        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND, "Role not found: " + request.getRole()));

        // Generate password if not provided
        String rawPassword = request.getPassword() != null ? request.getPassword() : UUID.randomUUID().toString();

        // Create user
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(rawPassword))
                .status(User.Status.ACTIVE)
                .roles(Set.of(role))
                .build();

        user = userRepository.save(user);
        
        // Log audit
        auditService.log(adminId, adminEmail, "USER_CREATE", "User", user.getId(), user.getEmail(), "Created user via admin panel");

        return toAdminUserDto(user);
    }

    @Transactional
    public AdminUserDto.Response updateUser(UUID id, AdminUserDto.UpdateRequest request, UUID adminId, String adminEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND, "User not found"));

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getRole() != null) {
            Role role = roleRepository.findByName(request.getRole())
                    .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND, "Role not found: " + request.getRole()));
            user.setRoles(Set.of(role));
        }

        user = userRepository.save(user);
        
        // Log audit
        auditService.log(adminId, adminEmail, "USER_UPDATE", "User", user.getId(), user.getEmail(), "Updated user via admin panel");

        return toAdminUserDto(user);
    }

    @Transactional
    public AdminUserDto.Response setStatus(UUID id, boolean active, UUID adminId, String adminEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND, "User not found"));

        user.setStatus(active ? User.Status.ACTIVE : User.Status.INACTIVE);
        user = userRepository.save(user);
        
        // Log audit
        auditService.log(adminId, adminEmail, active ? "USER_ACTIVATE" : "USER_DEACTIVATE", "User", user.getId(), user.getEmail(), "Status changed via admin panel");

        return toAdminUserDto(user);
    }

    @Transactional
    public void deleteUser(UUID id, UUID adminId, String adminEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND, "User not found"));
        
        // Log audit before deletion
        auditService.log(adminId, adminEmail, "USER_DELETE", "User", user.getId(), user.getEmail(), "Deleted user via admin panel");
        
        userRepository.deleteById(id);
    }

    // Helper method to convert User entity to AdminUserDto.Response
    private AdminUserDto.Response toAdminUserDto(User user) {
        // Get the primary role (simplified for frontend)
        String role = "USER";
        if (user.getRoles() != null && !user.getRoles().isEmpty()) {
            Optional<Role> adminRole = user.getRoles().stream()
                    .filter(r -> "ADMIN".equals(r.getName()))
                    .findFirst();
            if (adminRole.isPresent()) {
                role = "ADMIN";
            }
        }

        return AdminUserDto.Response.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(role)
                .status(user.getStatus() != null ? user.getStatus().name() : "INACTIVE")
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
