package com.rcolorsgroup.careers;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.Instant;

/** One status change of an application (the audit trail in the admin detail view) */
@Entity
public class ApplicationStatusChange {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "application_id", nullable = false)
    private JobApplication application;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ApplicationStatus fromStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ApplicationStatus toStatus;

    @Column(length = 500)
    private String note;

    private Instant changedAt = Instant.now();

    protected ApplicationStatusChange() {}

    ApplicationStatusChange(JobApplication application, ApplicationStatus fromStatus, ApplicationStatus toStatus, String note) {
        this.application = application;
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
        this.note = note;
    }

    public Long getId() { return id; }
    public ApplicationStatus getFromStatus() { return fromStatus; }
    public ApplicationStatus getToStatus() { return toStatus; }
    public String getNote() { return note; }
    public Instant getChangedAt() { return changedAt; }
}
