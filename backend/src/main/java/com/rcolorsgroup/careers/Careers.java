package com.rcolorsgroup.careers;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

/** Careers-wide constants: dates (deadlines, "last 7 days") are in Indian time */
final class Careers {
    static final ZoneId ZONE = ZoneId.of("Asia/Kolkata");

    private Careers() {}

    static LocalDate today() {
        return LocalDate.now(ZONE);
    }

    static Instant startOf(LocalDate day) {
        return day.atStartOfDay(ZONE).toInstant();
    }
}
