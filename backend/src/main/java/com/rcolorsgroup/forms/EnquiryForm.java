package com.rcolorsgroup.forms;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Fields posted by frontend/src/components/estate/EnquiryForm.tsx; same rules as its validate() */
public record EnquiryForm(
        @NotBlank @Size(min = 2, max = 120) String name,
        @NotBlank @Pattern(regexp = FormRules.INDIAN_MOBILE, message = "must be a 10-digit Indian mobile number") String phone,
        /* Optional */
        @Size(max = 200) @Pattern(regexp = "|" + FormRules.EMAIL, message = "must be a valid email address") String email,
        @NotBlank @Pattern(regexp = "plot|ready|commercial|investment|partnership", message = "unknown interest") String interest,
        @Size(max = 5000) String message,
        @Size(max = 500) String listing,
        @Size(max = 120) String city,
        @Size(max = 2000) String page) {}
