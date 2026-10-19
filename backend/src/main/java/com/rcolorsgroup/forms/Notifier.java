package com.rcolorsgroup.forms;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

/**
 * Emails each submission to app.notify.to when mail is configured. A failed
 * email never fails the request: the submission is already saved.
 */
@Component
public class Notifier {
    private static final Logger log = LoggerFactory.getLogger(Notifier.class);

    private final ObjectProvider<JavaMailSender> mail;
    private final String to;
    private final String from;
    private final String mailHost;

    public Notifier(
            ObjectProvider<JavaMailSender> mail,
            @Value("${app.notify.to:}") String to,
            @Value("${app.notify.from:}") String from,
            @Value("${spring.mail.host:}") String mailHost) {
        this.mail = mail;
        this.to = to;
        this.from = from;
        this.mailHost = mailHost;
    }

    public void send(String subject, String body) {
        JavaMailSender sender = mail.getIfAvailable();
        if (to.isBlank() || mailHost.isBlank() || sender == null) {
            log.info("{} (email notifications are off)", subject);
            return;
        }
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to.split("\\s*,\\s*"));
        if (!from.isBlank()) msg.setFrom(from);
        msg.setSubject(subject);
        msg.setText(body);
        try {
            sender.send(msg);
        } catch (MailException e) {
            log.warn("Could not email \"{}\": {}", subject, e.getMessage());
        }
    }
}
