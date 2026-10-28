package com.rcolorsgroup.estate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Converts estate entities to and from the JSON records the frontend parses
 * (LocationSchema, PropertySchema, ProjectSchema, AgentSchema in
 * frontend/src/lib/estate/schema.ts). The schemas are strict, so optional
 * fields are left out rather than sent as null, and flags only appear when true.
 */
public final class EstateJson {
    private static final JsonNodeFactory JSON = JsonNodeFactory.instance;

    private EstateJson() {}

    // Entity → JSON

    /** An unpublished location is treated as disabled, which hides it and everything below it */
    public static ObjectNode location(Location l) {
        ObjectNode n = JSON.objectNode();
        n.put("id", l.getPublicId());
        n.put("slug", l.getSlug());
        n.put("name", l.getName());
        n.put("type", l.getType());
        n.put("parentId", l.getParent() == null ? null : l.getParent().getPublicId());
        n.put("enabled", l.isEnabled() && l.isPublished());
        n.put("order", l.getSortOrder());
        list(n, "nearby", l.getNearby());
        if (l.getLat() != null && l.getLng() != null) {
            ObjectNode c = n.putObject("coordinates");
            c.put("lat", l.getLat());
            c.put("lng", l.getLng());
        }
        list(n, "aliases", l.getAliases());
        list(n, "landmarks", l.getLandmarks());
        flag(n, "trending", l.isTrending());
        flag(n, "toConfirm", l.isToConfirm());
        return n;
    }

    public static ObjectNode property(Property p) {
        ObjectNode n = JSON.objectNode();
        n.put("id", p.getPublicId());
        n.put("citySlug", p.getCitySlug());
        n.put("locationSlug", p.getLocationSlug());
        n.put("title", p.getTitle());
        n.put("category", p.getCategory());
        n.put("type", p.getType());
        number(n, "price", p.getPrice());
        optional(n, "priceUnit", p.getPriceUnit());
        number(n, "areaValue", p.getAreaValue());
        n.put("areaUnit", p.getAreaUnit());
        n.put("status", p.getStatus());
        n.set("images", strings(p.getImages()));
        n.put("verified", p.isVerified());
        optional(n, "verifiedOn", p.getVerifiedOn() == null ? null : p.getVerifiedOn().toString());
        n.put("description", p.getDescription());
        n.put("postedAt", p.getPostedAt().toString());
        flag(n, "featured", p.isFeatured());
        optional(n, "agentId", p.getAgentId());
        optional(n, "projectId", p.getProjectId());
        flag(n, "isSample", p.isSample());
        n.set("attributes", p.getAttributes() == null ? JSON.objectNode() : p.getAttributes().deepCopy());
        return n;
    }

    public static ObjectNode project(EstateProject p) {
        ObjectNode n = JSON.objectNode();
        n.put("id", p.getPublicId());
        n.put("citySlug", p.getCitySlug());
        n.put("locationSlug", p.getLocationSlug());
        n.put("name", p.getName());
        n.put("developer", p.getDeveloper());
        n.put("type", p.getType());
        n.put("status", p.getStatus());
        number(n, "startingPrice", p.getStartingPrice());
        n.put("sizeRange", p.getSizeRange());
        n.set("images", strings(p.getImages()));
        n.put("description", p.getDescription());
        optional(n, "reraId", p.getReraId());
        flag(n, "featured", p.isFeatured());
        flag(n, "isSample", p.isSample());
        return n;
    }

    public static ObjectNode agent(Agent a) {
        ObjectNode n = JSON.objectNode();
        n.put("id", a.getPublicId());
        n.put("name", a.getName());
        n.put("role", a.getRole());
        optional(n, "photo", a.getPhoto());
        n.put("phone", a.getPhone());
        optional(n, "whatsapp", a.getWhatsapp());
        optional(n, "email", a.getEmail());
        n.set("specializations", strings(a.getSpecializations()));
        n.set("areasServed", strings(a.getAreasServed()));
        n.set("languages", strings(a.getLanguages()));
        flag(n, "featured", a.isFeatured());
        flag(n, "isSample", a.isSample());
        return n;
    }

    /** Whole numbers are written without a fraction (9000000, not 9000000.0), as in the data files */
    private static void number(ObjectNode n, String field, double value) {
        if (value == Math.rint(value) && Math.abs(value) < 1e15) n.put(field, (long) value);
        else n.put(field, value);
    }

    private static void optional(ObjectNode n, String field, String value) {
        if (value != null) n.put(field, value);
    }

    private static void flag(ObjectNode n, String field, boolean value) {
        if (value) n.put(field, true);
    }

    private static void list(ObjectNode n, String field, List<String> values) {
        if (values != null) n.set(field, strings(values));
    }

    private static ArrayNode strings(List<String> values) {
        ArrayNode a = JSON.arrayNode();
        if (values != null) values.forEach(a::add);
        return a;
    }

    // JSON → entity (seed files, CSV import)

    /** Fills a location from its JSON; the parent is linked separately because it may not exist yet */
    public static Location toLocation(JsonNode n, Location l) {
        l.setPublicId(text(n, "id"));
        l.setSlug(text(n, "slug"));
        l.setName(text(n, "name"));
        l.setType(text(n, "type"));
        l.setEnabled(n.path("enabled").asBoolean(false));
        l.setSortOrder(n.path("order").asInt(0));
        l.setNearby(stringList(n, "nearby"));
        JsonNode c = n.get("coordinates");
        l.setLat(c == null ? null : c.path("lat").asDouble());
        l.setLng(c == null ? null : c.path("lng").asDouble());
        l.setAliases(stringList(n, "aliases"));
        l.setLandmarks(stringList(n, "landmarks"));
        l.setTrending(n.path("trending").asBoolean(false));
        l.setToConfirm(n.path("toConfirm").asBoolean(false));
        return l;
    }

    public static Property toProperty(JsonNode n, Property p) {
        p.setPublicId(text(n, "id"));
        p.setCitySlug(text(n, "citySlug"));
        p.setLocationSlug(text(n, "locationSlug"));
        p.setTitle(text(n, "title"));
        p.setCategory(text(n, "category"));
        p.setType(text(n, "type"));
        p.setPrice(n.path("price").asDouble());
        p.setPriceUnit(text(n, "priceUnit"));
        p.setAreaValue(n.path("areaValue").asDouble());
        p.setAreaUnit(text(n, "areaUnit"));
        p.setStatus(text(n, "status"));
        p.setImages(orEmpty(stringList(n, "images")));
        p.setVerified(n.path("verified").asBoolean(false));
        p.setVerifiedOn(date(n, "verifiedOn"));
        p.setDescription(orEmpty(text(n, "description")));
        p.setPostedAt(date(n, "postedAt"));
        p.setFeatured(n.path("featured").asBoolean(false));
        p.setAgentId(text(n, "agentId"));
        p.setProjectId(text(n, "projectId"));
        p.setSample(n.path("isSample").asBoolean(false));
        JsonNode attrs = n.get("attributes");
        p.setAttributes(attrs != null && attrs.isObject() ? attrs.deepCopy() : JSON.objectNode());
        return p;
    }

    public static EstateProject toProject(JsonNode n, EstateProject p) {
        p.setPublicId(text(n, "id"));
        p.setCitySlug(text(n, "citySlug"));
        p.setLocationSlug(text(n, "locationSlug"));
        p.setName(text(n, "name"));
        p.setDeveloper(text(n, "developer"));
        p.setType(text(n, "type"));
        p.setStatus(text(n, "status"));
        p.setStartingPrice(n.path("startingPrice").asDouble());
        p.setSizeRange(text(n, "sizeRange"));
        p.setImages(orEmpty(stringList(n, "images")));
        p.setDescription(orEmpty(text(n, "description")));
        p.setReraId(text(n, "reraId"));
        p.setFeatured(n.path("featured").asBoolean(false));
        p.setSample(n.path("isSample").asBoolean(false));
        return p;
    }

    /** Agents carry no citySlug in their JSON (it was the folder name), so the caller passes it */
    public static Agent toAgent(JsonNode n, String citySlug, Agent a) {
        a.setPublicId(text(n, "id"));
        a.setCitySlug(citySlug);
        a.setName(text(n, "name"));
        a.setRole(text(n, "role"));
        a.setPhoto(text(n, "photo"));
        a.setPhone(text(n, "phone"));
        a.setWhatsapp(text(n, "whatsapp"));
        a.setEmail(text(n, "email"));
        a.setSpecializations(orEmpty(stringList(n, "specializations")));
        a.setAreasServed(orEmpty(stringList(n, "areasServed")));
        a.setLanguages(orEmpty(stringList(n, "languages")));
        a.setFeatured(n.path("featured").asBoolean(false));
        a.setSample(n.path("isSample").asBoolean(false));
        return a;
    }

    private static String text(JsonNode n, String field) {
        JsonNode v = n.get(field);
        return v == null || v.isNull() ? null : v.asText();
    }

    private static LocalDate date(JsonNode n, String field) {
        String s = text(n, field);
        return s == null ? null : LocalDate.parse(s);
    }

    private static List<String> stringList(JsonNode n, String field) {
        JsonNode v = n.get(field);
        if (v == null || !v.isArray()) return null;
        List<String> out = new ArrayList<>();
        v.forEach(e -> out.add(e.asText()));
        return out;
    }

    private static <T> List<T> orEmpty(List<T> list) {
        return list == null ? new ArrayList<>() : list;
    }

    private static String orEmpty(String s) {
        return s == null ? "" : s;
    }
}
