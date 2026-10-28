package com.rcolorsgroup.content;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HomeStatRepository extends JpaRepository<HomeStat, Long> {
    List<HomeStat> findByPublishedTrueOrderBySortOrderAscIdAsc();
}
