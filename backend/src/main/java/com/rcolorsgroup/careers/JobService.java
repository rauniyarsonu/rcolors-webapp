package com.rcolorsgroup.careers;

import static com.rcolorsgroup.forms.FormRules.trim;

import com.rcolorsgroup.config.ApiProblem;
import com.rcolorsgroup.config.PageResult;
import jakarta.persistence.criteria.Predicate;
import java.security.SecureRandom;
import java.text.Normalizer;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/** Job postings: the public list/detail and the admin create/edit/publish workflow */
@Service
public class JobService {
    private static final SecureRandom random = new SecureRandom();

    private final JobPostingRepository jobs;
    private final JobApplicationRepository applications;

    public JobService(JobPostingRepository jobs, JobApplicationRepository applications) {
        this.jobs = jobs;
        this.applications = applications;
    }

    // ---- Public ----

    /** OPEN jobs not past their deadline, newest first, optionally filtered */
    @Transactional(readOnly = true)
    public List<PublicJobs.Summary> openJobs(Business business, String location, EmploymentType employmentType, String q) {
        String place = trim(location);
        String query = trim(q).toLowerCase(Locale.ROOT);
        return accepting().stream()
                .filter(j -> business == null || j.getBusiness() == business)
                .filter(j -> place.isEmpty() || j.getLocation().equalsIgnoreCase(place))
                .filter(j -> employmentType == null || j.getEmploymentType() == employmentType)
                .filter(j -> query.isEmpty() || contains(j.getTitle(), query) || contains(j.getDepartment(), query))
                .map(PublicJobs.Summary::of)
                .toList();
    }

    @Transactional(readOnly = true)
    public PublicJobs.Detail publicDetail(String slug) {
        return PublicJobs.Detail.of(findPublic(slug), Careers.today());
    }

    /** A job whose page is public: OPEN or CLOSED. Drafts, archived and unknown slugs are 404 */
    @Transactional(readOnly = true)
    public JobPosting findPublic(String slug) {
        return jobs.findBySlug(slug)
                .filter(j -> j.getStatus() == JobStatus.OPEN || j.getStatus() == JobStatus.CLOSED)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No job " + slug));
    }

    @Transactional(readOnly = true)
    public PublicJobs.Filters filters() {
        List<JobPosting> open = accepting();
        return new PublicJobs.Filters(
                Arrays.stream(Business.values()).filter(b -> open.stream().anyMatch(j -> j.getBusiness() == b)).toList(),
                open.stream().map(JobPosting::getLocation).distinct().sorted(String.CASE_INSENSITIVE_ORDER).toList(),
                Arrays.stream(EmploymentType.values()).filter(t -> open.stream().anyMatch(j -> j.getEmploymentType() == t)).toList());
    }

    private List<JobPosting> accepting() {
        LocalDate today = Careers.today();
        return jobs.findByStatusOrderByPublishedAtDesc(JobStatus.OPEN).stream().filter(j -> j.acceptingApplications(today)).toList();
    }

    private static boolean contains(String text, String lowerQuery) {
        return text != null && text.toLowerCase(Locale.ROOT).contains(lowerQuery);
    }

    // ---- Admin ----

    @Transactional(readOnly = true)
    public PageResult<AdminViews.Job> search(JobStatus status, String q, Pageable pageable) {
        String query = trim(q);
        Specification<JobPosting> spec = (root, cq, cb) -> {
            List<Predicate> where = new ArrayList<>();
            if (status != null) where.add(cb.equal(root.get("status"), status));
            if (!query.isEmpty()) {
                String like = likePattern(query);
                where.add(cb.or(
                        cb.like(cb.lower(root.get("title")), like, '\\'),
                        cb.like(cb.lower(root.get("department")), like, '\\'),
                        cb.like(cb.lower(root.get("location")), like, '\\')));
            }
            return cb.and(where.toArray(Predicate[]::new));
        };
        Page<JobPosting> page = jobs.findAll(spec, pageable);
        Map<Long, long[]> counts = counts(page.getContent().stream().map(JobPosting::getId).toList());
        return PageResult.of(page, j -> view(j, counts));
    }

    @Transactional(readOnly = true)
    public AdminViews.Job get(long id) {
        return view(find(id));
    }

    @Transactional
    public AdminViews.Job create(JobForm form) {
        JobPosting job = new JobPosting(uniqueSlug(form.title()));
        apply(form, job);
        if (form.status() != null) job.changeStatus(form.status());
        return view(jobs.save(job));
    }

    @Transactional
    public AdminViews.Job update(long id, JobForm form) {
        JobPosting job = find(id);
        apply(form, job);
        if (form.status() != null && form.status() != job.getStatus()) job.changeStatus(form.status());
        return view(job);
    }

    /** Publish, close, reopen or archive */
    @Transactional
    public AdminViews.Job changeStatus(long id, JobStatus status) {
        JobPosting job = find(id);
        if (status != job.getStatus()) job.changeStatus(status);
        return view(job);
    }

    /** A copy as a new DRAFT, with its own slug */
    @Transactional
    public AdminViews.Job duplicate(long id) {
        JobPosting source = find(id);
        JobPosting copy = new JobPosting(uniqueSlug(source.getTitle()));
        copy.setTitle(source.getTitle());
        copy.setBusiness(source.getBusiness());
        copy.setDepartment(source.getDepartment());
        copy.setLocation(source.getLocation());
        copy.setWorkMode(source.getWorkMode());
        copy.setEmploymentType(source.getEmploymentType());
        copy.setExperienceMinYears(source.getExperienceMinYears());
        copy.setExperienceMaxYears(source.getExperienceMaxYears());
        copy.setSalaryMin(source.getSalaryMin());
        copy.setSalaryMax(source.getSalaryMax());
        copy.setShowSalary(source.isShowSalary());
        copy.setOpenings(source.getOpenings());
        copy.setSummary(source.getSummary());
        copy.setDescription(source.getDescription());
        copy.setResponsibilities(source.getResponsibilities());
        copy.setRequirements(source.getRequirements());
        copy.setNiceToHave(source.getNiceToHave());
        copy.setBenefits(source.getBenefits());
        copy.setApplicationDeadline(source.getApplicationDeadline());
        return view(jobs.save(copy));
    }

    /** Only a draft nobody applied to; anything else is archived instead, so applications keep their job */
    @Transactional
    public void delete(long id) {
        JobPosting job = find(id);
        if (job.getStatus() != JobStatus.DRAFT || applications.countByJob(job) > 0) {
            throw new ApiProblem(HttpStatus.CONFLICT, "job", "Only drafts without applications can be deleted. Archive this job instead.");
        }
        jobs.delete(job);
    }

    private JobPosting find(long id) {
        return jobs.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No job " + id));
    }

    private AdminViews.Job view(JobPosting job) {
        return view(job, counts(List.of(job.getId())));
    }

    private static AdminViews.Job view(JobPosting job, Map<Long, long[]> counts) {
        long[] c = counts.getOrDefault(job.getId(), new long[2]);
        return AdminViews.Job.of(job, c[0], c[1]);
    }

    /** job id → [applications, NEW applications] */
    private Map<Long, long[]> counts(List<Long> ids) {
        Map<Long, long[]> out = new HashMap<>();
        if (ids.isEmpty()) return out;
        for (Object[] row : applications.countsByJob(ids)) {
            out.put((Long) row[0], new long[] {((Number) row[1]).longValue(), ((Number) row[2]).longValue()});
        }
        return out;
    }

    private static void apply(JobForm f, JobPosting j) {
        j.setTitle(trim(f.title()));
        j.setBusiness(f.business());
        j.setDepartment(blankToNull(f.department()));
        j.setLocation(trim(f.location()));
        j.setWorkMode(f.workMode());
        j.setEmploymentType(f.employmentType());
        j.setExperienceMinYears(f.experienceMinYears());
        j.setExperienceMaxYears(f.experienceMaxYears());
        j.setSalaryMin(f.salaryMin());
        j.setSalaryMax(f.salaryMax());
        j.setShowSalary(f.showSalary());
        j.setOpenings(f.openings());
        j.setSummary(trim(f.summary()));
        j.setDescription(trim(f.description()));
        j.setResponsibilities(items(f.responsibilities()));
        j.setRequirements(items(f.requirements()));
        j.setNiceToHave(items(f.niceToHave()));
        j.setBenefits(items(f.benefits()));
        j.setApplicationDeadline(f.applicationDeadline());
        j.touch();
    }

    private static List<String> items(List<String> list) {
        return list == null ? List.of() : list.stream().map(s -> trim(s)).filter(s -> !s.isEmpty()).toList();
    }

    private static String blankToNull(String s) {
        String t = trim(s);
        return t.isEmpty() ? null : t;
    }

    /** The title as a slug, with a short random suffix when it's taken */
    String uniqueSlug(String title) {
        String base = slugify(title);
        String slug = base;
        while (jobs.existsBySlug(slug)) slug = base + "-" + Integer.toString(1296 + random.nextInt(45360), 36);
        return slug;
    }

    /** "Site Engineer (Civil) – Lucknow" → "site-engineer-civil-lucknow" */
    static String slugify(String title) {
        String s = Normalizer.normalize(trim(title), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
        if (s.length() > 60) s = s.substring(0, 60).replaceAll("-$", "");
        return s.isEmpty() ? "job" : s;
    }

    /** Case-insensitive "contains" for LIKE, with % and _ in the input taken literally */
    static String likePattern(String query) {
        return "%" + query.toLowerCase(Locale.ROOT).replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_") + "%";
    }
}
