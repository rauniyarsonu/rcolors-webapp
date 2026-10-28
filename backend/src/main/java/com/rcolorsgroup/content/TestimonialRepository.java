package com.rcolorsgroup.content;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestimonialRepository extends JpaRepository<Testimonial, Long> {
    List<Testimonial> findByPublishedTrueOrderBySortOrderAscIdAsc();

    List<Testimonial> findByPublishedTrueAndBusinessOrderBySortOrderAscIdAsc(String business);
}
