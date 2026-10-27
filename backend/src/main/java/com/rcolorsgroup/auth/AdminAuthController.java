package com.rcolorsgroup.auth;

import com.rcolorsgroup.config.ApiProblem;
import com.rcolorsgroup.config.RateLimiter;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Duration;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Admin sign-in: POST login → {token, expiresAt}; GET me → {username} to check a stored token */
@RestController
@RequestMapping("/api/admin/auth")
public class AdminAuthController {
    private static final Logger log = LoggerFactory.getLogger(AdminAuthController.class);

    private final AdminAccount account;
    private final TokenService tokens;
    /** 5 failed attempts per IP per 15 minutes, then 429 until the oldest one expires */
    private final RateLimiter failures = new RateLimiter(5, Duration.ofMinutes(15));

    public AdminAuthController(AdminAccount account, TokenService tokens) {
        this.account = account;
        this.tokens = tokens;
    }

    public record LoginRequest(String username, String password) {}

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest body, HttpServletRequest request) {
        if (!account.enabled()) {
            throw new ApiProblem(HttpStatus.SERVICE_UNAVAILABLE, "login", "Admin login is not configured on this server.");
        }
        String ip = request.getRemoteAddr();
        if (failures.isBlocked(ip)) {
            throw new ApiProblem(HttpStatus.TOO_MANY_REQUESTS, "login", "Too many failed attempts. Please try again in 15 minutes.");
        }
        if (!account.matches(body.username(), body.password())) {
            failures.record(ip);
            log.info("Failed admin login from {}", ip);
            // Same message whether the username or the password was wrong
            throw new ApiProblem(HttpStatus.UNAUTHORIZED, "login", "Incorrect username or password.");
        }
        failures.clear(ip);
        TokenService.Token token = tokens.issue(account.username());
        return Map.of("token", token.token(), "expiresAt", token.expiresAt());
    }

    @GetMapping("/me")
    public Map<String, String> me(Authentication auth) {
        return Map.of("username", auth.getName());
    }
}
