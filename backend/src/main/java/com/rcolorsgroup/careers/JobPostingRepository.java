package com.rcolorsgroup.careers;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface JobPostingRepository extends JpaRepository<JobPosting, Long>, JpaSpecificationExecutor<JobPosting> {
    Optional<JobPosting> findBySlug(String slug);

    boolean existsBySlug(String slug);

    List<JobPosting> findByStatusOrderByPublishedAtDesc(JobStatus status);
}
