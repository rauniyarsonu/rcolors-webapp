package com.rcolorsgroup.content;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

/** One slide of the home page hero carousel */
@Entity
public class HeroSlide extends ContentEntity {
    @Column(nullable = false, length = 1000)
    private String image;

    /** Heading; also the image alt text */
    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 300)
    private String subtitle;

    /** Tailwind object-position class keeping the focal point in frame, e.g. object-[55%_50%] */
    @Column(name = "focal_position", length = 100)
    private String position;

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }
}
