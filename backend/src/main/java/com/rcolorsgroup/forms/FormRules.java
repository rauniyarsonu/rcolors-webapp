package com.rcolorsgroup.forms;

final class FormRules {
    /** 10-digit Indian mobile, already normalised by the frontend (no +91, spaces or leading 0) */
    static final String INDIAN_MOBILE = "[6-9]\\d{9}";
    static final String EMAIL = "[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}";

    private FormRules() {}

    static String trim(String s) {
        return s == null ? "" : s.trim();
    }
}
