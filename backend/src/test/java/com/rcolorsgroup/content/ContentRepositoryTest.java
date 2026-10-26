package com.rcolorsgroup.content;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rcolorsgroup.estate.Location;
import com.rcolorsgroup.estate.LocationRepository;
import com.rcolorsgroup.estate.Property;
import com.rcolorsgroup.estate.PropertyRepository;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.dao.DataIntegrityViolationException;

/** Flyway migrations + Hibernate validation on H2, and the JSON column converters */
@DataJpaTest
class ContentRepositoryTest {
    @Autowired TestEntityManager em;
    @Autowired PortfolioProjectRepository projects;
    @Autowired PropertyRepository properties;
    @Autowired LocationRepository locations;

    private static PortfolioProject project(String slug, int order, boolean published) {
        PortfolioProject p = new PortfolioProject();
        p.setSlug(slug);
        p.setName(slug);
        p.setBusiness("construction");
        p.setSortOrder(order);
        p.setPublished(published);
        return p;
    }

    @Test
    void publicQueriesSkipDraftsAndFollowSortOrder() {
        projects.save(project("b", 2, true));
        projects.save(project("a", 1, true));
        projects.save(project("draft", 0, false));

        assertThat(projects.findByPublishedTrueOrderBySortOrderAscIdAsc()).extracting(PortfolioProject::getSlug).containsExactly("a", "b");
        assertThat(projects.findBySlugAndPublishedTrue("draft")).isEmpty();
        assertThat(projects.existsBySlug("draft")).isTrue();
    }

    @Test
    void slugsAreUnique() {
        projects.saveAndFlush(project("same", 0, true));
        assertThatThrownBy(() -> projects.saveAndFlush(project("same", 1, true))).isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void jsonColumnsRoundTripListsAndAttributes() throws Exception {
        Location parent = new Location();
        parent.setPublicId("lucknow");
        parent.setSlug("lucknow");
        parent.setName("Lucknow");
        parent.setType("city");
        parent.setEnabled(true);
        Location child = new Location();
        child.setPublicId("gomti-nagar");
        child.setSlug("gomti-nagar");
        child.setName("Gomti Nagar");
        child.setType("locality");
        child.setParent(parent);
        child.setAliases(List.of("GN", "Gomti"));
        locations.save(parent);
        locations.save(child);

        Property p = new Property();
        p.setPublicId("lko-p-900");
        p.setCitySlug("lucknow");
        p.setLocationSlug("gomti-nagar");
        p.setTitle("Plot");
        p.setCategory("land");
        p.setType("residential-plot");
        p.setPrice(4500000);
        p.setAreaValue(1.5);
        p.setAreaUnit("acre");
        p.setStatus("ready");
        p.setImages(List.of("/images/a.jpg", "/images/b.jpg"));
        p.setPostedAt(LocalDate.of(2026, 10, 1));
        p.setAttributes(new ObjectMapper().readTree("{\"facing\":\"east\",\"roadWidth\":30,\"cornerPlot\":true}"));
        properties.save(p);
        em.flush();
        em.clear();

        Property back = properties.findByPublishedTrueOrderBySortOrderAscIdAsc().get(0);
        assertThat(back.getImages()).containsExactly("/images/a.jpg", "/images/b.jpg");
        assertThat(back.getAttributes().path("roadWidth").asInt()).isEqualTo(30);
        assertThat(back.getAttributes().path("cornerPlot").asBoolean()).isTrue();
        Location gn = locations.findAllByOrderByIdAsc().get(1);
        assertThat(gn.getParent().getSlug()).isEqualTo("lucknow");
        assertThat(gn.getAliases()).containsExactly("GN", "Gomti");
        assertThat(gn.getNearby()).isNull();
        assertThat(back.getCreatedAt()).isNotNull();
    }
}
