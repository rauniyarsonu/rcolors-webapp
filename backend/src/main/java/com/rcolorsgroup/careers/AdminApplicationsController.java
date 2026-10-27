package com.rcolorsgroup.careers;

import com.rcolorsgroup.config.PageResult;
import jakarta.validation.Valid;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.CacheControl;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Admin: applications, résumé downloads, CSV export and the dashboard summary (JWT required) */
@RestController
@RequestMapping("/api/admin")
public class AdminApplicationsController {
    private final ApplicationService applications;

    public AdminApplicationsController(ApplicationService applications) {
        this.applications = applications;
    }

    /** sort: newest (default) or oldest */
    @GetMapping("/applications")
    public PageResult<AdminViews.ApplicationRow> list(
            @RequestParam(required = false) String jobId,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "newest") String sort) {
        Sort order = Sort.by("oldest".equals(sort) ? Sort.Direction.ASC : Sort.Direction.DESC, "createdAt").and(Sort.by("id"));
        return applications.search(new ApplicationService.Filter(jobId, status, q, from, to),
                AdminJobsController.pageRequest(page, size, order));
    }

    @GetMapping("/applications/{id}")
    public AdminViews.ApplicationDetail get(@PathVariable long id) {
        return applications.detail(id);
    }

    @PatchMapping("/applications/{id}")
    public AdminViews.ApplicationDetail update(@PathVariable long id, @Valid @RequestBody AdminViews.ApplicationUpdate body) {
        return applications.update(id, body);
    }

    /** Always a download (never rendered inline), and never cached */
    @GetMapping("/applications/{id}/resume")
    public ResponseEntity<byte[]> resume(@PathVariable long id) {
        ApplicationService.Download file = applications.resume(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(file.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(file.filename(), StandardCharsets.UTF_8).build().toString())
                .header("X-Content-Type-Options", "nosniff")
                .cacheControl(CacheControl.noStore())
                .body(file.data());
    }

    /** Same filters as the list, so the export matches what the admin sees */
    @GetMapping("/applications/export.csv")
    public ResponseEntity<byte[]> export(
            @RequestParam(required = false) String jobId,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        String csv = applications.exportCsv(new ApplicationService.Filter(jobId, status, q, from, to));
        return ResponseEntity.ok()
                .contentType(new MediaType("text", "csv", StandardCharsets.UTF_8))
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename("applications-" + Careers.today() + ".csv").build().toString())
                .cacheControl(CacheControl.noStore())
                .body(csv.getBytes(StandardCharsets.UTF_8));
    }

    @DeleteMapping("/applications/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable long id) {
        applications.delete(id);
    }

    @GetMapping("/careers/summary")
    public AdminViews.Summary summary() {
        return applications.summary();
    }
}
