package com.docuai.user.mapper;

import com.docuai.core.domain.Role;
import com.docuai.core.domain.User;
import com.docuai.user.dto.UserDto;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-22T18:48:27+0100",
    comments = "version: 1.6.0.Beta1, compiler: javac, environment: Java 25.0.1 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDto.Response toDto(User user) {
        if ( user == null ) {
            return null;
        }

        UserDto.Response.ResponseBuilder response = UserDto.Response.builder();

        response.permissions( rolesToPermissions( user.getRoles() ) );
        response.id( user.getId() );
        response.firstName( user.getFirstName() );
        response.lastName( user.getLastName() );
        response.email( user.getEmail() );
        response.roles( roleSetToRoleDtoList( user.getRoles() ) );
        if ( user.getStatus() != null ) {
            response.status( user.getStatus().name() );
        }
        response.lastLoginAt( user.getLastLoginAt() );
        response.createdAt( user.getCreatedAt() );

        return response.build();
    }

    @Override
    public UserDto.RoleDto roleToDto(Role role) {
        if ( role == null ) {
            return null;
        }

        UserDto.RoleDto.RoleDtoBuilder roleDto = UserDto.RoleDto.builder();

        roleDto.id( role.getId() );
        roleDto.name( role.getName() );
        roleDto.label( role.getLabel() );

        return roleDto.build();
    }

    protected List<UserDto.RoleDto> roleSetToRoleDtoList(Set<Role> set) {
        if ( set == null ) {
            return null;
        }

        List<UserDto.RoleDto> list = new ArrayList<UserDto.RoleDto>( set.size() );
        for ( Role role : set ) {
            list.add( roleToDto( role ) );
        }

        return list;
    }
}
