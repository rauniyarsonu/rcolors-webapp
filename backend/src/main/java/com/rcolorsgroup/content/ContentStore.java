package com.rcolorsgroup.content;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Objects;
import java.util.TreeSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;

/**
 * Reads the site's JSON content: classpath:data/ by default, or the folder in
 * app.data-dir. Same layout either way (projects.json, clients.json, estate/).
 */
@Component
public class ContentStore {
    private static final Pattern CITY_FOLDER = Pattern.compile("/estate/cities/([^/]+)/[^/]+\\.json$");

    private final ObjectMapper mapper;
    private final Path dataDir;
    private final PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();

    public ContentStore(ObjectMapper mapper, @Value("${app.data-dir:}") String dataDir) {
        this.mapper = mapper;
        this.dataDir = dataDir.isBlank() ? null : Path.of(dataDir);
    }

    /** The parsed file, or null when it doesn't exist */
    public JsonNode read(String relativePath) {
        try {
            if (dataDir != null) {
                Path file = dataDir.resolve(relativePath);
                return Files.exists(file) ? mapper.readTree(file.toFile()) : null;
            }
            Resource resource = resolver.getResource("classpath:data/" + relativePath);
            if (!resource.exists()) return null;
            try (InputStream in = resource.getInputStream()) {
                return mapper.readTree(in);
            }
        } catch (IOException e) {
            throw new UncheckedIOException("Could not read data/" + relativePath, e);
        }
    }

    /** City folders are discovered, never registered: every folder under estate/cities/ is a city */
    public List<String> cityFolders() {
        TreeSet<String> out = new TreeSet<>();
        try {
            if (dataDir != null) {
                Path cities = dataDir.resolve("estate/cities");
                if (!Files.isDirectory(cities)) return List.of();
                try (Stream<Path> dirs = Files.list(cities)) {
                    dirs.filter(Files::isDirectory).map(p -> p.getFileName().toString()).forEach(out::add);
                }
            } else {
                for (Resource r : resolver.getResources("classpath*:data/estate/cities/*/*.json")) {
                    Matcher m = CITY_FOLDER.matcher(Objects.toString(r.getURL()));
                    if (m.find()) out.add(m.group(1));
                }
            }
        } catch (IOException e) {
            throw new UncheckedIOException("Could not list data/estate/cities", e);
        }
        out.removeIf(name -> name.startsWith(".") || name.startsWith("_"));
        return List.copyOf(out);
    }
}
