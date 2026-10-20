package com.rcolorsgroup.forms;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.Instant;

/** A "Send Us A Message" submission from /contact */
@Entity
public class ContactMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String phone;
    private String email;
    private String business;

    @Column(length = 5000)
    private String message;

    private Instant createdAt = Instant.now();

    protected ContactMessage() {}

    public ContactMessage(String name, String phone, String email, String business, String message) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.business = business;
        this.message = message;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public String getEmail() { return email; }
    public String getBusiness() { return business; }
    public String getMessage() { return message; }
    public Instant getCreatedAt() { return createdAt; }
}
