package com.docuai.user.controller;

import com.docuai.common.dto.ApiResponse;
import com.docuai.user.dto.AdminUserDto;
import com.docuai.user.service.AdminUserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/users")
@PreAuthorize("hasAuthority('USER_MANAGE')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AdminUserDto.Response>>> listUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AdminUserDto.Response> usersPage = adminUserService.listUsers(pageable, search);
        return ResponseEntity.ok(ApiResponse.<List<AdminUserDto.Response>>paginated(
                usersPage.getContent(), page, size, usersPage.getTotalElements(), usersPage.getTotalPages()
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminUserDto.Response>> getUser(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(adminUserService.getUser(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AdminUserDto.Response>> createUser(
            @Valid @RequestBody AdminUserDto.CreateRequest request, Authentication authentication) {
        UUID adminId = UUID.fromString(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(
                adminUserService.createUser(request, adminId, authentication.getName())
        ));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminUserDto.Response>> updateUser(
            @PathVariable UUID id, @Valid @RequestBody AdminUserDto.UpdateRequest request, Authentication authentication) {
        UUID adminId = UUID.fromString(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(
                adminUserService.updateUser(id, request, adminId, authentication.getName())
        ));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AdminUserDto.Response>> setStatus(
            @PathVariable UUID id, @RequestBody Map<String, Boolean> body, Authentication authentication) {
        UUID adminId = UUID.fromString(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(
                adminUserService.setStatus(id, body.get("active"), adminId, authentication.getName())
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id, Authentication authentication) {
        UUID adminId = UUID.fromString(authentication.getName());
        adminUserService.deleteUser(id, adminId, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
