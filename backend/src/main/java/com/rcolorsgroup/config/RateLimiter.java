package com.rcolorsgroup.config;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Counts events per key (a client IP) in a sliding window, in memory. It resets
 * on restart and isn't shared between instances, which is fine for one server.
 * Behind a proxy, set server.forward-headers-strategy so the key is the real client IP.
 */
public class RateLimiter {
    private final int max;
    private final Duration window;
    private final Clock clock;
    private final Map<String, Deque<Instant>> events = new ConcurrentHashMap<>();

    public RateLimiter(int max, Duration window) {
        this(max, window, Clock.systemUTC());
    }

    RateLimiter(int max, Duration window, Clock clock) {
        this.max = max;
        this.window = window;
        this.clock = clock;
    }

    /** True when the key already has `max` events inside the window */
    public boolean isBlocked(String key) {
        Deque<Instant> list = events.get(key);
        if (list == null) return false;
        synchronized (list) {
            prune(list);
            return list.size() >= max;
        }
    }

    public void record(String key) {
        Deque<Instant> list = events.computeIfAbsent(key, k -> new ArrayDeque<>());
        synchronized (list) {
            prune(list);
            list.addLast(clock.instant());
        }
        // Keep memory bounded: drop keys whose events have all expired
        if (events.size() > 10_000) {
            events.entrySet().removeIf(e -> {
                synchronized (e.getValue()) {
                    prune(e.getValue());
                    return e.getValue().isEmpty();
                }
            });
        }
    }

    public void clear(String key) {
        events.remove(key);
    }

    private void prune(Deque<Instant> list) {
        Instant cutoff = clock.instant().minus(window);
        while (!list.isEmpty() && !list.peekFirst().isAfter(cutoff)) list.removeFirst();
    }
}
