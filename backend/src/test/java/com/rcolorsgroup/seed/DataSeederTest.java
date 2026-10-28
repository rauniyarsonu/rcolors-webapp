package com.rcolorsgroup.seed;

import static org.assertj.core.api.Assertions.assertThat;

import com.rcolorsgroup.content.ClientRepository;
import com.rcolorsgroup.content.PortfolioProjectRepository;
import com.rcolorsgroup.content.TestimonialRepository;
import com.rcolorsgroup.estate.AgentRepository;
import com.rcolorsgroup.estate.LocationRepository;
import com.rcolorsgroup.estate.PropertyRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.DefaultApplicationArguments;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:test")
class DataSeederTest {
    @Autowired DataSeeder seeder;
    @Autowired PortfolioProjectRepository projects;
    @Autowired ClientRepository clients;
    @Autowired TestimonialRepository testimonials;
    @Autowired LocationRepository locations;
    @Autowired PropertyRepository properties;
    @Autowired AgentRepository agents;

    @Test
    void seedsEverythingOnceAndKeepsSampleFlags() {
        assertThat(projects.count()).isEqualTo(12);
        assertThat(clients.count()).isEqualTo(18);
        assertThat(locations.count()).isEqualTo(25);
        assertThat(properties.findAll()).hasSize(10).allMatch(p -> p.isSample());
        assertThat(agents.findAll()).allMatch(a -> a.getCitySlug().equals("lucknow"));
        assertThat(testimonials.findAll()).allMatch(t -> t.isSample() && !t.isPermissionObtained());

        // A second start leaves existing content alone
        seeder.run(new DefaultApplicationArguments());
        assertThat(projects.count()).isEqualTo(12);
        assertThat(locations.count()).isEqualTo(25);
    }
}
