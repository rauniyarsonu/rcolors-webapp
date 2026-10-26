package com.rcolorsgroup.estate;

import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository extends JpaRepository<Location, Long> {
    /** Insertion order, which for seeded data is the order of locations.json */
    @EntityGraph(attributePaths = "parent")
    List<Location> findAllByOrderByIdAsc();
}
