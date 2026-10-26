package com.rcolorsgroup.careers;

/**
 * Where résumé bytes are kept. Metadata stays in ResumeFile; an implementation
 * only stores bytes under a key it chooses. DatabaseResumeStorage is the default
 * (the Docker container's disk is wiped on redeploy, PostgreSQL is not); an S3 or
 * disk implementation can replace it without touching anything else.
 */
public interface ResumeStorage {
    /** Stores the file and returns the key to read it back with */
    String save(byte[] data);

    byte[] load(String key);

    void delete(String key);
}
