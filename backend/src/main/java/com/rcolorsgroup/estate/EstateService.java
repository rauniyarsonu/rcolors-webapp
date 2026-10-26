package com.rcolorsgroup.estate;

import com.fasterxml.jackson.databind.node.ObjectNode;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.function.Predicate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Builds city bundles from the database. Port of buildBundle/listCities in
 * frontend/src/lib/estate/datasource.ts. Reads on every call, so admin edits
 * show up immediately; only published records are returned.
 */
@Service
@Transactional(readOnly = true)
public class EstateService {
    private final LocationRepository locationRepo;
    private final PropertyRepository propertyRepo;
    private final EstateProjectRepository projectRepo;
    private final AgentRepository agentRepo;

    public EstateService(LocationRepository locationRepo, PropertyRepository propertyRepo,
                         EstateProjectRepository projectRepo, AgentRepository agentRepo) {
        this.locationRepo = locationRepo;
        this.propertyRepo = propertyRepo;
        this.projectRepo = projectRepo;
        this.agentRepo = agentRepo;
    }

    /** One consistent read of the public estate data */
    private record Snapshot(List<ObjectNode> locations, LocationTree tree,
                            List<Property> properties, List<EstateProject> projects, List<Agent> agents) {}

    private Snapshot load() {
        List<ObjectNode> locations = locationRepo.findAllByOrderByIdAsc().stream().map(EstateJson::location).toList();
        return new Snapshot(locations, new LocationTree(locations),
                propertyRepo.findByPublishedTrueOrderBySortOrderAscIdAsc(),
                projectRepo.findByPublishedTrueOrderBySortOrderAscIdAsc(),
                agentRepo.findByPublishedTrueOrderBySortOrderAscIdAsc());
    }

    /** Hides records whose location (or an ancestor) is disabled; null when the city isn't shown */
    public CityBundle bundle(String citySlug) {
        return bundle(load(), citySlug);
    }

    private static CityBundle bundle(Snapshot s, String citySlug) {
        ObjectNode node = s.tree().get(citySlug);
        if (node == null || !s.tree().isActive(citySlug)) return null;
        List<Property> properties = s.properties().stream().filter(p -> citySlug.equals(p.getCitySlug())).toList();
        List<EstateProject> projects = s.projects().stream().filter(p -> citySlug.equals(p.getCitySlug())).toList();
        List<Agent> agents = s.agents().stream().filter(a -> citySlug.equals(a.getCitySlug())).toList();
        // Only markets have pages, plus any node records were filed under directly
        if (!s.tree().isMarket(citySlug) && properties.isEmpty() && projects.isEmpty() && agents.isEmpty()) return null;

        Set<String> subtree = s.tree().descendantSlugs(citySlug);
        Predicate<String> visible = slug -> subtree.contains(slug) && s.tree().isActive(slug);

        List<ObjectNode> locs = new ArrayList<>(s.tree().ancestors(citySlug));
        Collections.reverse(locs);
        s.locations().stream().filter(l -> visible.test(LocationTree.slug(l))).forEach(locs::add);

        return new CityBundle(
                s.tree().toCity(node),
                locs,
                properties.stream().filter(p -> visible.test(p.getLocationSlug())).map(EstateJson::property).toList(),
                projects.stream().filter(p -> visible.test(p.getLocationSlug())).map(EstateJson::project).toList(),
                agents.stream().filter(a -> a.getAreasServed().stream().anyMatch(visible)).map(EstateJson::agent).toList());
    }

    /** Markets for the city dropdown: enabled and holding at least one record */
    public List<City> cities() {
        Snapshot s = load();
        return s.tree().markets().stream()
                .filter(m -> {
                    CityBundle b = bundle(s, LocationTree.slug(m));
                    return b != null && b.properties().size() + b.projects().size() + b.agents().size() > 0;
                })
                .map(s.tree()::toCity)
                .toList();
    }
}
