package com.rcolorsgroup.careers;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

/** A job as the admin editor sends it (POST/PUT /api/admin/jobs, JSON) */
public record JobForm(
        @NotBlank @Size(max = 120) String title,
        @Size(max = 120) String department,
        @NotBlank @Size(max = 120) String location,
        @NotNull WorkMode workMode,
        @NotNull EmploymentType employmentType,
        @NotNull @Min(0) @Max(50) Integer experienceMinYears,
        @Min(0) @Max(50) Integer experienceMaxYears,
        @PositiveOrZero Long salaryMin,
        @PositiveOrZero Long salaryMax,
        boolean showSalary,
        @NotNull @Min(1) @Max(999) Integer openings,
        @NotBlank @Size(max = 300) String summary,
        @NotBlank @Size(max = 10000) String description,
        @Size(max = 30) List<@Size(max = 500) String> responsibilities,
        @Size(max = 30) List<@Size(max = 500) String> requirements,
        @Size(max = 30) List<@Size(max = 500) String> niceToHave,
        @Size(max = 30) List<@Size(max = 500) String> benefits,
        LocalDate applicationDeadline,
        /* Optional: DRAFT (default for a new job) or OPEN to publish on save */
        JobStatus status) {

    /** Rules that compare fields, added to the same 400 as the annotations */
    void checkRanges(BindingResult errors) {
        if (experienceMinYears != null && experienceMaxYears != null && experienceMaxYears < experienceMinYears) {
            reject(errors, "experienceMaxYears", "must be at least the minimum");
        }
        if (salaryMin != null && salaryMax != null && salaryMax < salaryMin) {
            reject(errors, "salaryMax", "must be at least the minimum");
        }
        if (showSalary && salaryMin == null && salaryMax == null) {
            reject(errors, "salaryMin", "enter a salary to show it");
        }
    }

    private static void reject(BindingResult errors, String field, String message) {
        errors.addError(new FieldError(errors.getObjectName(), field, message));
    }
}
