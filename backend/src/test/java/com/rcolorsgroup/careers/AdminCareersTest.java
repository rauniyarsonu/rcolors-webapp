package com.rcolorsgroup.careers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

class AdminCareersTest extends CareersTestSupport {
    private String token;

    @BeforeEach
    void signIn() throws Exception {
        token = login();
    }

    private MockHttpServletRequestBuilder auth(MockHttpServletRequestBuilder req) {
        return req.header(HttpHeaders.AUTHORIZATION, token);
    }

    private MockHttpServletRequestBuilder jsonBody(MockHttpServletRequestBuilder req, Object body) throws Exception {
        return auth(req).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(body));
    }

    private static Map<String, Object> jobJson(String title, String status) {
        Map<String, Object> job = new HashMap<>(Map.of(
                "title", title, "business", "FINISHING_WORKS", "department", "Painting",
                "location", "Kanpur, UP", "workMode", "ON_SITE", "employmentType", "CONTRACT",
                "experienceMinYears", 1, "showSalary", false, "openings", 3, "summary", "Paint things"));
        job.put("description", "Painting work");
        job.put("responsibilities", List.of(" Prep walls ", "", "Paint"));
        job.put("status", status);
        return job;
    }

    private long applyAndGetId(AdminViews.Job job, String email) throws Exception {
        mvc.perform(application("/api/careers/jobs/" + job.slug() + "/applications", email)).andExpect(status().isCreated());
        return applications.findAll().stream().filter(a -> a.getEmail().equals(email)).findFirst().orElseThrow().getId();
    }

    @Test
    void createPublishEditAndListJobs() throws Exception {
        String body = mvc.perform(jsonBody(post("/api/admin/jobs"), jobJson("Wall Painter", "DRAFT")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.slug").value("wall-painter"))
                .andExpect(jsonPath("$.status").value("DRAFT"))
                .andExpect(jsonPath("$.publishedAt").doesNotExist())
                .andExpect(jsonPath("$.responsibilities.length()").value(2))
                .andReturn().getResponse().getContentAsString();
        long id = json.readTree(body).get("id").asLong();

        mvc.perform(jsonBody(patch("/api/admin/jobs/" + id + "/status"), Map.of("status", "OPEN")))
                .andExpect(jsonPath("$.status").value("OPEN"))
                .andExpect(jsonPath("$.publishedAt").isString());

        // The slug stays when the title changes; a second job with the same title gets a suffix
        mvc.perform(jsonBody(put("/api/admin/jobs/" + id), jobJson("Senior Wall Painter", null)))
                .andExpect(jsonPath("$.slug").value("wall-painter"))
                .andExpect(jsonPath("$.status").value("OPEN"));
        mvc.perform(jsonBody(post("/api/admin/jobs"), jobJson("Wall Painter", "DRAFT")))
                .andExpect(jsonPath("$.slug").value(org.hamcrest.Matchers.startsWith("wall-painter-")));

        mvc.perform(auth(get("/api/admin/jobs").param("q", "senior wall")))
                .andExpect(jsonPath("$.total").value(1))
                .andExpect(jsonPath("$.items[0].applicationCount").value(0));
    }

    @Test
    void jobValidationReturnsFieldErrors() throws Exception {
        Map<String, Object> bad = jobJson("", "DRAFT");
        bad.put("experienceMaxYears", 0);
        bad.put("experienceMinYears", 3);
        bad.put("showSalary", true);
        mvc.perform(jsonBody(post("/api/admin/jobs"), bad))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.title").exists())
                .andExpect(jsonPath("$.errors.experienceMaxYears").exists())
                .andExpect(jsonPath("$.errors.salaryMin").exists());
    }

    @Test
    void onlyDraftsWithoutApplicationsCanBeDeleted() throws Exception {
        AdminViews.Job draft = job("Delete Me", JobStatus.DRAFT, null);
        mvc.perform(auth(delete("/api/admin/jobs/" + draft.id()))).andExpect(status().isNoContent());

        AdminViews.Job open = openJob("Keep Me");
        mvc.perform(auth(delete("/api/admin/jobs/" + open.id())))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.errors.job").exists());

        mvc.perform(auth(post("/api/admin/jobs/" + open.id() + "/duplicate")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("DRAFT"))
                .andExpect(jsonPath("$.title").value("Keep Me"));
    }

    @Test
    void statusChangeIsRecordedInTheHistory() throws Exception {
        AdminViews.Job job = openJob("History Job");
        long id = applyAndGetId(job, uniqueEmail());

        mvc.perform(jsonBody(patch("/api/admin/applications/" + id), Map.of("status", "SHORTLISTED", "note", "Strong CV")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SHORTLISTED"));
        mvc.perform(jsonBody(patch("/api/admin/applications/" + id), Map.of("adminNotes", "Call on Monday")))
                .andExpect(jsonPath("$.adminNotes").value("Call on Monday"));

        mvc.perform(auth(get("/api/admin/applications/" + id)))
                .andExpect(jsonPath("$.job.title").value("History Job"))
                .andExpect(jsonPath("$.resume.filename").value("My CV.pdf"))
                .andExpect(jsonPath("$.history.length()").value(1))
                .andExpect(jsonPath("$.history[0].fromStatus").value("NEW"))
                .andExpect(jsonPath("$.history[0].toStatus").value("SHORTLISTED"))
                .andExpect(jsonPath("$.history[0].note").value("Strong CV"));

        mvc.perform(auth(get("/api/admin/jobs/" + job.id())))
                .andExpect(jsonPath("$.applicationCount").value(1))
                .andExpect(jsonPath("$.newApplicationCount").value(0));
        mvc.perform(auth(get("/api/admin/applications").param("jobId", String.valueOf(job.id())).param("status", "SHORTLISTED")))
                .andExpect(jsonPath("$.total").value(1))
                .andExpect(jsonPath("$.items[0].job.title").value("History Job"));
    }

    @Test
    void resumeDownloadNeedsAuthAndIsAnAttachment() throws Exception {
        long id = applyAndGetId(openJob("Download Job"), uniqueEmail());
        mvc.perform(get("/api/admin/applications/" + id + "/resume")).andExpect(status().isUnauthorized());
        mvc.perform(auth(get("/api/admin/applications/" + id + "/resume")))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/pdf"))
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, org.hamcrest.Matchers.startsWith("attachment;")))
                .andExpect(header().string("X-Content-Type-Options", "nosniff"))
                .andExpect(content().bytes(PDF));
    }

    @Test
    void csvExportEscapesFormulaCells() throws Exception {
        AdminViews.Job job = openJob("Csv Job");
        mvc.perform(application("/api/careers/jobs/" + job.slug() + "/applications", uniqueEmail(),
                        Map.of("name", "=SUM(1,2)", "currentCompany", "@evil \"co\"")))
                .andExpect(status().isCreated());
        String csv = mvc.perform(auth(get("/api/admin/applications/export.csv").param("jobId", String.valueOf(job.id()))))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, org.hamcrest.Matchers.containsString(".csv")))
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        assertThat(csv).contains("\"'=SUM(1,2)\"").contains("'@evil \"\"co\"\"").contains("Csv Job").doesNotContain("%PDF");
        assertThat(csv.split("\r\n")).hasSize(2);

        assertThat(ApplicationCsv.cell("+1")).isEqualTo("'+1");
        assertThat(ApplicationCsv.cell("-cmd")).isEqualTo("'-cmd");
        assertThat(ApplicationCsv.cell("plain")).isEqualTo("plain");
        assertThat(ApplicationCsv.cell("a\nb")).isEqualTo("\"a\nb\"");
    }

    @Test
    void deletingAnApplicationRemovesItsResume() throws Exception {
        long id = applyAndGetId(openJob("Removal Job"), uniqueEmail());
        long resumes = blobs.count();
        mvc.perform(auth(delete("/api/admin/applications/" + id))).andExpect(status().isNoContent());
        assertThat(applications.findById(id)).isEmpty();
        assertThat(blobs.count()).isEqualTo(resumes - 1);
        mvc.perform(auth(get("/api/admin/applications/" + id))).andExpect(status().isNotFound());
    }

    @Test
    void summaryCountsJobsAndApplications() throws Exception {
        applyAndGetId(openJob("Summary Job"), uniqueEmail());
        mvc.perform(auth(get("/api/admin/careers/summary")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.openJobs").isNumber())
                .andExpect(jsonPath("$.applicationsLast7Days").value(org.hamcrest.Matchers.greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.byStatus.NEW").isNumber())
                .andExpect(jsonPath("$.byStatus.HIRED").isNumber());
    }
}
