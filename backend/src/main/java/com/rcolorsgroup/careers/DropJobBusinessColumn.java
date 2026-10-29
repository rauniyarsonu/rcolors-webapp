package com.rcolorsgroup.careers;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Jobs used to name one of the group's businesses; now every job is with R Colors Group.
 * ddl-auto=update never drops columns, and the old NOT NULL one would reject new jobs,
 * so drop it from databases made before. A no-op once it's gone (H2 and PostgreSQL).
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
class DropJobBusinessColumn implements ApplicationRunner {
    private final JdbcTemplate jdbc;

    DropJobBusinessColumn(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public void run(ApplicationArguments args) {
        jdbc.execute("ALTER TABLE job_posting DROP COLUMN IF EXISTS business");
    }
}
