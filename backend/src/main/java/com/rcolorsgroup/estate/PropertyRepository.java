package com.rcolorsgroup.estate;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByPublishedTrueOrderBySortOrderAscIdAsc();
}
