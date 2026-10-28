package com.rcolorsgroup.content;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Version;
import java.time.Instant;

/**
 * Columns every content table shares. The numeric id is internal; records that
 * appear in URLs or cross-references also carry a public string id or slug.
 */
@MappedSuperclass
public abstract class ContentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    /** Draft (false) or live (true); public endpoints only return live records */
    @Column(nullable = false)
    private boolean published = true;

    @Column(nullable = false)
    private int sortOrder;

    @Version
    @Column(nullable = false)
    private long version;

    /** Placeholder record imported from the seed files, to be replaced before launch */
    @Column(name = "is_sample", nullable = false)
    private boolean sample;

    @PrePersist
    void onCreate() {
        createdAt = updatedAt = Instant.now();
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }
    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
    public long getVersion() { return version; }
    public boolean isSample() { return sample; }
    public void setSample(boolean sample) { this.sample = sample; }
}
