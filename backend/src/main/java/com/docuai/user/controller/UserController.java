package com.docuai.user.controller;

import com.docuai.common.dto.ApiResponse;
import com.docuai.user.dto.UserDto;
import com.docuai.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@PreAuthorize("hasAuthority('USER_MANAGE')")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<java.util.List<UserDto.Response>>> listUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<UserDto.Response> usersPage = userService.listUsers(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.paginated(
                usersPage.getContent(), page, size, usersPage.getTotalElements(), usersPage.getTotalPages()
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto.Response>> getUser(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUser(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserDto.Response>> createUser(
            @Valid @RequestBody UserDto.CreateRequest request, Authentication authentication) {
        UUID adminId = UUID.fromString(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(userService.createUser(request, adminId, "admin@docuai.com")));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto.Response>> updateUser(
            @PathVariable UUID id, @Valid @RequestBody UserDto.UpdateRequest request, Authentication authentication) {
        UUID adminId = UUID.fromString(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(userService.updateUser(id, request, adminId, "admin@docuai.com")));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<UserDto.Response>> setStatus(
            @PathVariable UUID id, @RequestBody Map<String, Boolean> body, Authentication authentication) {
        UUID adminId = UUID.fromString(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(userService.setStatus(id, body.get("active"), adminId, "admin@docuai.com")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id, Authentication authentication) {
        UUID adminId = UUID.fromString(authentication.getName());
        userService.deleteUser(id, adminId, "admin@docuai.com");
        return ResponseEntity.noContent().build();
    }
}
