package com.rcolorsgroup.careers;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

/** Résumé bytes for DatabaseResumeStorage: varbinary on H2, bytea on PostgreSQL */
@Entity
public class ResumeBlob {
    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = (int) ResumeRules.MAX_BYTES)
    private byte[] data;

    protected ResumeBlob() {}

    ResumeBlob(String id, byte[] data) {
        this.id = id;
        this.data = data;
    }

    public String getId() { return id; }
    public byte[] getData() { return data; }
}
