package com.rcolorsgroup.careers;

import java.time.LocalDate;
import java.util.List;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/** Two sample DRAFT jobs for local development (SPRING_PROFILES_ACTIVE=dev); never runs in prod */
@Component
@Profile("dev")
public class CareersDevData implements ApplicationRunner {
    private final JobService jobs;
    private final JobPostingRepository repository;

    public CareersDevData(JobService jobs, JobPostingRepository repository) {
        this.jobs = jobs;
        this.repository = repository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (repository.count() > 0) return;
        jobs.create(new JobForm("[SAMPLE] Site Engineer (Civil)", "Site Engineering", "Lucknow, UP",
                WorkMode.ON_SITE, EmploymentType.FULL_TIME, 2, 5, 360000L, 540000L, true, 2,
                "Supervise residential and commercial sites from foundation to handover.",
                "You will run day-to-day work on one of our Lucknow sites.\n\nThis is a sample job created by the dev profile.",
                List.of("Plan and supervise daily site work", "Check quality of materials and workmanship", "Keep daily progress reports"),
                List.of("B.Tech / Diploma in Civil Engineering", "2+ years of site experience"),
                List.of("AutoCAD", "Experience with G+3 or larger buildings"),
                List.of("Site travel allowance", "Paid leave"),
                LocalDate.now().plusDays(30), JobStatus.DRAFT));
        jobs.create(new JobForm("[SAMPLE] Sales Executive — Real Estate", "Sales", "Lucknow, UP",
                WorkMode.HYBRID, EmploymentType.FULL_TIME, 1, null, null, null, false, 1,
                "Help buyers find the right plot or home across our Lucknow projects.",
                "Meet walk-in and referred buyers, run site visits and follow up until booking.\n\nThis is a sample job created by the dev profile.",
                List.of("Run site visits", "Follow up enquiries from the website"),
                List.of("1+ year in sales", "Good Hindi and English"),
                List.of(), List.of("Incentives on every booking"),
                null, JobStatus.DRAFT));
    }
}
