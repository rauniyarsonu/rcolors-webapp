package com.rcolorsgroup.forms;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.timeout;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

class NotifierTest {
    private HttpServer callMeBot;
    private final List<String> whatsAppQueries = new CopyOnWriteArrayList<>();
    private final JavaMailSender sender = mock(JavaMailSender.class);
    private Notifier notifier;

    @BeforeEach
    @SuppressWarnings("unchecked")
    void start() throws Exception {
        callMeBot = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        callMeBot.createContext("/whatsapp.php", exchange -> {
            whatsAppQueries.add(URLDecoder.decode(exchange.getRequestURI().getRawQuery(), StandardCharsets.UTF_8));
            byte[] ok = "<p>Message queued.".getBytes(StandardCharsets.UTF_8);
            exchange.sendResponseHeaders(200, ok.length);
            exchange.getResponseBody().write(ok);
            exchange.close();
        });
        callMeBot.start();
        String api = "http://127.0.0.1:" + callMeBot.getAddress().getPort() + "/whatsapp.php";

        ObjectProvider<JavaMailSender> mail = mock(ObjectProvider.class);
        when(mail.getIfAvailable()).thenReturn(sender);
        notifier = new Notifier(mail, new WhatsAppNotifier("916389144470:key1, 919579662353:key2", api),
                "rcolorsgroup@gmail.com", "rcolorsgroup@gmail.com", "smtp.example.com");
    }

    @AfterEach
    void stop() throws Exception {
        notifier.finishPending();
        callMeBot.stop(0);
    }

    @Test
    void emailsTheTeamAndWhatsAppsEveryNumber() {
        notifier.send("New contact message from Asha", "Phone: 9876543210");

        ArgumentCaptor<SimpleMailMessage> sent = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(sender, timeout(5000)).send(sent.capture());
        assertThat(sent.getValue().getTo()).containsExactly("rcolorsgroup@gmail.com");
        assertThat(sent.getValue().getFrom()).isEqualTo("rcolorsgroup@gmail.com");
        assertThat(sent.getValue().getSubject()).isEqualTo("New contact message from Asha");

        awaitWhatsApps(2);
        assertThat(whatsAppQueries).anyMatch(q -> q.contains("phone=+916389144470") && q.contains("apikey=key1"));
        assertThat(whatsAppQueries).anyMatch(q -> q.contains("phone=+919579662353") && q.contains("apikey=key2"));
        assertThat(whatsAppQueries).allMatch(q -> q.contains("New contact message from Asha") && q.contains("Phone: 9876543210"));
    }

    @Test
    void aHungMailServerHoldsUpNeitherTheFormNorWhatsApp() throws Exception {
        CountDownLatch release = new CountDownLatch(1);
        doAnswer(inv -> release.await(30, TimeUnit.SECONDS)).when(sender).send(any(SimpleMailMessage.class));
        try {
            long start = System.nanoTime();
            notifier.send("New contact message from Asha", "hello");
            assertThat(TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - start)).isLessThan(1000);
            awaitWhatsApps(2);
        } finally {
            release.countDown();
        }
    }

    private void awaitWhatsApps(int count) {
        long deadline = System.currentTimeMillis() + 5000;
        while (whatsAppQueries.size() < count && System.currentTimeMillis() < deadline) Thread.onSpinWait();
        assertThat(whatsAppQueries).hasSize(count);
    }
}
