package com.rcolorsgroup.careers;

import java.util.UUID;
import org.springframework.stereotype.Component;

/** Keeps résumés in the application database (resume_blob table) */
@Component
public class DatabaseResumeStorage implements ResumeStorage {
    private final ResumeBlobRepository blobs;

    public DatabaseResumeStorage(ResumeBlobRepository blobs) {
        this.blobs = blobs;
    }

    @Override
    public String save(byte[] data) {
        return blobs.save(new ResumeBlob(UUID.randomUUID().toString(), data)).getId();
    }

    @Override
    public byte[] load(String key) {
        return blobs.findById(key).map(ResumeBlob::getData)
                .orElseThrow(() -> new IllegalStateException("Résumé " + key + " is missing from storage"));
    }

    @Override
    public void delete(String key) {
        blobs.deleteById(key);
    }
}
