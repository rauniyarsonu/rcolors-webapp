package com.rcolorsgroup.content;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteSettingsRepository extends JpaRepository<SiteSettings, Long> {
    /** The single settings row */
    Optional<SiteSettings> findFirstByOrderByIdAsc();
}
