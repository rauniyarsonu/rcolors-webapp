package com.rcolorsgroup.auth;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.rcolorsgroup.AdminTestSupport;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

class AdminAuthTest extends AdminTestSupport {
    private ResultActions attempt(String ip, String username, String password) throws Exception {
        return mvc.perform(post("/api/admin/auth/login").with(from(ip))
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(new Credentials(username, password))));
    }

    @Test
    void adminApiNeedsAToken() throws Exception {
        mvc.perform(get("/api/admin/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(header().string(HttpHeaders.WWW_AUTHENTICATE, "Bearer"))
                .andExpect(jsonPath("$.errors.auth").exists());
        mvc.perform(get("/api/admin/jobs").header(HttpHeaders.AUTHORIZATION, "Bearer not-a-token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void wrongUsernameOrPasswordGetTheSameAnswer() throws Exception {
        attempt("10.0.0.1", ADMIN, "wrong").andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.errors.login").value("Incorrect username or password."));
        attempt("10.0.0.1", "someone", PASSWORD).andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.errors.login").value("Incorrect username or password."));
    }

    @Test
    void sixthFailedLoginFromAnIpIsRateLimited() throws Exception {
        for (int i = 0; i < 5; i++) attempt("10.0.0.6", ADMIN, "wrong " + i).andExpect(status().isUnauthorized());
        // Blocked even with the right password, and only for that IP
        attempt("10.0.0.6", ADMIN, PASSWORD).andExpect(status().isTooManyRequests()).andExpect(jsonPath("$.errors.login").exists());
        attempt("10.0.0.7", ADMIN, PASSWORD).andExpect(status().isOk());
    }

    @Test
    void validLoginReturnsATokenThatWorks() throws Exception {
        attempt("10.0.0.2", ADMIN, PASSWORD)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.expiresAt").isString());
        mvc.perform(get("/api/admin/auth/me").header(HttpHeaders.AUTHORIZATION, login()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value(ADMIN));
    }

    @Test
    void publicEndpointsStayPublic() throws Exception {
        mvc.perform(get("/api/projects")).andExpect(status().isOk());
        mvc.perform(get("/api/estate/cities")).andExpect(status().isOk());
        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_FORM_URLENCODED)
                        .param("name", "Asha Verma").param("phone", "9876543210").param("email", "asha@example.com")
                        .param("business", "general").param("message", "Hello there"))
                .andExpect(status().isCreated());
    }

    @Test
    void corsPreflightForTheAdminApiNeedsNoToken() throws Exception {
        mvc.perform(options("/api/admin/jobs")
                        .header(HttpHeaders.ORIGIN, "http://localhost:3000")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "PATCH")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, "authorization"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:3000"));
    }
}
