package com.rcolorsgroup.content;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioProjectRepository extends JpaRepository<PortfolioProject, Long> {
    List<PortfolioProject> findByPublishedTrueOrderBySortOrderAscIdAsc();

    Optional<PortfolioProject> findBySlugAndPublishedTrue(String slug);

    boolean existsBySlug(String slug);
}
