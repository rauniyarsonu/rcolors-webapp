package com.rcolorsgroup.content;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.InputStream;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;

/**
 * The seeded database must serve exactly what the old file-based code served.
 * snapshots/public-api.json was recorded from the JSON-file implementation
 * (commit c4fc7ff) for every project, every location slug and the list endpoints.
 */
@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:test")
@AutoConfigureMockMvc
class PublicApiParityTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;

    @Test
    void seededDatabaseServesTheSameJsonAsTheDataFiles() throws Exception {
        JsonNode snapshot;
        try (InputStream in = getClass().getResourceAsStream("/snapshots/public-api.json")) {
            snapshot = mapper.readTree(in);
        }
        assertThat(snapshot.size()).isGreaterThan(30);
        for (Map.Entry<String, JsonNode> e : snapshot.properties()) {
            String path = e.getKey();
            MockHttpServletResponse res = mvc.perform(get(path)).andReturn().getResponse();
            assertThat(res.getStatus()).as(path).isEqualTo(e.getValue().path("status").asInt());
            if (e.getValue().has("body")) {
                assertThat(mapper.readTree(res.getContentAsString())).as(path).isEqualTo(e.getValue().get("body"));
            }
        }
    }
}
