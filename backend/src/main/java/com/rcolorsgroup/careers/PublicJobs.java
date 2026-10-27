package com.rcolorsgroup.careers;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

/**
 * What the public careers pages see (frontend: lib/careers/types.ts). No admin
 * fields; salary only when the admin chose to show it.
 */
public final class PublicJobs {
    private PublicJobs() {}

    /** A card on /careers */
    public record Summary(
            String slug, String title, Business business, String department, String location,
            WorkMode workMode, EmploymentType employmentType, Integer experienceMinYears, Integer experienceMaxYears,
            Long salaryMin, Long salaryMax, Integer openings, String summary,
            LocalDate applicationDeadline, Instant publishedAt) {

        static Summary of(JobPosting j) {
            return new Summary(j.getSlug(), j.getTitle(), j.getBusiness(), j.getDepartment(), j.getLocation(),
                    j.getWorkMode(), j.getEmploymentType(), j.getExperienceMinYears(), j.getExperienceMaxYears(),
                    j.isShowSalary() ? j.getSalaryMin() : null, j.isShowSalary() ? j.getSalaryMax() : null,
                    j.getOpenings(), j.getSummary(), j.getApplicationDeadline(), j.getPublishedAt());
        }
    }

    /** /careers/{slug}; a closed or expired job still renders, with acceptingApplications false */
    public record Detail(
            String slug, String title, Business business, String department, String location,
            WorkMode workMode, EmploymentType employmentType, Integer experienceMinYears, Integer experienceMaxYears,
            Long salaryMin, Long salaryMax, Integer openings, String summary,
            LocalDate applicationDeadline, Instant publishedAt, Instant updatedAt,
            String description, List<String> responsibilities, List<String> requirements,
            List<String> niceToHave, List<String> benefits, boolean acceptingApplications) {

        static Detail of(JobPosting j, LocalDate today) {
            return new Detail(j.getSlug(), j.getTitle(), j.getBusiness(), j.getDepartment(), j.getLocation(),
                    j.getWorkMode(), j.getEmploymentType(), j.getExperienceMinYears(), j.getExperienceMaxYears(),
                    j.isShowSalary() ? j.getSalaryMin() : null, j.isShowSalary() ? j.getSalaryMax() : null,
                    j.getOpenings(), j.getSummary(), j.getApplicationDeadline(), j.getPublishedAt(), j.getUpdatedAt(),
                    j.getDescription(), List.copyOf(j.getResponsibilities()), List.copyOf(j.getRequirements()),
                    List.copyOf(j.getNiceToHave()), List.copyOf(j.getBenefits()), j.acceptingApplications(today));
        }
    }

    /** Options for the /careers filter dropdowns: only values some open job has */
    public record Filters(List<Business> businesses, List<String> locations, List<EmploymentType> employmentTypes) {}
}
