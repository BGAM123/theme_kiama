package com.docuai.security;

import com.docuai.core.domain.User;
import com.docuai.core.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    
    // Simple mock cache for user details TTL using plain ConcurrentHashMap
    // In production, caffeine should be used.
    private final Map<String, CacheEntry> cache = new ConcurrentHashMap<>();
    private static final long TTL_MS = 5 * 60 * 1000;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        CacheEntry entry = cache.get(username);
        if (entry != null && System.currentTimeMillis() - entry.timestamp < TTL_MS) {
            return entry.userDetails;
        }

        UUID userId;
        try {
            userId = UUID.fromString(username);
        } catch (IllegalArgumentException e) {
            throw new UsernameNotFoundException("Invalid UUID format");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
                
        List<GrantedAuthority> authorities = user.getRoles().stream()
                .flatMap(role -> role.getPermissions().stream())
                .map(permission -> new SimpleGrantedAuthority(permission.getName()))
                .collect(Collectors.toList());

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getId().toString(),
                user.getPasswordHash(),
                authorities
        );

        cache.put(username, new CacheEntry(userDetails, System.currentTimeMillis()));
        return userDetails;
    }

    private static class CacheEntry {
        final UserDetails userDetails;
        final long timestamp;
        CacheEntry(UserDetails userDetails, long timestamp) {
            this.userDetails = userDetails;
            this.timestamp = timestamp;
        }
    }
}
