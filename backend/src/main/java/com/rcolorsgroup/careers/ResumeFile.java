package com.rcolorsgroup.careers;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.Instant;

/**
 * A résumé's metadata. The bytes are kept by ResumeStorage under storageKey, so
 * loading applications never loads files (a lazy @Lob would need bytecode enhancement).
 */
@Entity
public class ResumeFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Sanitised: letters, digits, dot, dash, underscore and space only */
    @Column(nullable = false, length = 120)
    private String originalFilename;

    @Column(nullable = false, length = 100)
    private String contentType;

    private long sizeBytes;

    @Column(nullable = false, length = 64)
    private String sha256;

    @Column(nullable = false, length = 200)
    private String storageKey;

    private Instant createdAt = Instant.now();

    protected ResumeFile() {}

    public ResumeFile(String originalFilename, String contentType, long sizeBytes, String sha256, String storageKey) {
        this.originalFilename = originalFilename;
        this.contentType = contentType;
        this.sizeBytes = sizeBytes;
        this.sha256 = sha256;
        this.storageKey = storageKey;
    }

    public Long getId() { return id; }
    public String getOriginalFilename() { return originalFilename; }
    public String getContentType() { return contentType; }
    public long getSizeBytes() { return sizeBytes; }
    public String getSha256() { return sha256; }
    public String getStorageKey() { return storageKey; }
    public Instant getCreatedAt() { return createdAt; }
}
