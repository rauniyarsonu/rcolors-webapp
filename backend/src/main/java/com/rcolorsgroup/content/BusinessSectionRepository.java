package com.rcolorsgroup.content;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusinessSectionRepository extends JpaRepository<BusinessSection, Long> {
    Optional<BusinessSection> findByKeyAndPublishedTrue(String key);
}
