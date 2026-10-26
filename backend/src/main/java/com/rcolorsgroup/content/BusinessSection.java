package com.rcolorsgroup.content;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import java.util.ArrayList;
import java.util.List;

/** The editable copy of one business page (construction | r-colors | estate) */
@Entity
public class BusinessSection extends ContentEntity {
    @Column(name = "business_key", nullable = false, unique = true, length = 40)
    private String key;

    @Column(length = 300)
    private String heroTitle;

    @Column(length = 300)
    private String heroSubtitle;

    @Column(length = 2000)
    private String heroText;

    @Column(length = 1000)
    private String heroImage;

    @Column(length = 300)
    private String heroImageAlt;

    @Column(length = 300)
    private String introTitle;

    @Convert(converter = JsonConverters.StringList.class)
    @Column(nullable = false, length = 20000)
    private List<String> introParagraphs = new ArrayList<>();

    @Column(length = 1000)
    private String introImage;

    @Column(length = 300)
    private String introImageAlt;

    @Column(length = 300)
    private String servicesTitle;

    @Column(length = 2000)
    private String servicesSubtitle;

    /**
     * Named lists of small blocks the page renders, e.g. {"highlights": [{"title", "desc"}]}
     * or, for estate, {"expertise": [...], "journey": [...]}
     */
    @Convert(converter = JsonConverters.Json.class)
    @Column(nullable = false, length = 20000)
    private JsonNode blocks = JsonNodeFactory.instance.objectNode();

    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }
    public String getHeroTitle() { return heroTitle; }
    public void setHeroTitle(String heroTitle) { this.heroTitle = heroTitle; }
    public String getHeroSubtitle() { return heroSubtitle; }
    public void setHeroSubtitle(String heroSubtitle) { this.heroSubtitle = heroSubtitle; }
    public String getHeroText() { return heroText; }
    public void setHeroText(String heroText) { this.heroText = heroText; }
    public String getHeroImage() { return heroImage; }
    public void setHeroImage(String heroImage) { this.heroImage = heroImage; }
    public String getHeroImageAlt() { return heroImageAlt; }
    public void setHeroImageAlt(String heroImageAlt) { this.heroImageAlt = heroImageAlt; }
    public String getIntroTitle() { return introTitle; }
    public void setIntroTitle(String introTitle) { this.introTitle = introTitle; }
    public List<String> getIntroParagraphs() { return introParagraphs; }
    public void setIntroParagraphs(List<String> introParagraphs) { this.introParagraphs = introParagraphs; }
    public String getIntroImage() { return introImage; }
    public void setIntroImage(String introImage) { this.introImage = introImage; }
    public String getIntroImageAlt() { return introImageAlt; }
    public void setIntroImageAlt(String introImageAlt) { this.introImageAlt = introImageAlt; }
    public String getServicesTitle() { return servicesTitle; }
    public void setServicesTitle(String servicesTitle) { this.servicesTitle = servicesTitle; }
    public String getServicesSubtitle() { return servicesSubtitle; }
    public void setServicesSubtitle(String servicesSubtitle) { this.servicesSubtitle = servicesSubtitle; }
    public JsonNode getBlocks() { return blocks; }
    public void setBlocks(JsonNode blocks) { this.blocks = blocks; }
}
