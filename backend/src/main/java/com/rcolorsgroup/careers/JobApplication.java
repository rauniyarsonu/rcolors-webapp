package com.rcolorsgroup.careers;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/** An application from /careers, for a job or (job == null) a general "send your CV" one */
@Entity
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id")
    private JobPosting job;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 200)
    private String email;

    @Column(nullable = false, length = 10)
    private String phone;

    @Column(length = 120)
    private String currentLocation;

    @Column(precision = 4, scale = 1)
    private BigDecimal totalExperienceYears;

    @Column(length = 120)
    private String currentCompany;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private NoticePeriod noticePeriod;

    /** Annual, in rupees */
    private Long expectedSalary;

    @Column(length = 300)
    private String linkedinUrl;

    @Column(length = 300)
    private String portfolioUrl;

    @Column(length = 3000)
    private String coverLetter;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true, optional = false)
    @JoinColumn(name = "resume_id", nullable = false)
    private ResumeFile resume;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ApplicationStatus status = ApplicationStatus.NEW;

    /** Admin-only */
    @Column(length = 5000)
    private String adminNotes;

    /** Agreed to the privacy notice on the form */
    private boolean consent;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("changedAt ASC, id ASC")
    private List<ApplicationStatusChange> history = new ArrayList<>();

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    protected JobApplication() {}

    public JobApplication(JobPosting job, String name, String email, String phone, String currentLocation,
            BigDecimal totalExperienceYears, String currentCompany, NoticePeriod noticePeriod, Long expectedSalary,
            String linkedinUrl, String portfolioUrl, String coverLetter, ResumeFile resume, boolean consent) {
        this.job = job;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.currentLocation = currentLocation;
        this.totalExperienceYears = totalExperienceYears;
        this.currentCompany = currentCompany;
        this.noticePeriod = noticePeriod;
        this.expectedSalary = expectedSalary;
        this.linkedinUrl = linkedinUrl;
        this.portfolioUrl = portfolioUrl;
        this.coverLetter = coverLetter;
        this.resume = resume;
        this.consent = consent;
    }

    /** Moves to `next` and records it in the history; no-op when the status is unchanged */
    public void changeStatus(ApplicationStatus next, String note) {
        if (next == status) return;
        history.add(new ApplicationStatusChange(this, status, next, note));
        status = next;
        touch();
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
        touch();
    }

    private void touch() {
        updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public JobPosting getJob() { return job; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getCurrentLocation() { return currentLocation; }
    public BigDecimal getTotalExperienceYears() { return totalExperienceYears; }
    public String getCurrentCompany() { return currentCompany; }
    public NoticePeriod getNoticePeriod() { return noticePeriod; }
    public Long getExpectedSalary() { return expectedSalary; }
    public String getLinkedinUrl() { return linkedinUrl; }
    public String getPortfolioUrl() { return portfolioUrl; }
    public String getCoverLetter() { return coverLetter; }
    public ResumeFile getResume() { return resume; }
    public ApplicationStatus getStatus() { return status; }
    public String getAdminNotes() { return adminNotes; }
    public boolean isConsent() { return consent; }
    public List<ApplicationStatusChange> getHistory() { return history; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
