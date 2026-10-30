package com.rcolorsgroup.forms;

import java.io.IOException;
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
 * phone with country code. Notifier calls this on a background thread.
 */
@Component
public class WhatsAppNotifier {
    private static final Logger log = LoggerFactory.getLogger(WhatsAppNotifier.class);
    private static final int MAX_TEXT = 1500;

    private record Recipient(String phone, String apiKey) {}

    private final List<Recipient> recipients = new ArrayList<>();
    private final String api;
    private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();

    public WhatsAppNotifier(
            @Value("${app.notify.whatsapp:}") String config,
            @Value("${app.notify.whatsapp-api:https://api.callmebot.com/whatsapp.php}") String api) {
        this.api = api;
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

    public boolean isOn() {
        return !recipients.isEmpty();
    }

    public void send(String subject, String body) {
        String text = subject + "\n\n" + body.strip();
        if (text.length() > MAX_TEXT) text = text.substring(0, MAX_TEXT) + "…";
        String encoded = URLEncoder.encode(text, StandardCharsets.UTF_8);
        for (Recipient r : recipients) {
            HttpRequest request = HttpRequest.newBuilder(URI.create(api + "?phone=%2B" + r.phone()
                            + "&apikey=" + URLEncoder.encode(r.apiKey(), StandardCharsets.UTF_8) + "&text=" + encoded))
                    .timeout(Duration.ofSeconds(30))
                    .GET()
                    .build();
            try {
                HttpResponse<String> res = http.send(request, HttpResponse.BodyHandlers.ofString());
                String error = errorIn(res);
                if (error != null) log.warn("Could not WhatsApp +{}: {}", r.phone(), error);
            } catch (IOException e) {
                log.warn("Could not WhatsApp +{}: {}", r.phone(), e.toString());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            }
        }
    }

    /**
     * CallMeBot answers problems such as a wrong API key with HTTP 203 and the reason in
     * red, e.g. {@code <p style="color:red"><b>APIKey is invalid.</b> ...}. Only that part
     * is logged: the rest of the page echoes the message, which holds the visitor's details.
     */
    static String errorIn(HttpResponse<String> res) {
        String body = res.body() == null ? "" : res.body();
        int red = body.indexOf("color:red");
        if (res.statusCode() == 200 && red < 0) return null;
        String reason = red < 0 ? "" : body.substring(red).replaceFirst("^[^>]*>", "")
                .replaceAll("<[^>]*>", " ").replaceAll("\\s+", " ").strip();
        if (reason.length() > 200) reason = reason.substring(0, 200) + "…";
        return "HTTP " + res.statusCode() + (reason.isEmpty() ? "" : " " + reason);
    }
}
