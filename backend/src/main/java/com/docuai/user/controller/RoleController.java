package com.docuai.user.controller;

import com.docuai.common.dto.ApiResponse;
import com.docuai.user.dto.UserDto;
import com.docuai.core.repository.RoleRepository;
import com.docuai.user.mapper.UserMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/roles")
public class RoleController {

    private final RoleRepository roleRepository;
    private final UserMapper userMapper;

    public RoleController(RoleRepository roleRepository, UserMapper userMapper) {
        this.roleRepository = roleRepository;
        this.userMapper = userMapper;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDto.RoleDto>>> listRoles() {
        List<UserDto.RoleDto> roles = roleRepository.findAll().stream()
                .map(userMapper::roleToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(roles));
    }
}
