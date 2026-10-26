package com.rcolorsgroup.estate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.rcolorsgroup.content.ContentEntity;
import com.rcolorsgroup.content.JsonConverters;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/** A land or built-property listing (PropertySchema in frontend/src/lib/estate/schema.ts) */
@Entity
public class Property extends ContentEntity {
    @Column(nullable = false, unique = true, length = 120)
    private String publicId;

    @Column(nullable = false, length = 120)
    private String citySlug;

    @Column(nullable = false, length = 120)
    private String locationSlug;

    @Column(nullable = false, length = 300)
    private String title;

    /** land | property */
    @Column(nullable = false, length = 20)
    private String category;

    @Column(name = "property_type", nullable = false, length = 40)
    private String type;

    /** Rupees */
    @Column(nullable = false)
    private double price;

    /** total (default when null) | per-area */
    @Column(length = 20)
    private String priceUnit;

    @Column(nullable = false)
    private double areaValue;

    @Column(nullable = false, length = 20)
    private String areaUnit;

    @Column(nullable = false, length = 40)
    private String status;

    @Convert(converter = JsonConverters.StringList.class)
    @Column(nullable = false, length = 20000)
    private List<String> images = new ArrayList<>();

    @Column(nullable = false)
    private boolean verified;

    private LocalDate verifiedOn;

    @Column(nullable = false, length = 5000)
    private String description = "";

    @Column(nullable = false)
    private LocalDate postedAt;

    @Column(nullable = false)
    private boolean featured;

    /** Public id of an agent in the same city */
    @Column(length = 120)
    private String agentId;

    /** Public id of an estate project in the same city */
    @Column(length = 120)
    private String projectId;

    /** Land or built-property details (PropertyAttributesSchema) */
    @Convert(converter = JsonConverters.Json.class)
    @Column(nullable = false, length = 4000)
    private JsonNode attributes = JsonNodeFactory.instance.objectNode();

    public String getPublicId() { return publicId; }
    public void setPublicId(String publicId) { this.publicId = publicId; }
    public String getCitySlug() { return citySlug; }
    public void setCitySlug(String citySlug) { this.citySlug = citySlug; }
    public String getLocationSlug() { return locationSlug; }
    public void setLocationSlug(String locationSlug) { this.locationSlug = locationSlug; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getPriceUnit() { return priceUnit; }
    public void setPriceUnit(String priceUnit) { this.priceUnit = priceUnit; }
    public double getAreaValue() { return areaValue; }
    public void setAreaValue(double areaValue) { this.areaValue = areaValue; }
    public String getAreaUnit() { return areaUnit; }
    public void setAreaUnit(String areaUnit) { this.areaUnit = areaUnit; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
    public LocalDate getVerifiedOn() { return verifiedOn; }
    public void setVerifiedOn(LocalDate verifiedOn) { this.verifiedOn = verifiedOn; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getPostedAt() { return postedAt; }
    public void setPostedAt(LocalDate postedAt) { this.postedAt = postedAt; }
    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
    public String getAgentId() { return agentId; }
    public void setAgentId(String agentId) { this.agentId = agentId; }
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public JsonNode getAttributes() { return attributes; }
    public void setAttributes(JsonNode attributes) { this.attributes = attributes; }
}
