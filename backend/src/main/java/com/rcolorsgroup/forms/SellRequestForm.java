package com.rcolorsgroup.forms;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Fields posted by frontend/src/components/estate/SellForm.tsx; same rules as its validate() */
public record SellRequestForm(
        @NotBlank @Size(min = 2, max = 120) String name,
        @NotBlank @Pattern(regexp = FormRules.INDIAN_MOBILE, message = "must be a 10-digit Indian mobile number") String phone,
        /* Optional */
        @Size(max = 200) @Pattern(regexp = "|" + FormRules.EMAIL, message = "must be a valid email address") String email,
        /* Keys of PROPERTY_TYPES in frontend/src/config/estate/catalog.ts */
        @NotBlank @Pattern(regexp = FormRules.PROPERTY_TYPE, message = "unknown property type") String propertyType,
        @NotBlank @Size(min = 3, max = 300) String location,
        @Size(max = 120) String area,
        @Size(max = 120) String price,
        @Size(max = 5000) String message,
        @Size(max = 120) String city,
        @Size(max = 2000) String page) {}
