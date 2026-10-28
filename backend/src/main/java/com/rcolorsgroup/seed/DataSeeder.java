package com.rcolorsgroup.seed;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.rcolorsgroup.content.BusinessSection;
import com.rcolorsgroup.content.BusinessSectionRepository;
import com.rcolorsgroup.content.BusinessService;
import com.rcolorsgroup.content.BusinessServiceRepository;
import com.rcolorsgroup.content.Client;
import com.rcolorsgroup.content.ClientRepository;
import com.rcolorsgroup.content.ContentStore;
import com.rcolorsgroup.content.HeroSlide;
import com.rcolorsgroup.content.HeroSlideRepository;
import com.rcolorsgroup.content.HomeStat;
import com.rcolorsgroup.content.HomeStatRepository;
import com.rcolorsgroup.content.PortfolioProject;
import com.rcolorsgroup.content.PortfolioProjectRepository;
import com.rcolorsgroup.content.SiteSettings;
import com.rcolorsgroup.content.SiteSettingsRepository;
import com.rcolorsgroup.content.Testimonial;
import com.rcolorsgroup.content.TestimonialRepository;
import com.rcolorsgroup.estate.Agent;
import com.rcolorsgroup.estate.AgentRepository;
import com.rcolorsgroup.estate.EstateJson;
import com.rcolorsgroup.estate.EstateProject;
import com.rcolorsgroup.estate.EstateProjectRepository;
import com.rcolorsgroup.estate.Location;
import com.rcolorsgroup.estate.LocationRepository;
import com.rcolorsgroup.estate.Property;
import com.rcolorsgroup.estate.PropertyRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Fills an empty database from the JSON under data/ (read through ContentStore).
 * Runs only when every content table is empty, so it never touches content
 * the admin has edited. After the first start the files are only seed data.
 */
@Component
public class DataSeeder implements ApplicationRunner {
    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
    private static final List<String> CITY_FILES = List.of("properties", "projects", "agents");

    private final ContentStore store;
    private final boolean enabled;
    private final PortfolioProjectRepository projects;
    private final ClientRepository clients;
    private final TestimonialRepository testimonials;
    private final SiteSettingsRepository settings;
    private final HeroSlideRepository slides;
    private final HomeStatRepository stats;
    private final BusinessSectionRepository sections;
    private final BusinessServiceRepository services;
    private final LocationRepository locations;
    private final PropertyRepository properties;
    private final EstateProjectRepository estateProjects;
    private final AgentRepository agents;

    public DataSeeder(ContentStore store, @Value("${app.seed.enabled:true}") boolean enabled,
                      PortfolioProjectRepository projects, ClientRepository clients, TestimonialRepository testimonials,
                      SiteSettingsRepository settings, HeroSlideRepository slides, HomeStatRepository stats,
                      BusinessSectionRepository sections, BusinessServiceRepository services,
                      LocationRepository locations, PropertyRepository properties,
                      EstateProjectRepository estateProjects, AgentRepository agents) {
        this.store = store;
        this.enabled = enabled;
        this.projects = projects;
        this.clients = clients;
        this.testimonials = testimonials;
        this.settings = settings;
        this.slides = slides;
        this.stats = stats;
        this.sections = sections;
        this.services = services;
        this.locations = locations;
        this.properties = properties;
        this.estateProjects = estateProjects;
        this.agents = agents;
    }

    private List<JpaRepository<?, Long>> contentTables() {
        return List.of(projects, clients, testimonials, settings, slides, stats, sections, services,
                locations, properties, estateProjects, agents);
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (!enabled) return;
        if (contentTables().stream().anyMatch(r -> r.count() > 0)) {
            log.debug("Content tables already hold data; skipping the seed");
            return;
        }
        seedPortfolio();
        seedSite();
        seedBusinesses();
        seedEstate();
        log.info("Seeded the database from data/: {} projects, {} clients, {} locations, {} properties, {} estate projects, {} agents",
                projects.count(), clients.count(), locations.count(), properties.count(), estateProjects.count(), agents.count());
    }

    private void seedPortfolio() {
        int i = 0;
        for (JsonNode n : array("projects.json")) {
            PortfolioProject p = new PortfolioProject();
            p.setSlug(n.path("id").asText());
            p.setName(n.path("name").asText());
            p.setLocation(n.path("location").asText(""));
            p.setBusiness(n.path("business").asText());
            p.setCategory(n.path("category").asText(""));
            p.setStatus(n.path("status").asText(""));
            p.setCoverImage(n.path("coverImage").asText(""));
            p.setGallery(strings(n.path("gallery")));
            p.setDescription(n.path("description").asText(""));
            p.setYear(n.path("year").isNumber() ? n.path("year").asInt() : null);
            p.setFeatured(n.path("featured").asBoolean(false));
            p.setSortOrder(i++);
            projects.save(p);
        }
        i = 0;
        for (JsonNode n : array("clients.json")) {
            Client c = new Client();
            c.setSlug(n.path("id").asText());
            c.setName(n.path("name").asText());
            c.setLogo(n.path("logo").asText(""));
            c.setWebsite(text(n, "website"));
            c.setSortOrder(i++);
            clients.save(c);
        }
        i = 0;
        for (JsonNode n : array("testimonials.json")) {
            Testimonial t = new Testimonial();
            t.setQuote(n.path("quote").asText());
            t.setName(n.path("name").asText());
            t.setRole(text(n, "role"));
            t.setCompany(text(n, "company"));
            t.setCity(text(n, "city"));
            t.setBusiness(n.path("business").asText("group"));
            t.setPhoto(text(n, "photo"));
            t.setRating(n.path("rating").isInt() ? n.path("rating").asInt() : null);
            t.setPermissionObtained(n.path("permissionObtained").asBoolean(false));
            t.setSample(n.path("isSample").asBoolean(false));
            t.setSortOrder(i++);
            testimonials.save(t);
        }
    }

    private void seedSite() {
        JsonNode site = store.read("site.json");
        if (site == null) return;
        JsonNode c = site.path("company");
        if (c.isObject()) {
            SiteSettings s = new SiteSettings();
            s.setCompanyName(c.path("name").asText());
            s.setPhones(strings(c.path("phones")));
            s.setEmail(c.path("email").asText(""));
            s.setAddressShort(c.path("addressShort").asText(""));
            s.setAddressFull(c.path("addressFull").asText(""));
            s.setSocial(c.path("social").isObject() ? c.get("social").deepCopy() : JsonNodeFactory.instance.objectNode());
            settings.save(s);
        }
        int i = 0;
        for (JsonNode n : site.path("heroSlides")) {
            HeroSlide h = new HeroSlide();
            h.setImage(n.path("image").asText());
            h.setTitle(n.path("title").asText());
            h.setSubtitle(text(n, "subtitle"));
            h.setPosition(text(n, "position"));
            h.setSortOrder(i++);
            slides.save(h);
        }
        i = 0;
        for (JsonNode n : site.path("stats")) {
            HomeStat st = new HomeStat();
            st.setValue(n.path("value").asInt());
            st.setSuffix(n.path("suffix").asText(""));
            st.setLabel(n.path("label").asText());
            st.setSortOrder(i++);
            stats.save(st);
        }
    }

    private void seedBusinesses() {
        int order = 0;
        for (JsonNode n : array("businesses.json")) {
            String key = n.path("key").asText();
            BusinessSection b = new BusinessSection();
            b.setKey(key);
            JsonNode hero = n.path("hero");
            b.setHeroTitle(text(hero, "title"));
            b.setHeroSubtitle(text(hero, "subtitle"));
            b.setHeroText(text(hero, "text"));
            b.setHeroImage(text(hero, "image"));
            b.setHeroImageAlt(text(hero, "imageAlt"));
            JsonNode intro = n.path("intro");
            b.setIntroTitle(text(intro, "title"));
            b.setIntroParagraphs(strings(intro.path("paragraphs")));
            b.setIntroImage(text(intro, "image"));
            b.setIntroImageAlt(text(intro, "imageAlt"));
            b.setServicesTitle(text(n, "servicesTitle"));
            b.setServicesSubtitle(text(n, "servicesSubtitle"));
            b.setBlocks(n.path("blocks").isObject() ? n.get("blocks").deepCopy() : JsonNodeFactory.instance.objectNode());
            b.setSortOrder(order++);
            sections.save(b);

            int i = 0;
            for (JsonNode s : n.path("services")) {
                BusinessService svc = new BusinessService();
                svc.setBusinessKey(key);
                svc.setTitle(s.path("title").asText());
                svc.setTagline(text(s, "tagline"));
                svc.setDescription(s.path("description").asText(""));
                svc.setScopeBadge(text(s, "scopeBadge"));
                svc.setImage(text(s, "image"));
                svc.setImageAlt(text(s, "imageAlt"));
                svc.setCapabilities(strings(s.path("capabilities")));
                svc.setCtaText(text(s, "ctaText"));
                svc.setCtaHref(text(s, "ctaHref"));
                svc.setIcon(text(s, "icon"));
                svc.setSortOrder(i++);
                services.save(svc);
            }
        }
    }

    private void seedEstate() {
        // Two passes: a parent may come after its child in the file
        Map<String, Location> byId = new HashMap<>();
        List<JsonNode> nodes = array("estate/locations.json");
        for (JsonNode n : nodes) {
            Location l = locations.save(EstateJson.toLocation(n, new Location()));
            byId.put(l.getPublicId(), l);
        }
        for (JsonNode n : nodes) {
            String parentId = text(n, "parentId");
            if (parentId != null) byId.get(n.path("id").asText()).setParent(byId.get(parentId));
        }

        int order = 0;
        for (String city : store.cityFolders()) {
            for (String kind : CITY_FILES) {
                for (JsonNode n : array("estate/cities/" + city + "/" + kind + ".json")) {
                    switch (kind) {
                        case "properties" -> {
                            Property p = EstateJson.toProperty(n, new Property());
                            if (p.getCitySlug() == null) p.setCitySlug(city);
                            p.setSortOrder(order++);
                            properties.save(p);
                        }
                        case "projects" -> {
                            EstateProject p = EstateJson.toProject(n, new EstateProject());
                            if (p.getCitySlug() == null) p.setCitySlug(city);
                            p.setSortOrder(order++);
                            estateProjects.save(p);
                        }
                        default -> {
                            Agent a = EstateJson.toAgent(n, city, new Agent());
                            a.setSortOrder(order++);
                            agents.save(a);
                        }
                    }
                }
            }
        }
    }

    private List<JsonNode> array(String path) {
        JsonNode json = store.read(path);
        List<JsonNode> out = new ArrayList<>();
        if (json != null && json.isArray()) json.forEach(out::add);
        return out;
    }

    private static List<String> strings(JsonNode array) {
        List<String> out = new ArrayList<>();
        array.forEach(e -> out.add(e.asText()));
        return out;
    }

    private static String text(JsonNode n, String field) {
        JsonNode v = n.get(field);
        return v == null || v.isNull() ? null : v.asText();
    }
}
