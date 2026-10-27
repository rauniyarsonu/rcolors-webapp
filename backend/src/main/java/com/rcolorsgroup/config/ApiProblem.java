package com.rcolorsgroup.config;

import java.util.Map;
import org.springframework.http.HttpStatus;

/** An error answered as {"errors": {"field": "message"}} with any status (409, 429, ...); see ApiErrors */
public class ApiProblem extends RuntimeException {
    private final HttpStatus status;
    private final Map<String, String> errors;

    public ApiProblem(HttpStatus status, String field, String message) {
        super(message);
        this.status = status;
        this.errors = Map.of(field, message);
    }

    public HttpStatus status() { return status; }
    public Map<String, String> errors() { return errors; }
}
