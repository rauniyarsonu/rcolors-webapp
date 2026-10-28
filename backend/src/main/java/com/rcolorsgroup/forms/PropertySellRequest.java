package com.rcolorsgroup.forms;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.Instant;

/** A "Sell Your Property" registration from the estate portal */
@Entity
public class PropertySellRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String phone;
    private String email;
    private String propertyType;

    /** Locality, village or address as typed by the owner */
    @Column(length = 300)
    private String location;

    /** Free text, e.g. "1200 sq ft" or "2 bigha" */
    private String area;

    /** Expected price, free text, e.g. "45 lakh" */
    private String price;

    @Column(length = 5000)
    private String message;

    private String city;

    /** URL of the page the form was sent from */
    @Column(length = 2000)
    private String page;

    private Instant createdAt = Instant.now();

    protected PropertySellRequest() {}

    public PropertySellRequest(String name, String phone, String email, String propertyType, String location,
            String area, String price, String message, String city, String page) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.propertyType = propertyType;
        this.location = location;
        this.area = area;
        this.price = price;
        this.message = message;
        this.city = city;
        this.page = page;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public String getEmail() { return email; }
    public String getPropertyType() { return propertyType; }
    public String getLocation() { return location; }
    public String getArea() { return area; }
    public String getPrice() { return price; }
    public String getMessage() { return message; }
    public String getCity() { return city; }
    public String getPage() { return page; }
    public Instant getCreatedAt() { return createdAt; }
}
