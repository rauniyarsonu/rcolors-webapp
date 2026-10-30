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
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

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

    @Test
    void aFilledHoneypotLooksSavedButKeepsNothing() throws Exception {
        mvc.perform(contact("Honey Bot", "10.1.0.1").param("bot-field", "http://spam.example"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(0));
        mvc.perform(post("/api/estate/enquiries").contentType(MediaType.APPLICATION_FORM_URLENCODED).with(from("10.1.0.1"))
                        .param("name", "Honey Bot").param("phone", "9123456789").param("interest", "plot")
                        .param("bot-field", "x"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(0));
        assertThat(contacts.findAll()).noneMatch(m -> m.getName().equals("Honey Bot"));
        assertThat(enquiries.findAll()).noneMatch(e -> e.getName().equals("Honey Bot"));
    }

    @Test
    void eleventhSubmissionFromOneIpInAnHourIsRateLimitedAcrossForms() throws Exception {
        for (int i = 0; i < 9; i++) mvc.perform(contact("Flood " + i, "10.2.0.1")).andExpect(status().isCreated());
        mvc.perform(post("/api/estate/sell-requests").contentType(MediaType.APPLICATION_FORM_URLENCODED).with(from("10.2.0.1"))
                        .param("name", "Flood Seller").param("phone", "9988776655")
                        .param("propertyType", "shop").param("location", "Hazratganj"))
                .andExpect(status().isCreated());
        mvc.perform(contact("Flood 11", "10.2.0.1"))
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.errors.form").exists());
        assertThat(contacts.findAll()).noneMatch(m -> m.getName().equals("Flood 11"));
        // Someone else is unaffected
        mvc.perform(contact("Other Visitor", "10.2.0.2")).andExpect(status().isCreated());
    }

    @Test
    void invalidSubmissionsDontUseUpTheLimit() throws Exception {
        for (int i = 0; i < 12; i++) {
            mvc.perform(contact("Typo " + i, "10.3.0.1").param("phone", "123")).andExpect(status().isBadRequest());
        }
        mvc.perform(contact("Finally Right", "10.3.0.1")).andExpect(status().isCreated());
    }

    private static MockHttpServletRequestBuilder contact(String name, String ip) {
        return post("/api/contact").contentType(MediaType.APPLICATION_FORM_URLENCODED).with(from(ip))
                .param("name", name).param("phone", "9876543210").param("email", "visitor@example.com")
                .param("business", "general").param("message", "Please call me back");
    }

    private static RequestPostProcessor from(String ip) {
        return request -> {
            request.setRemoteAddr(ip);
            return request;
        };
    }
}
