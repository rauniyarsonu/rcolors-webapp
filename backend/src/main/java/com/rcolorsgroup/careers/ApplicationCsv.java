package com.rcolorsgroup.careers;

import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * The applications export (RFC 4180, UTF-8 with a BOM so Excel shows ₹ and Hindi
 * names correctly). Cells starting with = + - @ (or a tab/CR) get a leading ' so
 * a spreadsheet never runs them as formulas.
 */
final class ApplicationCsv {
    private static final DateTimeFormatter TIME = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").withZone(Careers.ZONE);
    private static final List<String> HEADER = List.of(
            "ID", "Submitted (IST)", "Job", "Status", "Name", "Email", "Phone", "Current location",
            "Experience (years)", "Current company", "Notice period", "Expected salary (₹/year)",
            "LinkedIn", "Portfolio", "Cover letter", "Résumé file", "Admin notes");

    private ApplicationCsv() {}

    static String write(List<JobApplication> rows) {
        StringBuilder out = new StringBuilder("﻿");
        line(out, HEADER);
        for (JobApplication a : rows) {
            line(out, List.of(
                    a.getId(), TIME.format(a.getCreatedAt()), a.getJob() == null ? "General application" : a.getJob().getTitle(),
                    a.getStatus(), a.getName(), a.getEmail(), a.getPhone(), nz(a.getCurrentLocation()),
                    nz(a.getTotalExperienceYears()), nz(a.getCurrentCompany()), noticePeriod(a.getNoticePeriod()), nz(a.getExpectedSalary()),
                    nz(a.getLinkedinUrl()), nz(a.getPortfolioUrl()), nz(a.getCoverLetter()),
                    a.getResume().getOriginalFilename(), nz(a.getAdminNotes())));
        }
        return out.toString();
    }

    /** DAYS_30 → "30 days" */
    private static String noticePeriod(NoticePeriod p) {
        if (p == null) return "";
        return p == NoticePeriod.IMMEDIATE ? "Immediate" : p.name().substring(5) + " days";
    }

    private static Object nz(Object value) {
        return value == null ? "" : value;
    }

    private static void line(StringBuilder out, List<?> cells) {
        for (int i = 0; i < cells.size(); i++) {
            if (i > 0) out.append(',');
            out.append(cell(cells.get(i)));
        }
        out.append("\r\n");
    }

    static String cell(Object value) {
        String s = String.valueOf(value);
        if (!s.isEmpty() && "=+-@\t\r".indexOf(s.charAt(0)) >= 0) s = "'" + s;
        if (s.indexOf(',') >= 0 || s.indexOf('"') >= 0 || s.indexOf('\n') >= 0 || s.indexOf('\r') >= 0) {
            s = '"' + s.replace("\"", "\"\"") + '"';
        }
        return s;
    }
}
