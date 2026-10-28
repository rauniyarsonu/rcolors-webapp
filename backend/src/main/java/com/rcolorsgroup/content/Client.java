package com.rcolorsgroup.content;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

/** A client shown in the logo marquee and on /clients (frontend type: Client) */
@Entity
public class Client extends ContentEntity {
    @Column(nullable = false, unique = true, length = 120)
    private String slug;

    @Column(nullable = false, length = 200)
    private String name;

    /** Image path, or "" to show the name instead */
    @Column(nullable = false, length = 1000)
    private String logo = "";

    @Column(length = 1000)
    private String website;

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLogo() { return logo; }
    public void setLogo(String logo) { this.logo = logo; }
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
}
