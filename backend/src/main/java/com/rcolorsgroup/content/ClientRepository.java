package com.rcolorsgroup.content;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByPublishedTrueOrderBySortOrderAscIdAsc();

    boolean existsBySlug(String slug);
}
