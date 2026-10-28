package com.rcolorsgroup.content;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import java.util.ArrayList;
import java.util.List;

/** A portfolio project of one of the three businesses (frontend type: PortfolioProject) */
@Entity
public class PortfolioProject extends ContentEntity {
    @Column(nullable = false, unique = true, length = 120)
    private String slug;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 200)
    private String location = "";

    /** construction | r-colors | estate */
    @Column(nullable = false, length = 40)
    private String business;

    @Column(nullable = false, length = 60)
    private String category = "";

    @Column(nullable = false, length = 60)
    private String status = "";

    @Column(nullable = false, length = 1000)
    private String coverImage = "";

    @Convert(converter = JsonConverters.StringList.class)
    @Column(nullable = false, length = 20000)
    private List<String> gallery = new ArrayList<>();

    @Column(nullable = false, length = 5000)
    private String description = "";

    @Column(name = "project_year")
    private Integer year;

    @Column(nullable = false)
    private boolean featured;

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getBusiness() { return business; }
    public void setBusiness(String business) { this.business = business; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }
    public List<String> getGallery() { return gallery; }
    public void setGallery(List<String> gallery) { this.gallery = gallery; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
}
