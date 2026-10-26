package com.rcolorsgroup.careers;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long>, JpaSpecificationExecutor<JobApplication> {
    /** List rows show the job title, so fetch the job in the same query */
    @Override
    @EntityGraph(attributePaths = "job")
    Page<JobApplication> findAll(Specification<JobApplication> spec, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = "job")
    List<JobApplication> findAll(Specification<JobApplication> spec, Sort sort);

    boolean existsByJobAndEmailIgnoreCaseAndCreatedAtAfter(JobPosting job, String email, Instant after);

    boolean existsByJobIsNullAndEmailIgnoreCaseAndCreatedAtAfter(String email, Instant after);

    long countByJob(JobPosting job);

    long countByCreatedAtGreaterThanEqual(Instant since);

    /** [job id, total, NEW] per job */
    @Query("""
            select a.job.id, count(a), sum(case when a.status = com.rcolorsgroup.careers.ApplicationStatus.NEW then 1 else 0 end)
            from JobApplication a where a.job.id in :jobIds group by a.job.id""")
    List<Object[]> countsByJob(Collection<Long> jobIds);

    /** [status, count] */
    @Query("select a.status, count(a) from JobApplication a group by a.status")
    List<Object[]> countsByStatus();
}
