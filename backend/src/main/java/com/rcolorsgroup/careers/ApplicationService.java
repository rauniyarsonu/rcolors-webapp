package com.rcolorsgroup.careers;

import static com.rcolorsgroup.forms.FormRules.trim;

import com.rcolorsgroup.config.ApiProblem;
import com.rcolorsgroup.config.PageResult;
import jakarta.persistence.criteria.Predicate;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/** Applications: saving submissions, and the admin review workflow */
@Service
public class ApplicationService {
    /** The same email can apply to the same job (or send a general CV) once in this window */
    static final Duration DUPLICATE_WINDOW = Duration.ofDays(30);

    private final JobApplicationRepository applications;
    private final JobPostingRepository jobs;
    private final ResumeStorage storage;

    public ApplicationService(JobApplicationRepository applications, JobPostingRepository jobs, ResumeStorage storage) {
        this.applications = applications;
        this.jobs = jobs;
        this.storage = storage;
    }

    /** Admin list filters; jobId is a job id, or "general" for applications without a job */
    public record Filter(String jobId, ApplicationStatus status, String q, LocalDate from, LocalDate to) {}

    public record Download(String filename, String contentType, byte[] data) {}

    /** Saves an application whose fields and résumé are already valid; 409 for a recent duplicate */
    @Transactional
    public JobApplication submit(JobPosting job, ApplicationForm f, ResumeRules.Upload upload) {
        String email = trim(f.email());
        Instant since = Instant.now().minus(DUPLICATE_WINDOW);
        boolean duplicate = job == null
                ? applications.existsByJobIsNullAndEmailIgnoreCaseAndCreatedAtAfter(email, since)
                : applications.existsByJobAndEmailIgnoreCaseAndCreatedAtAfter(job, email, since);
        if (duplicate) {
            throw new ApiProblem(HttpStatus.CONFLICT, "email", job == null
                    ? "We already have your CV from the last 30 days. We'll be in touch when a role fits."
                    : "You've already applied for this position. We'll be in touch if your profile is a match.");
        }
        byte[] data = upload.data();
        ResumeFile resume = new ResumeFile(upload.filename(), upload.kind().contentType, data.length, sha256(data), storage.save(data));
        return applications.save(new JobApplication(job, trim(f.name()), email, f.phone(), trim(f.currentLocation()),
                f.totalExperienceYears(), blankToNull(f.currentCompany()), f.noticePeriod(), f.expectedSalary(),
                blankToNull(f.linkedinUrl()), blankToNull(f.portfolioUrl()), blankToNull(f.coverLetter()), resume, true));
    }

    @Transactional(readOnly = true)
    public PageResult<AdminViews.ApplicationRow> search(Filter filter, Pageable pageable) {
        return PageResult.of(applications.findAll(spec(filter), pageable), AdminViews.ApplicationRow::of);
    }

    @Transactional(readOnly = true)
    public AdminViews.ApplicationDetail detail(long id) {
        return AdminViews.ApplicationDetail.of(find(id));
    }

    /** Status (recorded in the history, with the optional note) and/or admin notes */
    @Transactional
    public AdminViews.ApplicationDetail update(long id, AdminViews.ApplicationUpdate update) {
        JobApplication a = find(id);
        if (update.status() != null) a.changeStatus(update.status(), blankToNull(update.note()));
        if (update.adminNotes() != null) a.setAdminNotes(blankToNull(update.adminNotes()));
        applications.flush();
        return AdminViews.ApplicationDetail.of(a);
    }

    @Transactional(readOnly = true)
    public Download resume(long id) {
        ResumeFile r = find(id).getResume();
        return new Download(r.getOriginalFilename(), r.getContentType(), storage.load(r.getStorageKey()));
    }

    /** Removes the application, its history and its résumé (data-removal requests) */
    @Transactional
    public void delete(long id) {
        JobApplication a = find(id);
        String key = a.getResume().getStorageKey();
        applications.delete(a);
        storage.delete(key);
    }

    @Transactional(readOnly = true)
    public String exportCsv(Filter filter) {
        return ApplicationCsv.write(applications.findAll(spec(filter), Sort.by(Sort.Direction.DESC, "createdAt")));
    }

    @Transactional(readOnly = true)
    public AdminViews.Summary summary() {
        LocalDate today = Careers.today();
        long openJobs = jobs.findByStatusOrderByPublishedAtDesc(JobStatus.OPEN).stream().filter(j -> j.acceptingApplications(today)).count();
        Map<ApplicationStatus, Long> byStatus = new EnumMap<>(ApplicationStatus.class);
        for (ApplicationStatus s : ApplicationStatus.values()) byStatus.put(s, 0L);
        long total = 0;
        for (Object[] row : applications.countsByStatus()) {
            long n = ((Number) row[1]).longValue();
            byStatus.put((ApplicationStatus) row[0], n);
            total += n;
        }
        return new AdminViews.Summary(openJobs,
                applications.countByCreatedAtGreaterThanEqual(Careers.startOf(today.minusDays(6))),
                applications.countByCreatedAtGreaterThanEqual(Careers.startOf(today.minusDays(29))),
                total, byStatus);
    }

    private JobApplication find(long id) {
        return applications.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No application " + id));
    }

    private static Specification<JobApplication> spec(Filter f) {
        return (root, cq, cb) -> {
            List<Predicate> where = new ArrayList<>();
            String jobId = trim(f.jobId());
            if (jobId.equals("general")) {
                where.add(cb.isNull(root.get("job")));
            } else if (!jobId.isEmpty()) {
                try {
                    where.add(cb.equal(root.get("job").get("id"), Long.parseLong(jobId)));
                } catch (NumberFormatException e) {
                    throw new ApiProblem(HttpStatus.BAD_REQUEST, "jobId", "must be a job id or \"general\"");
                }
            }
            if (f.status() != null) where.add(cb.equal(root.get("status"), f.status()));
            String q = trim(f.q());
            if (!q.isEmpty()) {
                String like = JobService.likePattern(q);
                where.add(cb.or(
                        cb.like(cb.lower(root.get("name")), like, '\\'),
                        cb.like(cb.lower(root.get("email")), like, '\\'),
                        cb.like(root.get("phone"), like, '\\')));
            }
            if (f.from() != null) where.add(cb.greaterThanOrEqualTo(root.get("createdAt"), Careers.startOf(f.from())));
            if (f.to() != null) where.add(cb.lessThan(root.get("createdAt"), Careers.startOf(f.to().plusDays(1))));
            return cb.and(where.toArray(Predicate[]::new));
        };
    }

    private static String blankToNull(String s) {
        String t = trim(s);
        return t.isEmpty() ? null : t;
    }

    private static String sha256(byte[] data) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(data));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
