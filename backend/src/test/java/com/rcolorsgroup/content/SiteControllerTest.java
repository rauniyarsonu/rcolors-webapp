package com.rcolorsgroup.content;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:test")
@AutoConfigureMockMvc
@Transactional
class SiteControllerTest {
    @Autowired MockMvc mvc;
    @Autowired TestimonialRepository testimonials;

    @Test
    void servesCompanyHeroSlidesAndStats() throws Exception {
        mvc.perform(get("/api/site"))
                .andExpect(status().isOk())
                .andExpect(header().string("Cache-Control", "max-age=60, public"))
                .andExpect(jsonPath("$.company.name").value("R Colors Group of Companies"))
                .andExpect(jsonPath("$.company.phones[0]").value("6389144470"))
                .andExpect(jsonPath("$.company.address.short").exists())
                .andExpect(jsonPath("$.heroSlides.length()").value(4))
                .andExpect(jsonPath("$.heroSlides[0].position").value("object-[55%_50%]"))
                .andExpect(jsonPath("$.stats[3].value").value(3))
                .andExpect(jsonPath("$.stats[3].suffix").value(""));
    }

    @Test
    void servesPublishedTestimonialsAndFiltersByBusiness() throws Exception {
        mvc.perform(get("/api/testimonials")).andExpect(jsonPath("$.length()").value(3));
        mvc.perform(get("/api/testimonials").param("business", "estate")).andExpect(jsonPath("$.length()").value(1));

        testimonials.findAll().forEach(t -> t.setPublished(false));
        testimonials.flush();
        mvc.perform(get("/api/testimonials")).andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void servesEachBusinessPage() throws Exception {
        mvc.perform(get("/api/businesses/construction"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.intro.title").value("Engineering Excellence. Built Around Your Vision."))
                .andExpect(jsonPath("$.services.length()").value(4))
                .andExpect(jsonPath("$.services[0].capabilities.length()").value(4))
                .andExpect(jsonPath("$.blocks.highlights.length()").value(4));
        mvc.perform(get("/api/businesses/r-colors")).andExpect(jsonPath("$.services.length()").value(8));
        mvc.perform(get("/api/businesses/estate"))
                .andExpect(jsonPath("$.services[0].icon").value("Building2"))
                .andExpect(jsonPath("$.blocks.expertise.length()").value(7))
                .andExpect(jsonPath("$.blocks.journey[0].action").value("land"));
        mvc.perform(get("/api/businesses/other")).andExpect(status().isNotFound());
    }

    @Test
    void onlyPublicReadsGetCacheHeaders() throws Exception {
        mvc.perform(get("/api/clients")).andExpect(header().string("Cache-Control", "max-age=60, public"));
        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_FORM_URLENCODED).param("name", "A"))
                .andExpect(status().isBadRequest())
                .andExpect(header().doesNotExist("Cache-Control"));
    }
}
