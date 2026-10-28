package com.rcolorsgroup.estate;

import com.rcolorsgroup.content.ContentEntity;
import com.rcolorsgroup.content.JsonConverters;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import java.util.ArrayList;
import java.util.List;

/** An estate advisor (AgentSchema in frontend/src/lib/estate/schema.ts) */
@Entity
public class Agent extends ContentEntity {
    @Column(nullable = false, unique = true, length = 120)
    private String publicId;

    /** The city whose bundle lists this agent; internal, not part of the public JSON */
    @Column(nullable = false, length = 120)
    private String citySlug;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 200)
    private String role;

    @Column(length = 1000)
    private String photo;

    @Column(nullable = false, length = 10)
    private String phone;

    @Column(length = 10)
    private String whatsapp;

    @Column(length = 200)
    private String email;

    @Convert(converter = JsonConverters.StringList.class)
    @Column(nullable = false, length = 2000)
    private List<String> specializations = new ArrayList<>();

    /** Location slugs; the city slug for city-wide agents */
    @Convert(converter = JsonConverters.StringList.class)
    @Column(nullable = false, length = 4000)
    private List<String> areasServed = new ArrayList<>();

    @Convert(converter = JsonConverters.StringList.class)
    @Column(nullable = false, length = 2000)
    private List<String> languages = new ArrayList<>();

    @Column(nullable = false)
    private boolean featured;

    public String getPublicId() { return publicId; }
    public void setPublicId(String publicId) { this.publicId = publicId; }
    public String getCitySlug() { return citySlug; }
    public void setCitySlug(String citySlug) { this.citySlug = citySlug; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getPhoto() { return photo; }
    public void setPhoto(String photo) { this.photo = photo; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public List<String> getSpecializations() { return specializations; }
    public void setSpecializations(List<String> specializations) { this.specializations = specializations; }
    public List<String> getAreasServed() { return areasServed; }
    public void setAreasServed(List<String> areasServed) { this.areasServed = areasServed; }
    public List<String> getLanguages() { return languages; }
    public void setLanguages(List<String> languages) { this.languages = languages; }
    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
}
