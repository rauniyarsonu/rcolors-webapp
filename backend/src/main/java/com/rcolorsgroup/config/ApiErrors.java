package com.rcolorsgroup.config;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

/** 400 with one message per invalid field, e.g. {"errors": {"phone": "must be ..."}} */
@RestControllerAdvice
public class ApiErrors {
    @ExceptionHandler(BindException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> invalid(BindException e) {
        Map<String, String> errors = new LinkedHashMap<>();
        // A value that couldn't be converted (e.g. "abc" for a number) gets a readable message, not the converter's
        e.getFieldErrors().forEach(f -> errors.putIfAbsent(f.getField(), f.isBindingFailure() ? "is not a valid value" : f.getDefaultMessage()));
        return Map.of("errors", errors);
    }

    /** Any status with the same {"errors": {...}} body (409 conflicts, 429 rate limits, ...) */
    @ExceptionHandler(ApiProblem.class)
    public ResponseEntity<Map<String, Object>> problem(ApiProblem e) {
        return ResponseEntity.status(e.status()).body(Map.of("errors", e.errors()));
    }

    /** An upload over spring.servlet.multipart.max-file-size (the only upload is a résumé) */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> tooLarge(MaxUploadSizeExceededException e) {
        return Map.of("errors", Map.of("resume", "must be 5 MB or smaller"));
    }
}
