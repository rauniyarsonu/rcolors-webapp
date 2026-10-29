package com.rcolorsgroup.careers;

import static com.rcolorsgroup.forms.FormRules.trim;

import com.rcolorsgroup.config.ApiProblem;
import com.rcolorsgroup.config.RateLimiter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/** Public careers API: open jobs, one job, filter options, and applications (multipart with a résumé) */
@RestController
@RequestMapping("/api/careers")
public class CareersController {
    private final JobService jobs;
    private final ApplicationService applications;
    private final CareersNotifications notifications;
    /** Spam guard: 5 saved applications per IP per hour */
    private final RateLimiter submissions = new RateLimiter(5, Duration.ofHours(1));

    public CareersController(JobService jobs, ApplicationService applications, CareersNotifications notifications) {
        this.jobs = jobs;
        this.applications = applications;
        this.notifications = notifications;
    }

    @GetMapping("/jobs")
    public List<PublicJobs.Summary> jobs(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) EmploymentType employmentType,
            @RequestParam(required = false) String q) {
        return jobs.openJobs(location, employmentType, q);
    }

    @GetMapping("/jobs/{slug}")
    public PublicJobs.Detail job(@PathVariable String slug) {
        return jobs.publicDetail(slug);
    }

    @GetMapping("/filters")
    public PublicJobs.Filters filters() {
        return jobs.filters();
    }

    @PostMapping(path = "/jobs/{slug}/applications", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> apply(@PathVariable String slug, @Valid @ModelAttribute ApplicationForm form, BindingResult result,
            @RequestParam(required = false) MultipartFile resume, HttpServletRequest request) throws BindException {
        return submit(jobs.findPublic(slug), form, result, resume, request);
    }

    /** "Don't see a fit? Send us your CV" */
    @PostMapping(path = "/applications", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> applyGeneral(@Valid @ModelAttribute ApplicationForm form, BindingResult result,
            @RequestParam(required = false) MultipartFile resume, HttpServletRequest request) throws BindException {
        return submit(null, form, result, resume, request);
    }

    private Map<String, Object> submit(JobPosting job, ApplicationForm form, BindingResult result, MultipartFile resume,
            HttpServletRequest request) throws BindException {
        // Bots fill the hidden field; answer as if it worked and keep nothing
        if (form != null && !trim(form.website()).isEmpty()) return Map.of("id", 0);
        if (job != null && !job.acceptingApplications(Careers.today())) {
            throw new ApiProblem(HttpStatus.CONFLICT, "job", "This position is no longer accepting applications");
        }
        String ip = request.getRemoteAddr();
        if (submissions.isBlocked(ip)) {
            throw new ApiProblem(HttpStatus.TOO_MANY_REQUESTS, "form", "We've received several applications from your network. Please try again in an hour.");
        }
        ResumeRules.Upload upload = null;
        try {
            upload = ResumeRules.check(resume);
        } catch (ResumeRules.Rejected e) {
            result.addError(new FieldError(result.getObjectName(), "resume", e.getMessage()));
        }
        if (result.hasErrors()) throw new BindException(result);

        JobApplication saved = applications.submit(job, form, upload);
        submissions.record(ip);
        notifications.received(saved, job);
        return Map.of("id", saved.getId());
    }
}
