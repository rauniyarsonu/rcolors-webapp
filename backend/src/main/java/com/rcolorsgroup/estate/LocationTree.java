package com.rcolorsgroup.estate;

import com.fasterxml.jackson.databind.node.ObjectNode;
import java.text.Collator;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Deque;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

/**
 * Lookup structure over the flat location list (EstateJson.location records).
 * Port of frontend/src/lib/estate/locationTree.ts; keep the two in step.
 */
public class LocationTree {
    private static final Collator NAME_ORDER = Collator.getInstance(Locale.ENGLISH);
    static final Comparator<ObjectNode> BY_ORDER =
            Comparator.<ObjectNode>comparingInt(LocationTree::order).thenComparing(LocationTree::name, NAME_ORDER);

    private final Map<String, ObjectNode> bySlug = new LinkedHashMap<>();
    private final Map<String, ObjectNode> byId = new HashMap<>();
    private final Map<String, List<ObjectNode>> children = new HashMap<>();

    public LocationTree(List<ObjectNode> locations) {
        for (ObjectNode loc : locations) {
            bySlug.put(slug(loc), loc);
            byId.put(loc.path("id").asText(), loc);
        }
        for (ObjectNode loc : locations) {
            String parentId = parentId(loc);
            if (parentId != null) children.computeIfAbsent(parentId, k -> new ArrayList<>()).add(loc);
        }
        children.values().forEach(list -> list.sort(BY_ORDER));
    }

    static String slug(ObjectNode loc) {
        return loc.path("slug").asText();
    }

    static String name(ObjectNode loc) {
        return loc.path("name").asText();
    }

    static String type(ObjectNode loc) {
        return loc.path("type").asText();
    }

    static int order(ObjectNode loc) {
        return loc.path("order").asInt(0);
    }

    static boolean enabled(ObjectNode loc) {
        return loc.path("enabled").asBoolean(false);
    }

    static String parentId(ObjectNode loc) {
        var p = loc.get("parentId");
        return p == null || p.isNull() ? null : p.asText();
    }

    public ObjectNode get(String slug) {
        return bySlug.get(slug);
    }

    /** Ancestors from the direct parent up to the root (cycle-safe) */
    public List<ObjectNode> ancestors(String slug) {
        List<ObjectNode> out = new ArrayList<>();
        Set<String> seen = new HashSet<>(Set.of(slug));
        ObjectNode node = bySlug.get(slug);
        String parentId = node == null ? null : parentId(node);
        while (parentId != null && !seen.contains(parentId)) {
            ObjectNode parent = byId.get(parentId);
            if (parent == null) break;
            out.add(parent);
            seen.add(slug(parent));
            parentId = parentId(parent);
        }
        return out;
    }

    /** Slugs of a node and every node below it */
    public Set<String> descendantSlugs(String slug) {
        Set<String> out = new LinkedHashSet<>();
        ObjectNode start = bySlug.get(slug);
        if (start == null) return out;
        Deque<ObjectNode> stack = new ArrayDeque<>(List.of(start));
        while (!stack.isEmpty()) {
            ObjectNode node = stack.pop();
            if (!out.add(slug(node))) continue;
            children.getOrDefault(node.path("id").asText(), List.of()).forEach(stack::push);
        }
        return out;
    }

    /** A node is active when it and all its ancestors are enabled */
    public boolean isActive(String slug) {
        ObjectNode node = bySlug.get(slug);
        if (node == null || !enabled(node)) return false;
        return ancestors(slug).stream().allMatch(LocationTree::enabled);
    }

    public ObjectNode stateOf(String slug) {
        ObjectNode node = bySlug.get(slug);
        if (node != null && "state".equals(type(node))) return node;
        return ancestors(slug).stream().filter(a -> "state".equals(type(a))).findFirst().orElse(null);
    }

    private static boolean isMarketType(ObjectNode loc) {
        String t = type(loc);
        return "city".equals(t) || "town".equals(t);
    }

    /** Markets are city/town nodes not nested inside another city/town */
    public boolean isMarket(String slug) {
        ObjectNode node = bySlug.get(slug);
        return node != null && isMarketType(node) && ancestors(slug).stream().noneMatch(LocationTree::isMarketType);
    }

    /** Enabled markets in config order */
    public List<ObjectNode> markets() {
        return bySlug.values().stream()
                .filter(l -> isMarket(slug(l)) && isActive(slug(l)))
                .sorted(BY_ORDER)
                .toList();
    }

    public City toCity(ObjectNode market) {
        ObjectNode state = stateOf(slug(market));
        return new City(slug(market), name(market), state == null ? null : slug(state), state == null ? null : name(state));
    }
}
