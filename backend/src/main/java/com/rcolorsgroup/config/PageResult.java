package com.rcolorsgroup.config;

import java.util.List;
import java.util.function.Function;
import org.springframework.data.domain.Page;

/** One page of a list endpoint: {"items": [...], "page": 0, "size": 20, "total": 57, "totalPages": 3} */
public record PageResult<T>(List<T> items, int page, int size, long total, int totalPages) {
    public static <E, T> PageResult<T> of(Page<E> page, Function<E, T> map) {
        return new PageResult<>(page.getContent().stream().map(map).toList(),
                page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages());
    }
}
