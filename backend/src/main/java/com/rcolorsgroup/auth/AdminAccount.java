package com.rcolorsgroup.auth;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * The site's single admin, configured from the environment: ADMIN_USERNAME,
 * ADMIN_PASSWORD_HASH (BCrypt) and ADMIN_JWT_SECRET. There is no user table or
 * sign-up. When a setting is missing or invalid, admin login is off (with a
 * warning at startup) and the rest of the site runs as usual.
 */
@Component
public class AdminAccount {
    private static final Logger log = LoggerFactory.getLogger(AdminAccount.class);
    static final int MIN_SECRET_BYTES = 32;
    private static final String BCRYPT = "\\$2[aby]?\\$\\d\\d\\$[./0-9A-Za-z]{53}";

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final String username;
    private final String passwordHash;
    private final byte[] jwtSecret;
    private final boolean enabled;

    public AdminAccount(
            @Value("${app.admin.username:}") String username,
            @Value("${app.admin.password-hash:}") String passwordHash,
            @Value("${app.admin.jwt-secret:}") String jwtSecret) {
        this.username = username.trim();
        this.passwordHash = passwordHash.trim();
        this.jwtSecret = jwtSecret.getBytes(StandardCharsets.UTF_8);

        String problem = null;
        if (this.username.isEmpty()) problem = "ADMIN_USERNAME is not set";
        else if (this.passwordHash.isEmpty()) problem = "ADMIN_PASSWORD_HASH is not set";
        else if (!this.passwordHash.matches(BCRYPT)) problem = "ADMIN_PASSWORD_HASH is not a BCrypt hash";
        else if (this.jwtSecret.length < MIN_SECRET_BYTES) problem = "ADMIN_JWT_SECRET must be at least " + MIN_SECRET_BYTES + " bytes";
        this.enabled = problem == null;
        if (!enabled) log.warn("Admin login is disabled: {}. See README > Configuration.", problem);
    }

    public boolean enabled() { return enabled; }
    public String username() { return username; }
    byte[] jwtSecret() { return jwtSecret.clone(); }

    /**
     * Checks both fields every time, so a wrong username takes as long as a wrong
     * password and the caller can't tell which one was wrong.
     */
    public boolean matches(String username, String password) {
        if (!enabled) return false;
        boolean userOk = MessageDigest.isEqual(bytes(username), bytes(this.username));
        boolean passwordOk = encoder.matches(password == null ? "" : password, passwordHash);
        return userOk & passwordOk;
    }

    private static byte[] bytes(String s) {
        return (s == null ? "" : s).getBytes(StandardCharsets.UTF_8);
    }
}
