package com.rcolorsgroup.careers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;

import com.rcolorsgroup.AdminTestSupport;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.request.MockMultipartHttpServletRequestBuilder;

/** Jobs and applications for careers tests. Every test makes its own, so they don't depend on each other */
abstract class CareersTestSupport extends AdminTestSupport {
    private static final AtomicInteger ips = new AtomicInteger();

    static final byte[] PDF = "%PDF-1.4\n%âãÏÓ\n1 0 obj << >> endobj\n%%EOF".getBytes(StandardCharsets.ISO_8859_1);

    @Autowired JobService jobService;
    @Autowired JobPostingRepository jobs;
    @Autowired JobApplicationRepository applications;
    @Autowired ResumeBlobRepository blobs;

    /** A different client IP per call, so the per-IP application limit only trips where a test wants it */
    static String nextIp() {
        int n = ips.incrementAndGet();
        return "192.168." + (n / 250) + "." + (n % 250 + 1);
    }

    static String uniqueEmail() {
        return "cand-" + UUID.randomUUID().toString().substring(0, 8) + "@example.com";
    }

    AdminViews.Job job(String title, JobStatus status, LocalDate deadline) {
        return jobService.create(new JobForm(title, "Site Engineering", "Lucknow, UP",
                WorkMode.ON_SITE, EmploymentType.FULL_TIME, 2, 5, 300000L, 500000L, false, 1,
                "Run a site", "Line one\nLine two", List.of("Supervise"), List.of("Diploma"), List.of(), List.of("Leave"),
                deadline, status));
    }

    AdminViews.Job openJob(String title) {
        return job(title, JobStatus.OPEN, null);
    }

    static MockMultipartFile resume(String filename, byte[] data) {
        return new MockMultipartFile("resume", filename, "application/pdf", data);
    }

    /** A valid application to `path`; `overrides` replace fields ("resume" → a file name to send PDF bytes under) */
    MockMultipartHttpServletRequestBuilder application(String path, String email, Map<String, String> overrides) {
        return application(path, email, overrides, resume(overrides.getOrDefault("resume", "My CV.pdf"), PDF));
    }

    MockMultipartHttpServletRequestBuilder application(String path, String email) {
        return application(path, email, Map.of());
    }

    MockMultipartHttpServletRequestBuilder application(String path, String email, Map<String, String> overrides, MockMultipartFile file) {
        Map<String, String> fields = new LinkedHashMap<>();
        fields.put("name", "Asha Verma");
        fields.put("email", email);
        fields.put("phone", "9876543210");
        fields.put("currentLocation", "Lucknow");
        fields.put("totalExperienceYears", "2.5");
        fields.put("currentCompany", "");
        fields.put("noticePeriod", "DAYS_30");
        fields.put("expectedSalary", "");
        fields.put("linkedinUrl", "https://www.linkedin.com/in/asha");
        fields.put("portfolioUrl", "");
        fields.put("coverLetter", "I'd like to join.");
        fields.put("consent", "true");
        fields.put("website", "");
        fields.putAll(overrides);
        fields.remove("resume");
        MockMultipartHttpServletRequestBuilder req = multipart(path);
        if (file != null) req.file(file);
        req.with(from(nextIp()));
        fields.forEach(req::param);
        return req;
    }
}
