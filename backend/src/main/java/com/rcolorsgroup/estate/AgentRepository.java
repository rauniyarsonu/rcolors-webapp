package com.rcolorsgroup.estate;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgentRepository extends JpaRepository<Agent, Long> {
    List<Agent> findByPublishedTrueOrderBySortOrderAscIdAsc();
}
