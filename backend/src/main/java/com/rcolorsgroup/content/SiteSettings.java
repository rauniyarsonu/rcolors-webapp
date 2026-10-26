package com.rcolorsgroup.content;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import java.util.ArrayList;
import java.util.List;

/** Group-wide contact details (single row; was frontend/src/config/company.ts) */
@Entity
public class SiteSettings extends ContentEntity {
    @Column(nullable = false, length = 200)
    private String companyName;

    /** 10-digit Indian mobiles */
    @Convert(converter = JsonConverters.StringList.class)
    @Column(nullable = false, length = 2000)
    private List<String> phones = new ArrayList<>();

    @Column(nullable = false, length = 200)
    private String email;

    @Column(nullable = false, length = 500)
    private String addressShort;

    @Column(nullable = false, length = 1000)
    private String addressFull;

    /** Network name → profile URL ("" when not set up yet) */
    @Convert(converter = JsonConverters.Json.class)
    @Column(nullable = false, length = 4000)
    private JsonNode social = JsonNodeFactory.instance.objectNode();

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public List<String> getPhones() { return phones; }
    public void setPhones(List<String> phones) { this.phones = phones; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAddressShort() { return addressShort; }
    public void setAddressShort(String addressShort) { this.addressShort = addressShort; }
    public String getAddressFull() { return addressFull; }
    public void setAddressFull(String addressFull) { this.addressFull = addressFull; }
    public JsonNode getSocial() { return social; }
    public void setSocial(JsonNode social) { this.social = social; }
}
