package com.rcolorsgroup.estate;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

/** Runs against the database seeded from src/main/resources/data/estate */
@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:test")
@Transactional
class EstateServiceTest {
    @Autowired EstateService estate;
    @Autowired LocationRepository locations;
    @Autowired PropertyRepository properties;

    @Test
    void listsEnabledCitiesWithRecords() {
        assertThat(estate.cities()).containsExactly(new City("lucknow", "Lucknow", "uttar-pradesh", "Uttar Pradesh"));
    }

    @Test
    void bundleStartsWithAncestorsAndOnlyHoldsActiveRecords() {
        CityBundle b = estate.bundle("lucknow");
        assertThat(b).isNotNull();
        assertThat(b.locations().get(0).path("slug").asText()).isEqualTo("uttar-pradesh");
        assertThat(b.locations()).allMatch(l -> l.path("enabled").asBoolean());
        assertThat(b.properties()).isNotEmpty().allMatch(p -> p.has("attributes"));
        List<String> slugs = b.locations().stream().map(l -> l.path("slug").asText()).toList();
        assertThat(b.properties()).allMatch(p -> slugs.contains(p.path("locationSlug").asText()));
    }

    @Test
    void unknownOrNonMarketSlugsHaveNoBundle() {
        assertThat(estate.bundle("nowhere")).isNull();
        assertThat(estate.bundle("uttar-pradesh")).isNull();
    }

    @Test
    void disablingALocalityHidesItAndItsListings() {
        Location gomtiNagar = locations.findAllByOrderByIdAsc().stream().filter(l -> l.getSlug().equals("gomti-nagar")).findFirst().orElseThrow();
        gomtiNagar.setEnabled(false);
        locations.flush();

        CityBundle b = estate.bundle("lucknow");
        assertThat(b.locations()).noneMatch(l -> l.path("slug").asText().equals("gomti-nagar"));
        assertThat(b.properties()).noneMatch(p -> p.path("locationSlug").asText().equals("gomti-nagar"));
    }

    @Test
    void unpublishedListingsAndCitiesAreHidden() {
        Property first = properties.findByPublishedTrueOrderBySortOrderAscIdAsc().get(0);
        first.setPublished(false);
        properties.flush();
        assertThat(estate.bundle("lucknow").properties()).noneMatch(p -> p.path("id").asText().equals(first.getPublicId()));

        Location lucknow = locations.findAllByOrderByIdAsc().stream().filter(l -> l.getSlug().equals("lucknow")).findFirst().orElseThrow();
        lucknow.setPublished(false);
        locations.flush();
        assertThat(estate.bundle("lucknow")).isNull();
        assertThat(estate.cities()).isEmpty();
    }
}
