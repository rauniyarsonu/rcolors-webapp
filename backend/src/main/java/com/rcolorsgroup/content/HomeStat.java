package com.rcolorsgroup.content;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

/** A count-up figure in the home page stats band */
@Entity
public class HomeStat extends ContentEntity {
    @Column(name = "stat_value", nullable = false)
    private int value;

    @Column(nullable = false, length = 20)
    private String suffix = "";

    @Column(nullable = false, length = 120)
    private String label;

    public int getValue() { return value; }
    public void setValue(int value) { this.value = value; }
    public String getSuffix() { return suffix; }
    public void setSuffix(String suffix) { this.suffix = suffix; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
}
