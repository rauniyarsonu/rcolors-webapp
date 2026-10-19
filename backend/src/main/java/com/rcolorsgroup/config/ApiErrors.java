package com.rcolorsgroup.config;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/** 400 with one message per invalid field, e.g. {"errors": {"phone": "must be ..."}} */
@RestControllerAdvice
public class ApiErrors {
    @ExceptionHandler(BindException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> invalid(BindException e) {
        Map<String, String> errors = new LinkedHashMap<>();
        e.getFieldErrors().forEach(f -> errors.putIfAbsent(f.getField(), f.getDefaultMessage()));
        return Map.of("errors", errors);
    }
}
