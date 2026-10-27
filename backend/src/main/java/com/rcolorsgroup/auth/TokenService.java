package com.rcolorsgroup.auth;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Component;

/**
 * Issues and checks admin session tokens: HS256 JWTs signed with ADMIN_JWT_SECRET,
 * valid for 8 hours. Stateless, so the API works when the frontend is on another
 * origin (Netlify) and nothing is stored server side.
 *
 * jjwt rather than spring-boot-starter-oauth2-resource-server: the resource server
 * only verifies tokens, and we also have to issue them; with one symmetric key jjwt
 * does both in a few lines, without JWK or decoder configuration.
 */
@Component
public class TokenService {
    static final Duration LIFETIME = Duration.ofHours(8);
    private static final String ISSUER = "rcolors-admin";

    /** null when admin login is disabled */
    private final SecretKey key;

    public TokenService(AdminAccount account) {
        this.key = account.enabled() ? Keys.hmacShaKeyFor(account.jwtSecret()) : null;
    }

    public record Token(String token, Instant expiresAt) {}

    public Token issue(String subject) {
        if (key == null) throw new IllegalStateException("Admin login is disabled");
        // JWT times are whole seconds
        Instant now = Instant.now().truncatedTo(ChronoUnit.SECONDS);
        Instant expiresAt = now.plus(LIFETIME);
        String token = Jwts.builder()
                .issuer(ISSUER)
                .subject(subject)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiresAt))
                .signWith(key, Jwts.SIG.HS256)
                .compact();
        return new Token(token, expiresAt);
    }

    /** The subject of a valid, unexpired token, or null */
    public String verify(String token) {
        if (key == null || token == null || token.isBlank()) return null;
        try {
            return Jwts.parser().verifyWith(key).requireIssuer(ISSUER).build()
                    .parseSignedClaims(token).getPayload().getSubject();
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }
}
