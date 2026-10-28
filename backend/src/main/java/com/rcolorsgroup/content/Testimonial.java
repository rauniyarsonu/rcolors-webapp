package com.rcolorsgroup.content;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

/** Client feedback shown on the home page */
@Entity
public class Testimonial extends ContentEntity {
    @Column(nullable = false, length = 2000)
    private String quote;

    @Column(name = "client_name", nullable = false, length = 200)
    private String name;

    /** Designation or relationship, e.g. "Residential Client, Lucknow" */
    @Column(length = 200)
    private String role;

    @Column(length = 200)
    private String company;

    @Column(length = 120)
    private String city;

    /** construction | r-colors | estate | group */
    @Column(nullable = false, length = 40)
    private String business = "group";

    @Column(length = 1000)
    private String photo;

    /** 1 to 5, optional */
    private Integer rating;

    /** The client agreed to their words being published */
    @Column(nullable = false)
    private boolean permissionObtained;

    public String getQuote() { return quote; }
    public void setQuote(String quote) { this.quote = quote; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getBusiness() { return business; }
    public void setBusiness(String business) { this.business = business; }
    public String getPhoto() { return photo; }
    public void setPhoto(String photo) { this.photo = photo; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public boolean isPermissionObtained() { return permissionObtained; }
    public void setPermissionObtained(boolean permissionObtained) { this.permissionObtained = permissionObtained; }
}
