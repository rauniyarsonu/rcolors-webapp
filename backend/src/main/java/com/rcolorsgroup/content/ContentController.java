package com.rcolorsgroup.content;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/** Published portfolio projects and clients */
@RestController
@RequestMapping("/api")
@Transactional(readOnly = true)
public class ContentController {
    private final PortfolioProjectRepository projects;
    private final ClientRepository clients;

    public ContentController(PortfolioProjectRepository projects, ClientRepository clients) {
        this.projects = projects;
        this.clients = clients;
    }

    /** Frontend type: PortfolioProject in lib/types.ts */
    public record ProjectView(String id, String name, String location, String business, String category, String status,
                              String coverImage, List<String> gallery, String description, Integer year) {
        static ProjectView of(PortfolioProject p) {
            return new ProjectView(p.getSlug(), p.getName(), p.getLocation(), p.getBusiness(), p.getCategory(), p.getStatus(),
                    p.getCoverImage(), p.getGallery(), p.getDescription(), p.getYear());
        }
    }

    /** Frontend type: Client in lib/types.ts */
    public record ClientView(String id, String name, String logo) {
        static ClientView of(Client c) {
            return new ClientView(c.getSlug(), c.getName(), c.getLogo());
        }
    }

    @GetMapping("/projects")
    public List<ProjectView> projects() {
        return projects.findByPublishedTrueOrderBySortOrderAscIdAsc().stream().map(ProjectView::of).toList();
    }

    @GetMapping("/projects/{id}")
    public ProjectView project(@PathVariable String id) {
        return projects.findBySlugAndPublishedTrue(id)
                .map(ProjectView::of)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No project " + id));
    }

    @GetMapping("/clients")
    public List<ClientView> clients() {
        return clients.findByPublishedTrueOrderBySortOrderAscIdAsc().stream().map(ClientView::of).toList();
    }
}
