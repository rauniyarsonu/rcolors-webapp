package com.rcolorsgroup.content;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusinessServiceRepository extends JpaRepository<BusinessService, Long> {
    List<BusinessService> findByBusinessKeyAndPublishedTrueOrderBySortOrderAscIdAsc(String businessKey);
}
