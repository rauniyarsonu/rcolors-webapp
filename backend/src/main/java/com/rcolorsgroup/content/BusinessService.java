package com.rcolorsgroup.content;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import java.util.ArrayList;
import java.util.List;

/** A service card on a business page */
@Entity
public class BusinessService extends ContentEntity {
    @Column(name = "business_key", nullable = false, length = 40)
    private String businessKey;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 500)
    private String tagline;

    @Column(nullable = false, length = 5000)
    private String description;

    @Column(length = 200)
    private String scopeBadge;

    @Column(length = 1000)
    private String image;

    @Column(length = 300)
    private String imageAlt;

    @Convert(converter = JsonConverters.StringList.class)
    @Column(nullable = false, length = 4000)
    private List<String> capabilities = new ArrayList<>();

    @Column(length = 120)
    private String ctaText;

    @Column(length = 500)
    private String ctaHref;

    /** lucide icon name, for pages that show icons instead of photos */
    @Column(length = 60)
    private String icon;

    public String getBusinessKey() { return businessKey; }
    public void setBusinessKey(String businessKey) { this.businessKey = businessKey; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getScopeBadge() { return scopeBadge; }
    public void setScopeBadge(String scopeBadge) { this.scopeBadge = scopeBadge; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getImageAlt() { return imageAlt; }
    public void setImageAlt(String imageAlt) { this.imageAlt = imageAlt; }
    public List<String> getCapabilities() { return capabilities; }
    public void setCapabilities(List<String> capabilities) { this.capabilities = capabilities; }
    public String getCtaText() { return ctaText; }
    public void setCtaText(String ctaText) { this.ctaText = ctaText; }
    public String getCtaHref() { return ctaHref; }
    public void setCtaHref(String ctaHref) { this.ctaHref = ctaHref; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}
