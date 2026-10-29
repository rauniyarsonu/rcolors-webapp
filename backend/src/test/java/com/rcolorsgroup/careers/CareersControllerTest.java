package com.rcolorsgroup.careers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;

class CareersControllerTest extends CareersTestSupport {
    private static String applyPath(AdminViews.Job job) {
        return "/api/careers/jobs/" + job.slug() + "/applications";
    }

    @Test
    void publicListShowsOnlyOpenJobsBeforeTheirDeadline() throws Exception {
        AdminViews.Job open = openJob("Listed Plumber");
        AdminViews.Job lastDay = job("Listed Painter", JobStatus.OPEN, LocalDate.now(Careers.ZONE));
        AdminViews.Job draft = job("Hidden Draft", JobStatus.DRAFT, null);
        AdminViews.Job archived = job("Hidden Archived", JobStatus.ARCHIVED, null);
        AdminViews.Job expired = job("Hidden Expired", JobStatus.OPEN, LocalDate.now(Careers.ZONE).minusDays(1));

        String body = mvc.perform(get("/api/careers/jobs")).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        assertThat(body).contains(open.slug(), lastDay.slug())
                .doesNotContain(draft.slug(), archived.slug(), expired.slug())
                // Admin-only fields and hidden salaries stay out of the public API
                .doesNotContain("adminNotes", "showSalary", "300000");

        mvc.perform(get("/api/careers/jobs").param("q", "plumb")).andExpect(jsonPath("$[0].slug").value(open.slug()));
        mvc.perform(get("/api/careers/filters")).andExpect(jsonPath("$.locations").value(org.hamcrest.Matchers.hasItem("Lucknow, UP")));
    }

    @Test
    void detailIs404ForDraftsAndSaysClosedForClosedOrExpiredJobs() throws Exception {
        mvc.perform(get("/api/careers/jobs/" + job("Draft Detail", JobStatus.DRAFT, null).slug())).andExpect(status().isNotFound());
        mvc.perform(get("/api/careers/jobs/" + job("Archived Detail", JobStatus.ARCHIVED, null).slug())).andExpect(status().isNotFound());
        mvc.perform(get("/api/careers/jobs/no-such-job")).andExpect(status().isNotFound());

        mvc.perform(get("/api/careers/jobs/" + openJob("Open Detail").slug()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.acceptingApplications").value(true))
                .andExpect(jsonPath("$.responsibilities[0]").value("Supervise"))
                .andExpect(jsonPath("$.salaryMin").doesNotExist());
        mvc.perform(get("/api/careers/jobs/" + job("Closed Detail", JobStatus.CLOSED, null).slug()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.acceptingApplications").value(false));
        mvc.perform(get("/api/careers/jobs/" + job("Expired Detail", JobStatus.OPEN, LocalDate.now(Careers.ZONE).minusDays(3)).slug()))
                .andExpect(jsonPath("$.acceptingApplications").value(false));
    }

    @Test
    void savesAValidApplicationWithItsResume() throws Exception {
        AdminViews.Job job = openJob("Apply Site Engineer");
        String email = uniqueEmail();
        mvc.perform(application(applyPath(job), email)).andExpect(status().isCreated()).andExpect(jsonPath("$.id").isNumber());

        JobApplication saved = applications.findAll().stream().filter(a -> a.getEmail().equals(email)).findFirst().orElseThrow();
        assertThat(saved.getStatus()).isEqualTo(ApplicationStatus.NEW);
        assertThat(saved.getNoticePeriod()).isEqualTo(NoticePeriod.DAYS_30);
        assertThat(saved.getTotalExperienceYears()).isEqualByComparingTo("2.5");
        assertThat(blobs.count()).isPositive();
    }

    @Test
    void acceptsAGeneralApplicationWithoutAJob() throws Exception {
        String email = uniqueEmail();
        mvc.perform(application("/api/careers/applications", email)).andExpect(status().isCreated());
        assertThat(applications.findAll()).anyMatch(a -> a.getEmail().equals(email) && a.getJob() == null);
    }

    @Test
    void rejectsAMissingResume() throws Exception {
        AdminViews.Job job = openJob("No Resume Job");
        mvc.perform(application(applyPath(job), uniqueEmail(), Map.of(), null))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.resume").value("Please attach your résumé"));
    }

    @Test
    void rejectsATextFileRenamedToPdf() throws Exception {
        AdminViews.Job job = openJob("Fake Pdf Job");
        mvc.perform(application(applyPath(job), uniqueEmail(), Map.of(), resume("cv.pdf", "just some text".getBytes(StandardCharsets.UTF_8))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.resume").value("doesn't look like a real PDF file"));
        mvc.perform(application(applyPath(job), uniqueEmail(), Map.of("resume", "cv.txt")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.resume").value("must be a PDF, DOC or DOCX file"));
    }

    @Test
    void rejectsAResumeOver5Mb() throws Exception {
        byte[] big = Arrays.copyOf(PDF, (int) ResumeRules.MAX_BYTES + 1);
        mvc.perform(application(applyPath(openJob("Big File Job")), uniqueEmail(), Map.of(), resume("cv.pdf", big)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.resume").value("must be 5 MB or smaller"));
    }

    @Test
    void rejectsInvalidFieldsFieldByField() throws Exception {
        mvc.perform(application(applyPath(openJob("Bad Fields Job")), "nope",
                        Map.of("phone", "12345", "linkedinUrl", "javascript:alert(1)", "consent", "false")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.email").exists())
                .andExpect(jsonPath("$.errors.phone").exists())
                .andExpect(jsonPath("$.errors.linkedinUrl").exists())
                .andExpect(jsonPath("$.errors.consent").exists());
    }

    @Test
    void closedOrExpiredJobsDontTakeApplications() throws Exception {
        mvc.perform(application(applyPath(job("Closed Apply", JobStatus.CLOSED, null)), uniqueEmail()))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.errors.job").value("This position is no longer accepting applications"));
        mvc.perform(application(applyPath(job("Expired Apply", JobStatus.OPEN, LocalDate.now(Careers.ZONE).minusDays(1))), uniqueEmail()))
                .andExpect(status().isConflict());
        mvc.perform(application(applyPath(job("Draft Apply", JobStatus.DRAFT, null)), uniqueEmail()))
                .andExpect(status().isNotFound());
    }

    @Test
    void sameEmailCantApplyToTheSameJobTwiceIn30Days() throws Exception {
        AdminViews.Job job = openJob("Duplicate Job");
        String email = uniqueEmail();
        mvc.perform(application(applyPath(job), email)).andExpect(status().isCreated());
        mvc.perform(application(applyPath(job), email.toUpperCase()))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.errors.email").exists());
        // A different job is fine
        mvc.perform(application(applyPath(openJob("Duplicate Job Two")), email)).andExpect(status().isCreated());
    }

    @Test
    void honeypotAnswers201AndStoresNothing() throws Exception {
        String email = uniqueEmail();
        mvc.perform(application(applyPath(openJob("Honeypot Job")), email, Map.of("website", "http://spam.example")))
                .andExpect(status().isCreated());
        assertThat(applications.findAll()).noneMatch(a -> a.getEmail().equals(email));
    }

    @Test
    void sixthApplicationFromOneIpInAnHourIsRateLimited() throws Exception {
        for (int i = 0; i < 5; i++) {
            mvc.perform(application("/api/careers/applications", uniqueEmail()).with(from("172.16.0.5"))).andExpect(status().isCreated());
        }
        mvc.perform(application("/api/careers/applications", uniqueEmail()).with(from("172.16.0.5")))
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.errors.form").exists());
    }
}
