package com.docuai.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${security.jwt.access-token-expiration-seconds}")
    private long accessTokenExpiration;

    @Value("${security.jwt.refresh-token-expiration-seconds}")
    private long refreshTokenExpiration;

    private final KeyPair keyPair;
    private final RedisTemplate<String, Object> redisTemplate;

    public JwtService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.keyPair = generateKeyPair(); // Automatically generate RSA keys for now
    }
    
    private KeyPair generateKeyPair() {
        try {
            KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
            kpg.initialize(2048);
            return kpg.generateKeyPair();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate RSA key pair", e);
        }
    }

    public String generateAccessToken(UUID userId, List<String> permissions) {
        return buildToken(userId, accessTokenExpiration, permissions);
    }

    public String generateRefreshToken(UUID userId) {
        return buildToken(userId, refreshTokenExpiration, Collections.emptyList());
    }

    private String buildToken(UUID userId, long expirationSeconds, List<String> permissions) {
        return Jwts.builder()
                .subject(userId.toString())
                .id(UUID.randomUUID().toString())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationSeconds * 1000))
                .claim("permissions", permissions)
                .signWith(keyPair.getPrivate(), Jwts.SIG.RS256)
                .compact();
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractAllClaims(token);
            // check blacklist
            String jti = claims.getId();
            Boolean blacklisted = redisTemplate.hasKey("jwt_blacklist:" + jti);
            return !Boolean.TRUE.equals(blacklisted) && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    public void blacklistToken(String token) {
        Claims claims = extractAllClaims(token);
        String jti = claims.getId();
        long expirationDelay = claims.getExpiration().getTime() - System.currentTimeMillis();
        if (expirationDelay > 0) {
            redisTemplate.opsForValue().set("jwt_blacklist:" + jti, "revoked", expirationDelay, TimeUnit.MILLISECONDS);
        }
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public UUID extractUserId(String token) {
        return UUID.fromString(extractClaim(token, Claims::getSubject));
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(keyPair.getPublic())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
