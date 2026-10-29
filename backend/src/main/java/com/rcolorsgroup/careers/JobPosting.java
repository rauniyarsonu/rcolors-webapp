package com.rcolorsgroup.careers;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/** An open (or draft, closed, archived) position on /careers, managed in the admin panel */
@Entity
public class JobPosting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Public URL key, made from the title once and never changed, so shared links keep working */
    @Column(nullable = false, unique = true, length = 80)
    private String slug;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(length = 120)
    private String department;

    @Column(nullable = false, length = 120)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private WorkMode workMode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EmploymentType employmentType;

    private Integer experienceMinYears;
    private Integer experienceMaxYears;

    /** Annual, in rupees. Public only when showSalary is true */
    private Long salaryMin;
    private Long salaryMax;
    private boolean showSalary;

    private Integer openings;

    @Column(length = 300)
    private String summary;

    /** Plain text with line breaks, never HTML */
    @Column(length = 10000)
    private String description;

    @ElementCollection
    @CollectionTable(name = "job_posting_responsibility", joinColumns = @JoinColumn(name = "job_id"))
    @OrderColumn(name = "position")
    @Column(name = "item", length = 500)
    private List<String> responsibilities = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "job_posting_requirement", joinColumns = @JoinColumn(name = "job_id"))
    @OrderColumn(name = "position")
    @Column(name = "item", length = 500)
    private List<String> requirements = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "job_posting_nice_to_have", joinColumns = @JoinColumn(name = "job_id"))
    @OrderColumn(name = "position")
    @Column(name = "item", length = 500)
    private List<String> niceToHave = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "job_posting_benefit", joinColumns = @JoinColumn(name = "job_id"))
    @OrderColumn(name = "position")
    @Column(name = "item", length = 500)
    private List<String> benefits = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private JobStatus status = JobStatus.DRAFT;

    /** Last day to apply (inclusive); after it the job is closed publicly */
    private LocalDate applicationDeadline;

    /** First time the job went OPEN */
    private Instant publishedAt;
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    protected JobPosting() {}

    public JobPosting(String slug) {
        this.slug = slug;
    }

    /** OPEN and not past its deadline */
    public boolean acceptingApplications(LocalDate today) {
        return status == JobStatus.OPEN && (applicationDeadline == null || !applicationDeadline.isBefore(today));
    }

    public void changeStatus(JobStatus next) {
        if (next == JobStatus.OPEN && publishedAt == null) publishedAt = Instant.now();
        status = next;
        touch();
    }

    public void touch() {
        updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getSlug() { return slug; }
    public String getTitle() { return title; }
    public String getDepartment() { return department; }
    public String getLocation() { return location; }
    public WorkMode getWorkMode() { return workMode; }
    public EmploymentType getEmploymentType() { return employmentType; }
    public Integer getExperienceMinYears() { return experienceMinYears; }
    public Integer getExperienceMaxYears() { return experienceMaxYears; }
    public Long getSalaryMin() { return salaryMin; }
    public Long getSalaryMax() { return salaryMax; }
    public boolean isShowSalary() { return showSalary; }
    public Integer getOpenings() { return openings; }
    public String getSummary() { return summary; }
    public String getDescription() { return description; }
    public List<String> getResponsibilities() { return responsibilities; }
    public List<String> getRequirements() { return requirements; }
    public List<String> getNiceToHave() { return niceToHave; }
    public List<String> getBenefits() { return benefits; }
    public JobStatus getStatus() { return status; }
    public LocalDate getApplicationDeadline() { return applicationDeadline; }
    public Instant getPublishedAt() { return publishedAt; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    public void setTitle(String title) { this.title = title; }
    public void setDepartment(String department) { this.department = department; }
    public void setLocation(String location) { this.location = location; }
    public void setWorkMode(WorkMode workMode) { this.workMode = workMode; }
    public void setEmploymentType(EmploymentType employmentType) { this.employmentType = employmentType; }
    public void setExperienceMinYears(Integer years) { this.experienceMinYears = years; }
    public void setExperienceMaxYears(Integer years) { this.experienceMaxYears = years; }
    public void setSalaryMin(Long salaryMin) { this.salaryMin = salaryMin; }
    public void setSalaryMax(Long salaryMax) { this.salaryMax = salaryMax; }
    public void setShowSalary(boolean showSalary) { this.showSalary = showSalary; }
    public void setOpenings(Integer openings) { this.openings = openings; }
    public void setSummary(String summary) { this.summary = summary; }
    public void setDescription(String description) { this.description = description; }
    public void setResponsibilities(List<String> items) { replace(responsibilities, items); }
    public void setRequirements(List<String> items) { replace(requirements, items); }
    public void setNiceToHave(List<String> items) { replace(niceToHave, items); }
    public void setBenefits(List<String> items) { replace(benefits, items); }
    public void setApplicationDeadline(LocalDate deadline) { this.applicationDeadline = deadline; }

    private static void replace(List<String> list, List<String> items) {
        list.clear();
        list.addAll(items);
    }
}
