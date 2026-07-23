package com.docuai.config;

import com.docuai.core.domain.Permission;
import com.docuai.core.domain.Role;
import com.docuai.core.repository.PermissionRepository;
import com.docuai.core.repository.RoleRepository;
import com.docuai.core.repository.UserRepository;
import com.docuai.core.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize permissions
        List<String> permissionNames = List.of(
                "USER_MANAGE",
                "DOCTYPE_CREATE",
                "DOCTYPE_DELETE",
                "ADMIN_ACCESS",
                "GENERATION_CREATE",
                "CHAT_ACCESS"
        );

        List<Permission> permissions = permissionNames.stream()
                .map(name -> {
                    return permissionRepository.findByName(name)
                            .orElseGet(() -> permissionRepository.save(
                                    Permission.builder().name(name).label("Permission: " + name).build()
                            ));
                })
                .collect(Collectors.toList());

        // Initialize ADMIN role
        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseGet(() -> {
                    Role role = Role.builder()
                            .name("ADMIN")
                            .label("Administrateur")
                            .permissions(new HashSet<>(permissions))
                            .build();
                    return roleRepository.save(role);
                });

        // Initialize USER role
        Role userRole = roleRepository.findByName("USER")
                .orElseGet(() -> {
                    Set<Permission> userPermissions = permissions.stream()
                            .filter(p -> !p.getName().equals("USER_MANAGE") && !p.getName().equals("ADMIN_ACCESS"))
                            .collect(Collectors.toSet());
                    Role role = Role.builder()
                            .name("USER")
                            .label("Utilisateur")
                            .permissions(userPermissions)
                            .build();
                    return roleRepository.save(role);
                });

        // Initialize admin user if not exists
        if (!userRepository.existsByEmail("admin@docuai.com")) {
            User adminUser = User.builder()
                    .firstName("Admin")
                    .lastName("System")
                    .email("admin@docuai.com")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .status(User.Status.ACTIVE)
                    .roles(Set.of(adminRole))
                    .build();
            userRepository.save(adminUser);
            System.out.println("Created default admin user: admin@docuai.com / admin123");
        }

        System.out.println("Data initialization completed.");
    }
}
