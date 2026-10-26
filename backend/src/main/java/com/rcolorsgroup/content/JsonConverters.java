package com.rcolorsgroup.content;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.io.UncheckedIOException;
import java.util.List;

/**
 * JSON stored as VARCHAR text, which works the same on H2 and PostgreSQL.
 * Used for ordered string lists (images, aliases…) and free-form objects
 * (property attributes, page blocks).
 */
public final class JsonConverters {
    private static final ObjectMapper MAPPER = new ObjectMapper();

    private JsonConverters() {}

    private static String write(Object value) {
        try {
            return value == null ? null : MAPPER.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            throw new UncheckedIOException(e);
        }
    }

    @Converter
    public static class StringList implements AttributeConverter<List<String>, String> {
        @Override
        public String convertToDatabaseColumn(List<String> list) {
            return write(list);
        }

        @Override
        public List<String> convertToEntityAttribute(String json) {
            try {
                return json == null ? null : MAPPER.readValue(json, new TypeReference<List<String>>() {});
            } catch (JsonProcessingException e) {
                throw new UncheckedIOException(e);
            }
        }
    }

    @Converter
    public static class Json implements AttributeConverter<JsonNode, String> {
        @Override
        public String convertToDatabaseColumn(JsonNode node) {
            return write(node);
        }

        @Override
        public JsonNode convertToEntityAttribute(String json) {
            try {
                return json == null ? null : MAPPER.readTree(json);
            } catch (JsonProcessingException e) {
                throw new UncheckedIOException(e);
            }
        }
    }
}
