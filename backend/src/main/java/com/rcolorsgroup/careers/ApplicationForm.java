package com.rcolorsgroup.careers;

import com.rcolorsgroup.forms.FormRules;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

/**
 * Fields posted (multipart, with the "resume" file) by
 * frontend/src/components/careers/ApplicationForm.tsx; same rules as its schema.
 */
public record ApplicationForm(
        @NotBlank @Size(min = 2, max = 120) String name,
        @NotBlank @Size(max = 200) @Pattern(regexp = FormRules.EMAIL, message = "must be a valid email address") String email,
        @NotBlank @Pattern(regexp = FormRules.INDIAN_MOBILE, message = "must be a 10-digit Indian mobile number") String phone,
        @NotBlank @Size(max = 120) String currentLocation,
        @NotNull @DecimalMin("0") @DecimalMax("60") @Digits(integer = 2, fraction = 1) BigDecimal totalExperienceYears,
        /* Optional from here, except consent */
        @Size(max = 120) String currentCompany,
        @NotNull NoticePeriod noticePeriod,
        @PositiveOrZero @Max(1_000_000_000) Long expectedSalary,
        @Size(max = 300) @Pattern(regexp = "|" + FormRules.HTTP_URL, message = "must be a link starting with https://") String linkedinUrl,
        @Size(max = 300) @Pattern(regexp = "|" + FormRules.HTTP_URL, message = "must be a link starting with https://") String portfolioUrl,
        @Size(max = 3000) String coverLetter,
        @NotNull(message = "Please agree so we can consider your application")
        @AssertTrue(message = "Please agree so we can consider your application") Boolean consent,
        /* Honeypot: hidden on the form, only bots fill it */
        String website) {}
