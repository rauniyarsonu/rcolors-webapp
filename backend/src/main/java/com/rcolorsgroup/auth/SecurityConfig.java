package com.rcolorsgroup.auth;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Two filter chains. /api/admin/** needs an admin bearer token (except the login
 * endpoint); everything else (content, estate data, the public forms, careers and
 * the React build) stays public exactly as before.
 *
 * Both are stateless: no session cookie, so there is nothing for CSRF to ride on
 * and CSRF protection is off. Future admin APIs (CMS for testimonials, projects,
 * agents, properties) only need to live under /api/admin to be protected.
 */
@Configuration
public class SecurityConfig {
    public static final String ADMIN_ROLE = "ADMIN";

    @Bean
    @Order(1)
    SecurityFilterChain adminApi(HttpSecurity http, AdminAccount account, TokenService tokens) throws Exception {
        stateless(http.securityMatcher("/api/admin/**"))
                // CORS from WebConfig, applied before authentication so preflights get their headers
                .cors(Customizer.withDefaults())
                .addFilterBefore(new BearerTokenFilter(account, tokens), UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/api/admin/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/admin/auth/login").permitAll()
                        .anyRequest().hasRole(ADMIN_ROLE))
                .exceptionHandling(e -> e
                        .authenticationEntryPoint((req, res, ex) -> {
                            res.setHeader(HttpHeaders.WWW_AUTHENTICATE, "Bearer");
                            writeError(res, HttpServletResponse.SC_UNAUTHORIZED, "Please sign in again.");
                        })
                        .accessDeniedHandler((req, res, ex) -> writeError(res, HttpServletResponse.SC_FORBIDDEN, "Not allowed.")));
        return http.build();
    }

    @Bean
    @Order(2)
    SecurityFilterChain publicSite(HttpSecurity http) throws Exception {
        stateless(http)
                // Leave caching of the React build's files as it was (Spring Security would add no-store)
                .headers(h -> h.cacheControl(c -> c.disable()))
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }

    private static HttpSecurity stateless(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .requestCache(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable);
    }

    /** JSON in the same shape as ApiErrors, never Spring's HTML error page or a login redirect */
    private static void writeError(HttpServletResponse res, int status, String message) throws IOException {
        res.setStatus(status);
        res.setContentType(MediaType.APPLICATION_JSON_VALUE);
        res.setCharacterEncoding("UTF-8");
        res.getWriter().write("{\"errors\":{\"auth\":\"" + message + "\"}}");
    }
}
