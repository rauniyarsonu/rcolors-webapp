package com.rcolorsgroup.estate;

import com.rcolorsgroup.content.ContentEntity;
import com.rcolorsgroup.content.JsonConverters;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import java.util.ArrayList;
import java.util.List;

/** A developer project on the estate Projects tab (ProjectSchema in frontend/src/lib/estate/schema.ts) */
@Entity
public class EstateProject extends ContentEntity {
    @Column(nullable = false, unique = true, length = 120)
    private String publicId;

    @Column(nullable = false, length = 120)
    private String citySlug;

    @Column(nullable = false, length = 120)
    private String locationSlug;

    @Column(nullable = false, length = 300)
    private String name;

    @Column(nullable = false, length = 200)
    private String developer;

    @Column(name = "project_type", nullable = false, length = 40)
    private String type;

    @Column(nullable = false, length = 40)
    private String status;

    @Column(nullable = false)
    private double startingPrice;

    @Column(nullable = false, length = 200)
    private String sizeRange;

    @Convert(converter = JsonConverters.StringList.class)
    @Column(nullable = false, length = 20000)
    private List<String> images = new ArrayList<>();

    @Column(nullable = false, length = 5000)
    private String description = "";

    /** RERA registration number, only if real */
    @Column(length = 120)
    private String reraId;

    @Column(nullable = false)
    private boolean featured;

    public String getPublicId() { return publicId; }
    public void setPublicId(String publicId) { this.publicId = publicId; }
    public String getCitySlug() { return citySlug; }
    public void setCitySlug(String citySlug) { this.citySlug = citySlug; }
    public String getLocationSlug() { return locationSlug; }
    public void setLocationSlug(String locationSlug) { this.locationSlug = locationSlug; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDeveloper() { return developer; }
    public void setDeveloper(String developer) { this.developer = developer; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public double getStartingPrice() { return startingPrice; }
    public void setStartingPrice(double startingPrice) { this.startingPrice = startingPrice; }
    public String getSizeRange() { return sizeRange; }
    public void setSizeRange(String sizeRange) { this.sizeRange = sizeRange; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getReraId() { return reraId; }
    public void setReraId(String reraId) { this.reraId = reraId; }
    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
}
