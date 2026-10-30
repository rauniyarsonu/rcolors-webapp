package com.rcolorsgroup.forms;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.net.http.HttpResponse;
import org.junit.jupiter.api.Test;

class WhatsAppNotifierTest {
    @Test
    void anInvalidApiKeyIsAnErrorThoughItIsA2xx() {
        // What CallMeBot really answers for a wrong key (checked 2026-10-29)
        String body = "<p>Message to: +910000000000<p>Text to send: Phone: 9876543210<p style=\"color:red\">"
                + "<b>APIKey is invalid.</b> Please create a new one or contact support if you lost it.";
        String error = WhatsAppNotifier.errorIn(response(203, body));
        assertThat(error).startsWith("HTTP 203 APIKey is invalid.");
        // The echoed message carries the visitor's details; keep them out of the log
        assertThat(error).doesNotContain("9876543210");
    }

    @Test
    void otherStatusesAreErrorsAndA200IsNot() {
        assertThat(WhatsAppNotifier.errorIn(response(500, "oops"))).isEqualTo("HTTP 500");
        assertThat(WhatsAppNotifier.errorIn(response(200, "<p>Message queued."))).isNull();
    }

    @Test
    void isOffWithoutValidRecipients() {
        assertThat(new WhatsAppNotifier("", "http://unused").isOn()).isFalse();
        assertThat(new WhatsAppNotifier("916389144470", "http://unused").isOn()).isFalse();
        assertThat(new WhatsAppNotifier("916389144470:key", "http://unused").isOn()).isTrue();
    }

    @SuppressWarnings("unchecked")
    private static HttpResponse<String> response(int status, String body) {
        HttpResponse<String> res = mock(HttpResponse.class);
        when(res.statusCode()).thenReturn(status);
        when(res.body()).thenReturn(body);
        return res;
    }
}
