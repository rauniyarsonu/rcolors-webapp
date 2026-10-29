package com.rcolorsgroup.careers;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/** Responses of the admin careers API (frontend: lib/careers/types.ts) */
public final class AdminViews {
    private AdminViews() {}

    public record Job(
            Long id, String slug, String title, String department, String location,
            WorkMode workMode, EmploymentType employmentType, Integer experienceMinYears, Integer experienceMaxYears,
            Long salaryMin, Long salaryMax, boolean showSalary, Integer openings, String summary, String description,
            List<String> responsibilities, List<String> requirements, List<String> niceToHave, List<String> benefits,
            JobStatus status, LocalDate applicationDeadline, boolean acceptingApplications,
            Instant publishedAt, Instant createdAt, Instant updatedAt,
            long applicationCount, long newApplicationCount) {

        static Job of(JobPosting j, long applications, long newApplications) {
            return new Job(j.getId(), j.getSlug(), j.getTitle(), j.getDepartment(), j.getLocation(),
                    j.getWorkMode(), j.getEmploymentType(), j.getExperienceMinYears(), j.getExperienceMaxYears(),
                    j.getSalaryMin(), j.getSalaryMax(), j.isShowSalary(), j.getOpenings(), j.getSummary(), j.getDescription(),
                    List.copyOf(j.getResponsibilities()), List.copyOf(j.getRequirements()),
                    List.copyOf(j.getNiceToHave()), List.copyOf(j.getBenefits()),
                    j.getStatus(), j.getApplicationDeadline(), j.acceptingApplications(Careers.today()),
                    j.getPublishedAt(), j.getCreatedAt(), j.getUpdatedAt(), applications, newApplications);
        }
    }

    /** The job an application belongs to (null for a general application) */
    public record JobRef(Long id, String slug, String title) {
        static JobRef of(JobPosting j) {
            return j == null ? null : new JobRef(j.getId(), j.getSlug(), j.getTitle());
        }
    }

    /** A row in the applications table */
    public record ApplicationRow(
            Long id, JobRef job, String name, String email, String phone, String currentLocation,
            BigDecimal totalExperienceYears, ApplicationStatus status, Instant createdAt) {

        static ApplicationRow of(JobApplication a) {
            return new ApplicationRow(a.getId(), JobRef.of(a.getJob()), a.getName(), a.getEmail(), a.getPhone(),
                    a.getCurrentLocation(), a.getTotalExperienceYears(), a.getStatus(), a.getCreatedAt());
        }
    }

    public record Resume(String filename, String contentType, long sizeBytes) {}

    public record StatusChange(ApplicationStatus fromStatus, ApplicationStatus toStatus, String note, Instant changedAt) {}

    public record ApplicationDetail(
            Long id, JobRef job, String name, String email, String phone, String currentLocation,
            BigDecimal totalExperienceYears, String currentCompany, NoticePeriod noticePeriod, Long expectedSalary,
            String linkedinUrl, String portfolioUrl, String coverLetter, Resume resume,
            ApplicationStatus status, String adminNotes, boolean consent,
            List<StatusChange> history, Instant createdAt, Instant updatedAt) {

        static ApplicationDetail of(JobApplication a) {
            ResumeFile r = a.getResume();
            return new ApplicationDetail(a.getId(), JobRef.of(a.getJob()), a.getName(), a.getEmail(), a.getPhone(),
                    a.getCurrentLocation(), a.getTotalExperienceYears(), a.getCurrentCompany(), a.getNoticePeriod(),
                    a.getExpectedSalary(), a.getLinkedinUrl(), a.getPortfolioUrl(), a.getCoverLetter(),
                    new Resume(r.getOriginalFilename(), r.getContentType(), r.getSizeBytes()),
                    a.getStatus(), a.getAdminNotes(), a.isConsent(),
                    a.getHistory().stream().map(h -> new StatusChange(h.getFromStatus(), h.getToStatus(), h.getNote(), h.getChangedAt())).toList(),
                    a.getCreatedAt(), a.getUpdatedAt());
        }
    }

    /** PATCH /api/admin/applications/{id}: every field optional */
    public record ApplicationUpdate(
            ApplicationStatus status,
            @Size(max = 5000) String adminNotes,
            /* Recorded with the status change */
            @Size(max = 500) String note) {}

    public record StatusUpdate(@NotNull JobStatus status) {}

    public record Summary(
            long openJobs, long applicationsLast7Days, long applicationsLast30Days, long totalApplications,
            Map<ApplicationStatus, Long> byStatus) {}
}
