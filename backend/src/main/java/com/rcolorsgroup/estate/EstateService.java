package com.rcolorsgroup.estate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.rcolorsgroup.content.ContentStore;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.StreamSupport;
import org.springframework.stereotype.Service;

/**
 * Builds city bundles from data/estate. Port of buildBundle/listCities in
 * frontend/src/lib/estate/datasource.ts. The data itself is checked by
 * `npm run validate:data` in frontend/ before it ships.
 */
@Service
public class EstateService {
    private static final List<String> CITY_FILES = List.of("properties", "projects", "agents");

    private final List<ObjectNode> locations;
    private final LocationTree tree;
    /** city folder → file kind → records */
    private final Map<String, Map<String, List<ObjectNode>>> cities = new LinkedHashMap<>();

    public EstateService(ContentStore store) {
        this.locations = records(store.read("estate/locations.json"));
        // Defaults the frontend schema applies when parsing
        locations.forEach(l -> {
            if (!l.has("order")) l.put("order", 0);
        });
        this.tree = new LocationTree(locations);
        for (String city : store.cityFolders()) {
            Map<String, List<ObjectNode>> files = new LinkedHashMap<>();
            for (String kind : CITY_FILES) files.put(kind, records(store.read("estate/cities/" + city + "/" + kind + ".json")));
            files.get("properties").forEach(p -> {
                if (!p.has("attributes")) p.putObject("attributes");
            });
            cities.put(city, files);
        }
    }

    private static List<ObjectNode> records(JsonNode array) {
        if (array == null || !array.isArray()) return new ArrayList<>();
        return new ArrayList<>(StreamSupport.stream(array.spliterator(), false).map(ObjectNode.class::cast).toList());
    }

    /** Hides records whose location (or an ancestor) is disabled; null when the city isn't shown */
    public CityBundle bundle(String citySlug) {
        ObjectNode node = tree.get(citySlug);
        Map<String, List<ObjectNode>> files = cities.get(citySlug);
        if (node == null || files == null || !tree.isActive(citySlug)) return null;

        Set<String> subtree = tree.descendantSlugs(citySlug);
        Predicate<String> visible = slug -> subtree.contains(slug) && tree.isActive(slug);

        List<ObjectNode> locs = new ArrayList<>(tree.ancestors(citySlug));
        Collections.reverse(locs);
        locations.stream().filter(l -> visible.test(LocationTree.slug(l))).forEach(locs::add);

        return new CityBundle(
                tree.toCity(node),
                locs,
                files.get("properties").stream().filter(p -> visible.test(p.path("locationSlug").asText())).toList(),
                files.get("projects").stream().filter(p -> visible.test(p.path("locationSlug").asText())).toList(),
                files.get("agents").stream()
                        .filter(a -> StreamSupport.stream(a.path("areasServed").spliterator(), false).anyMatch(s -> visible.test(s.asText())))
                        .toList());
    }

    /** Markets for the city dropdown: enabled and holding at least one record */
    public List<City> cities() {
        return tree.markets().stream()
                .filter(m -> {
                    CityBundle b = bundle(LocationTree.slug(m));
                    return b != null && b.properties().size() + b.projects().size() + b.agents().size() > 0;
                })
                .map(tree::toCity)
                .toList();
    }
}
