package com.rcolorsgroup;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

/** Shared context for tests that need admin login: its own in-memory database and a known admin */
@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:admin")
@AutoConfigureMockMvc
public abstract class AdminTestSupport {
    protected static final String ADMIN = "admin";
    protected static final String PASSWORD = "correct horse battery";

    @Autowired protected MockMvc mvc;
    @Autowired protected ObjectMapper json;

    @DynamicPropertySource
    static void admin(DynamicPropertyRegistry registry) {
        registry.add("app.admin.username", () -> ADMIN);
        registry.add("app.admin.password-hash", () -> new BCryptPasswordEncoder(4).encode(PASSWORD));
        registry.add("app.admin.jwt-secret", () -> "test-secret-that-is-at-least-32-bytes-long");
    }

    /** Rate limits are per IP, so each test that cares uses its own address */
    protected static RequestPostProcessor from(String ip) {
        return request -> {
            request.setRemoteAddr(ip);
            return request;
        };
    }

    protected String login() throws Exception {
        String body = mvc.perform(post("/api/admin/auth/login").with(from("10.9.9.9"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(new Credentials(ADMIN, PASSWORD))))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        JsonNode node = json.readTree(body);
        return "Bearer " + node.get("token").asText();
    }

    public record Credentials(String username, String password) {}
}
