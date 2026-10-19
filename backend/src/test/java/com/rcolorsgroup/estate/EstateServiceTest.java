package com.rcolorsgroup.estate;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rcolorsgroup.content.ContentStore;
import java.util.List;
import org.junit.jupiter.api.Test;

/** Runs against the real data in src/main/resources/data/estate */
class EstateServiceTest {
    private final EstateService estate = new EstateService(new ContentStore(new ObjectMapper(), ""));

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
}
