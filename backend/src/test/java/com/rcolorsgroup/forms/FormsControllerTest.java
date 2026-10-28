package com.rcolorsgroup.forms;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:test")
@AutoConfigureMockMvc
class FormsControllerTest {
    @Autowired MockMvc mvc;
    @Autowired ContactMessageRepository contacts;
    @Autowired EstateEnquiryRepository enquiries;
    @Autowired PropertySellRequestRepository sellRequests;

    @Test
    void savesAValidContactMessage() throws Exception {
        mvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                        .param("form-name", "contact")
                        .param("name", "  Asha Verma ")
                        .param("phone", "9876543210")
                        .param("email", "asha@example.com")
                        .param("business", "construction")
                        .param("message", "Need a quote for a G+3 building"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber());
        assertThat(contacts.findAll()).anyMatch(m -> m.getName().equals("Asha Verma"));
    }

    @Test
    void rejectsAnInvalidContactMessageFieldByField() throws Exception {
        mvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                        .param("name", "A")
                        .param("phone", "12345")
                        .param("email", "nope")
                        .param("business", "other")
                        .param("message", "hi"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.name").exists())
                .andExpect(jsonPath("$.errors.phone").exists())
                .andExpect(jsonPath("$.errors.email").exists())
                .andExpect(jsonPath("$.errors.business").exists())
                .andExpect(jsonPath("$.errors.message").exists());
    }

    @Test
    void savesAnEnquiryWithOptionalFieldsLeftBlank() throws Exception {
        mvc.perform(post("/api/estate/enquiries")
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                        .param("name", "Ravi Kumar")
                        .param("phone", "9123456789")
                        .param("email", "")
                        .param("interest", "plot")
                        .param("message", "")
                        .param("listing", "")
                        .param("city", "lucknow")
                        .param("page", "https://example.com/businesses/estate/lucknow"))
                .andExpect(status().isCreated());
        assertThat(enquiries.findAll()).anyMatch(e -> e.getName().equals("Ravi Kumar") && e.getCity().equals("lucknow"));
    }

    @Test
    void savesASellRequestWithOptionalFieldsLeftBlank() throws Exception {
        mvc.perform(post("/api/estate/sell-requests")
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                        .param("name", " Meena Gupta ")
                        .param("phone", "9988776655")
                        .param("email", "")
                        .param("propertyType", "residential-plot")
                        .param("location", "Gomti Nagar Extension")
                        .param("area", "")
                        .param("price", "")
                        .param("message", "")
                        .param("city", "Lucknow")
                        .param("page", "https://example.com/businesses/estate/lucknow"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber());
        assertThat(sellRequests.findAll()).anyMatch(r -> r.getName().equals("Meena Gupta") && r.getPropertyType().equals("residential-plot"));
    }

    @Test
    void rejectsAnInvalidSellRequestFieldByField() throws Exception {
        mvc.perform(post("/api/estate/sell-requests")
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                        .param("name", "M")
                        .param("phone", "12345")
                        .param("propertyType", "castle")
                        .param("location", ""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.name").exists())
                .andExpect(jsonPath("$.errors.phone").exists())
                .andExpect(jsonPath("$.errors.propertyType").exists())
                .andExpect(jsonPath("$.errors.location").exists());
    }

    @Test
    void servesContentAndEstateData() throws Exception {
        mvc.perform(get("/api/projects")).andExpect(status().isOk()).andExpect(jsonPath("$[0].id").exists());
        mvc.perform(get("/api/projects/sahu-city-lucknow")).andExpect(jsonPath("$.name").value("Sahu City"));
        mvc.perform(get("/api/projects/missing")).andExpect(status().isNotFound());
        mvc.perform(get("/api/clients")).andExpect(jsonPath("$.length()").value(18));
        mvc.perform(get("/api/estate/cities/lucknow")).andExpect(jsonPath("$.city.name").value("Lucknow"));
        mvc.perform(get("/api/estate/cities/nowhere")).andExpect(status().isNotFound());
    }
}
