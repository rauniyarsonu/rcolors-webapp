package com.rcolorsgroup.forms;

import jakarta.annotation.PreDestroy;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.RejectedExecutionException;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

/**
 * Emails each submission to app.notify.to when mail is configured, and sends it to
 * WhatsApp when app.notify.whatsapp is set. Both run in the background, so a slow or
 * hung mail server never holds up the form, and a failed alert never fails the
 * request: the submission is already saved.
 */
@Component
public class Notifier {
    private static final Logger log = LoggerFactory.getLogger(Notifier.class);

    private final ObjectProvider<JavaMailSender> mail;
    private final String to;
    private final String from;
    private final String mailHost;
    private final WhatsAppNotifier whatsApp;
    /** Email and WhatsApp each get a thread; past 200 waiting alerts new ones are dropped (and logged) */
    private final ThreadPoolExecutor background;

    public Notifier(
            ObjectProvider<JavaMailSender> mail,
            WhatsAppNotifier whatsApp,
            @Value("${app.notify.to:}") String to,
            @Value("${app.notify.from:}") String from,
            @Value("${spring.mail.host:}") String mailHost) {
        this.mail = mail;
        this.to = to;
        this.from = from;
        this.mailHost = mailHost;
        this.whatsApp = whatsApp;
        AtomicInteger threads = new AtomicInteger();
        this.background = new ThreadPoolExecutor(2, 2, 0, TimeUnit.SECONDS, new ArrayBlockingQueue<>(200),
                r -> new Thread(r, "notify-" + threads.incrementAndGet()));
    }

    public void send(String subject, String body) {
        String[] recipients = to.isBlank() ? null : to.split("\\s*,\\s*");
        inBackground(subject, () -> deliver(recipients, subject, body));
        if (whatsApp.isOn()) inBackground(subject, () -> whatsApp.send(subject, body));
    }

    /** Email someone other than the team, e.g. an applicant's acknowledgement */
    public void sendTo(String recipient, String subject, String body) {
        String[] recipients = recipient == null || recipient.isBlank() ? null : new String[] {recipient};
        inBackground(subject, () -> deliver(recipients, subject, body));
    }

    private void inBackground(String subject, Runnable task) {
        try {
            background.execute(() -> {
                try {
                    task.run();
                } catch (RuntimeException e) {
                    log.warn("Could not send \"{}\": {}", subject, e.toString());
                }
            });
        } catch (RejectedExecutionException e) {
            log.warn("Too many alerts waiting; dropped \"{}\"", subject);
        }
    }

    private void deliver(String[] recipients, String subject, String body) {
        JavaMailSender sender = mail.getIfAvailable();
        if (recipients == null || mailHost.isBlank() || sender == null) {
            log.info("{} (email notifications are off)", subject);
            return;
        }
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(recipients);
        if (!from.isBlank()) msg.setFrom(from);
        msg.setSubject(subject);
        msg.setText(body);
        try {
            sender.send(msg);
        } catch (MailException e) {
            log.warn("Could not email \"{}\": {}", subject, e.getMessage());
        }
    }

    /** On shutdown, give alerts already queued a short while to go out */
    @PreDestroy
    void finishPending() throws InterruptedException {
        background.shutdown();
        if (!background.awaitTermination(30, TimeUnit.SECONDS)) {
            log.warn("Shutting down with {} alerts not sent", background.shutdownNow().size());
        }
    }
}
