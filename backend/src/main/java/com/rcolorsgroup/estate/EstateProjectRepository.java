package com.rcolorsgroup.estate;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EstateProjectRepository extends JpaRepository<EstateProject, Long> {
    List<EstateProject> findByPublishedTrueOrderBySortOrderAscIdAsc();
}
