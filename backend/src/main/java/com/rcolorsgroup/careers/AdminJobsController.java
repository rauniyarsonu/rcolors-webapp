package com.rcolorsgroup.careers;

import com.rcolorsgroup.config.PageResult;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Admin: job postings (JWT required, see auth/SecurityConfig) */
@RestController
@RequestMapping("/api/admin/jobs")
public class AdminJobsController {
    private final JobService jobs;

    public AdminJobsController(JobService jobs) {
        this.jobs = jobs;
    }

    @GetMapping
    public PageResult<AdminViews.Job> list(
            @RequestParam(required = false) JobStatus status,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return jobs.search(status, q, pageRequest(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
    }

    @GetMapping("/{id}")
    public AdminViews.Job get(@PathVariable long id) {
        return jobs.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AdminViews.Job create(@Valid @RequestBody JobForm form, BindingResult result) throws BindException {
        check(form, result);
        return jobs.create(form);
    }

    @PutMapping("/{id}")
    public AdminViews.Job update(@PathVariable long id, @Valid @RequestBody JobForm form, BindingResult result) throws BindException {
        check(form, result);
        return jobs.update(id, form);
    }

    /** Publish (OPEN), close, reopen or archive */
    @PatchMapping("/{id}/status")
    public AdminViews.Job status(@PathVariable long id, @Valid @RequestBody AdminViews.StatusUpdate body) {
        return jobs.changeStatus(id, body.status());
    }

    @PostMapping("/{id}/duplicate")
    @ResponseStatus(HttpStatus.CREATED)
    public AdminViews.Job duplicate(@PathVariable long id) {
        return jobs.duplicate(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable long id) {
        jobs.delete(id);
    }

    private static void check(JobForm form, BindingResult result) throws BindException {
        form.checkRanges(result);
        if (result.hasErrors()) throw new BindException(result);
    }

    static PageRequest pageRequest(int page, int size, Sort sort) {
        return PageRequest.of(Math.max(page, 0), Math.clamp(size, 1, 100), sort);
    }
}
