package com.rcolorsgroup.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Signs the request in as the admin when it carries a valid "Authorization: Bearer"
 * token. Without one the request stays anonymous and SecurityConfig answers 401.
 * Not a @Component, so it only runs inside the admin filter chain.
 */
class BearerTokenFilter extends OncePerRequestFilter {
    private static final List<GrantedAuthority> ADMIN = List.of(new SimpleGrantedAuthority("ROLE_" + SecurityConfig.ADMIN_ROLE));

    private final AdminAccount account;
    private final TokenService tokens;

    BearerTokenFilter(AdminAccount account, TokenService tokens) {
        this.account = account;
        this.tokens = tokens;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null && header.regionMatches(true, 0, "Bearer ", 0, 7)) {
            String subject = tokens.verify(header.substring(7).trim());
            // A token for an old username stops working when ADMIN_USERNAME changes
            if (subject != null && subject.equals(account.username())) {
                SecurityContext context = SecurityContextHolder.createEmptyContext();
                context.setAuthentication(UsernamePasswordAuthenticationToken.authenticated(subject, null, ADMIN));
                SecurityContextHolder.setContext(context);
            }
        }
        chain.doFilter(request, response);
    }
}
