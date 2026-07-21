package com.docuai.user.mapper;

import com.docuai.core.domain.User;
import com.docuai.core.domain.Role;
import com.docuai.core.domain.Permission;
import com.docuai.user.dto.UserDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    @Mapping(target = "permissions", source = "roles", qualifiedByName = "rolesToPermissions")
    UserDto.Response toDto(User user);

    UserDto.RoleDto roleToDto(Role role);

    @Named("rolesToPermissions")
    default List<String> rolesToPermissions(Set<Role> roles) {
        if (roles == null) return List.of();
        return roles.stream()
                .flatMap(role -> role.getPermissions().stream())
                .map(Permission::getName)
                .distinct()
                .collect(Collectors.toList());
    }
}
