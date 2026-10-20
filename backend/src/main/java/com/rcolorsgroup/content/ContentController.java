package com.rcolorsgroup.content;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.ArrayList;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/** Portfolio projects and clients (data/projects.json, data/clients.json) */
@RestController
@RequestMapping("/api")
public class ContentController {
    private final List<JsonNode> projects;
    private final List<JsonNode> clients;

    public ContentController(ContentStore store) {
        this.projects = list(store.read("projects.json"));
        this.clients = list(store.read("clients.json"));
    }

    private static List<JsonNode> list(JsonNode array) {
        List<JsonNode> out = new ArrayList<>();
        if (array != null) array.forEach(out::add);
        return List.copyOf(out);
    }

    @GetMapping("/projects")
    public List<JsonNode> projects() {
        return projects;
    }

    @GetMapping("/projects/{id}")
    public JsonNode project(@PathVariable String id) {
        return projects.stream()
                .filter(p -> id.equals(p.path("id").asText()))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No project " + id));
    }

    @GetMapping("/clients")
    public List<JsonNode> clients() {
        return clients;
    }
}
