package com.rcolorsgroup.forms;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * WhatsApp alerts through CallMeBot (free; each number activates itself once and gets
 * its own API key). app.notify.whatsapp lists "phone:apikey" pairs, comma-separated,
 * phone with country code. Sent in the background so a slow API never delays a form.
 */
@Component
public class WhatsAppNotifier {
    private static final Logger log = LoggerFactory.getLogger(WhatsAppNotifier.class);
    private static final String API = "https://api.callmebot.com/whatsapp.php";
    private static final int MAX_TEXT = 1500;

    private record Recipient(String phone, String apiKey) {}

    private final List<Recipient> recipients = new ArrayList<>();
    private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();

    public WhatsAppNotifier(@Value("${app.notify.whatsapp:}") String config) {
        for (String entry : config.split("\\s*,\\s*")) {
            if (entry.isBlank()) continue;
            int colon = entry.indexOf(':');
            if (colon <= 0 || colon == entry.length() - 1) {
                log.warn("Ignoring WhatsApp recipient \"{}\": expected phone:apikey", entry);
                continue;
            }
            recipients.add(new Recipient(entry.substring(0, colon).replaceAll("[^0-9]", ""), entry.substring(colon + 1).trim()));
        }
    }

    public void send(String subject, String body) {
        if (recipients.isEmpty()) return;
        String text = subject + "\n\n" + body.strip();
        if (text.length() > MAX_TEXT) text = text.substring(0, MAX_TEXT) + "…";
        String encoded = URLEncoder.encode(text, StandardCharsets.UTF_8);
        for (Recipient r : recipients) {
            HttpRequest request = HttpRequest.newBuilder(URI.create(API + "?phone=%2B" + r.phone()
                            + "&apikey=" + URLEncoder.encode(r.apiKey(), StandardCharsets.UTF_8) + "&text=" + encoded))
                    .timeout(Duration.ofSeconds(30))
                    .GET()
                    .build();
            http.sendAsync(request, HttpResponse.BodyHandlers.discarding()).whenComplete((res, e) -> {
                if (e != null) log.warn("Could not WhatsApp +{}: {}", r.phone(), e.getMessage());
                else if (res.statusCode() >= 300) log.warn("Could not WhatsApp +{}: HTTP {}", r.phone(), res.statusCode());
            });
        }
    }
}
