package com.rcolorsgroup.careers;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ResumeRulesTest {
    @Test
    void sanitisesFilenames() {
        assertThat(ResumeRules.sanitiseFilename("C:\\Users\\a\\My CV (final).PDF", ResumeRules.Kind.PDF)).isEqualTo("My CV final.pdf");
        assertThat(ResumeRules.sanitiseFilename("../../etc/passwd.docx", ResumeRules.Kind.DOCX)).isEqualTo("passwd.docx");
        assertThat(ResumeRules.sanitiseFilename("\"><script>.doc", ResumeRules.Kind.DOC)).isEqualTo("script.doc");
        assertThat(ResumeRules.sanitiseFilename("रेज़्यूमे.pdf", ResumeRules.Kind.PDF)).isEqualTo("resume.pdf");
    }

    @Test
    void slugsAreReadable() {
        assertThat(JobService.slugify("Site Engineer (Civil) – Lucknow")).isEqualTo("site-engineer-civil-lucknow");
        assertThat(JobService.slugify("!!!")).isEqualTo("job");
    }
}
