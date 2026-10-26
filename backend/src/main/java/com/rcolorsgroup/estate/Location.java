package com.rcolorsgroup.estate;

import com.rcolorsgroup.content.ContentEntity;
import com.rcolorsgroup.content.JsonConverters;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.util.List;

/**
 * A node of the estate location tree (state → district → city → town/locality/village).
 * sortOrder is the "order" field of LocationSchema in frontend/src/lib/estate/schema.ts.
 */
@Entity
public class Location extends ContentEntity {
    @Column(nullable = false, unique = true, length = 120)
    private String publicId;

    @Column(nullable = false, unique = true, length = 120)
    private String slug;

    @Column(nullable = false, length = 200)
    private String name;

    /** state | district | city | town | locality | village */
    @Column(name = "location_type", nullable = false, length = 20)
    private String type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Location parent;

    @Column(nullable = false)
    private boolean enabled;

    /** Slugs for "Show nearby"; null when not set */
    @Convert(converter = JsonConverters.StringList.class)
    @Column(length = 4000)
    private List<String> nearby;

    private Double lat;
    private Double lng;

    @Convert(converter = JsonConverters.StringList.class)
    @Column(length = 4000)
    private List<String> aliases;

    @Convert(converter = JsonConverters.StringList.class)
    @Column(length = 4000)
    private List<String> landmarks;

    @Column(nullable = false)
    private boolean trending;

    /** Suggested during development, not yet confirmed by the owner */
    @Column(nullable = false)
    private boolean toConfirm;

    public String getPublicId() { return publicId; }
    public void setPublicId(String publicId) { this.publicId = publicId; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Location getParent() { return parent; }
    public void setParent(Location parent) { this.parent = parent; }
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    public List<String> getNearby() { return nearby; }
    public void setNearby(List<String> nearby) { this.nearby = nearby; }
    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }
    public Double getLng() { return lng; }
    public void setLng(Double lng) { this.lng = lng; }
    public List<String> getAliases() { return aliases; }
    public void setAliases(List<String> aliases) { this.aliases = aliases; }
    public List<String> getLandmarks() { return landmarks; }
    public void setLandmarks(List<String> landmarks) { this.landmarks = landmarks; }
    public boolean isTrending() { return trending; }
    public void setTrending(boolean trending) { this.trending = trending; }
    public boolean isToConfirm() { return toConfirm; }
    public void setToConfirm(boolean toConfirm) { this.toConfirm = toConfirm; }
}
