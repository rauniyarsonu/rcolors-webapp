package com.rcolorsgroup.careers;

import com.rcolorsgroup.forms.Notifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/** Emails about a new application: always to the team (when mail is set up), optionally to the applicant */
@Component
public class CareersNotifications {
    private final Notifier notifier;
    private final String panelUrl;
    private final boolean ackEmail;

    public CareersNotifications(
            Notifier notifier,
            @Value("${app.admin.panel-url:}") String panelUrl,
            @Value("${app.careers.ack-email:false}") boolean ackEmail) {
        this.notifier = notifier;
        this.panelUrl = panelUrl.replaceAll("/+$", "");
        this.ackEmail = ackEmail;
    }

    /** No résumé attached: it stays in the admin panel */
    void received(JobApplication a, JobPosting job) {
        String position = job == null ? "General application" : job.getTitle();
        String link = panelUrl.isEmpty() ? "" : "\nReview: " + panelUrl + "/applications/" + a.getId() + "\n";
        notifier.send("New application: " + position + " — " + a.getName(), """
                Position: %s
                Name: %s
                Phone: %s
                Email: %s
                Experience: %s years
                Current location: %s
                %s""".formatted(position, a.getName(), a.getPhone(), a.getEmail(),
                a.getTotalExperienceYears(), a.getCurrentLocation(), link));

        if (ackEmail) {
            notifier.sendTo(a.getEmail(), "We received your application — R Colors Group", """
                    Dear %s,

                    Thank you for applying%s at R Colors Group. Our team will review your profile
                    and contact you if it matches what we're looking for.

                    Regards,
                    R Colors Group
                    """.formatted(a.getName(), job == null ? "" : " for the " + job.getTitle() + " position"));
        }
    }
}
