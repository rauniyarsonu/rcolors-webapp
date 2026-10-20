package com.rcolorsgroup.forms;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Fields posted by frontend/src/components/contact/ContactForm.tsx; same rules as its validate() */
public record ContactForm(
        @NotBlank @Size(min = 2, max = 120) String name,
        @NotBlank @Pattern(regexp = FormRules.INDIAN_MOBILE, message = "must be a 10-digit Indian mobile number") String phone,
        @NotBlank @Size(max = 200) @Pattern(regexp = FormRules.EMAIL, message = "must be a valid email address") String email,
        @NotBlank @Pattern(regexp = "general|construction|r-colors|estate", message = "unknown business") String business,
        @NotBlank @Size(min = 5, max = 5000) String message) {}
