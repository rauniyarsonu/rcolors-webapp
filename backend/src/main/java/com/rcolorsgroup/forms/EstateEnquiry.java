package com.rcolorsgroup.forms;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.Instant;

/** An "Enquire About a Property" submission from the estate portal */
@Entity
public class EstateEnquiry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String phone;
    private String email;
    private String interest;

    @Column(length = 5000)
    private String message;

    /** Listing reference and title, when sent from a listing */
    @Column(length = 500)
    private String listing;

    private String city;

    /** URL of the page the form was sent from */
    @Column(length = 2000)
    private String page;

    private Instant createdAt = Instant.now();

    protected EstateEnquiry() {}

    public EstateEnquiry(String name, String phone, String email, String interest, String message, String listing, String city, String page) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.interest = interest;
        this.message = message;
        this.listing = listing;
        this.city = city;
        this.page = page;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public String getEmail() { return email; }
    public String getInterest() { return interest; }
    public String getMessage() { return message; }
    public String getListing() { return listing; }
    public String getCity() { return city; }
    public String getPage() { return page; }
    public Instant getCreatedAt() { return createdAt; }
}
