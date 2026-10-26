package com.rcolorsgroup.forms;

/** Validation rules shared by the site's forms (contact, estate enquiry, careers applications) */
public final class FormRules {
    /** 10-digit Indian mobile, already normalised by the frontend (no +91, spaces or leading 0) */
    public static final String INDIAN_MOBILE = "[6-9]\\d{9}";
    public static final String EMAIL = "[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}";
    /** An absolute http(s) URL, e.g. a LinkedIn profile */
    public static final String HTTP_URL = "https?://[^\\s/?#]+\\.[^\\s/?#]+\\S*";

    private FormRules() {}

    public static String trim(String s) {
        return s == null ? "" : s.trim();
    }
}
