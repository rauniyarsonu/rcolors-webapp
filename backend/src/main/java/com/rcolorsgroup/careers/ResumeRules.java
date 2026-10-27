package com.rcolorsgroup.careers;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.Arrays;
import java.util.Locale;
import org.springframework.web.multipart.MultipartFile;

/**
 * Résumé upload rules (same as ApplicationForm.tsx): PDF, DOC or DOCX, at most
 * 5 MB. The type comes from the extension and must match the file's first bytes;
 * the browser's Content-Type is ignored.
 */
final class ResumeRules {
    static final long MAX_BYTES = 5L * 1024 * 1024;

    enum Kind {
        PDF("pdf", "application/pdf", new byte[] {'%', 'P', 'D', 'F'}),
        DOC("doc", "application/msword", new byte[] {(byte) 0xD0, (byte) 0xCF, 0x11, (byte) 0xE0}),
        DOCX("docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", new byte[] {'P', 'K', 0x03, 0x04});

        final String extension;
        final String contentType;
        final byte[] magic;

        Kind(String extension, String contentType, byte[] magic) {
            this.extension = extension;
            this.contentType = contentType;
            this.magic = magic;
        }
    }

    /** A checked upload, ready to store */
    record Upload(byte[] data, Kind kind, String filename) {}

    /** Thrown with a message for the "resume" field */
    static final class Rejected extends Exception {
        Rejected(String message) {
            super(message);
        }
    }

    private ResumeRules() {}

    static Upload check(MultipartFile file) throws Rejected {
        if (file == null || file.isEmpty()) throw new Rejected("Please attach your résumé");
        if (file.getSize() > MAX_BYTES) throw new Rejected("must be 5 MB or smaller");
        String original = file.getOriginalFilename() == null ? "" : file.getOriginalFilename();
        Kind kind = byExtension(original);
        if (kind == null) throw new Rejected("must be a PDF, DOC or DOCX file");
        byte[] data;
        try {
            data = file.getBytes();
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
        if (!startsWith(data, kind.magic)) throw new Rejected("doesn't look like a real " + kind.extension.toUpperCase(Locale.ROOT) + " file");
        return new Upload(data, kind, sanitiseFilename(original, kind));
    }

    static Kind byExtension(String filename) {
        String lower = filename.toLowerCase(Locale.ROOT);
        for (Kind k : Kind.values()) if (lower.endsWith("." + k.extension)) return k;
        return null;
    }

    static boolean startsWith(byte[] data, byte[] prefix) {
        return data.length >= prefix.length && Arrays.equals(data, 0, prefix.length, prefix, 0, prefix.length);
    }

    /** "C:\Users\a\My CV (final).PDF" → "My CV final.pdf": no paths, quotes or control characters */
    static String sanitiseFilename(String original, Kind kind) {
        String name = original.replace('\\', '/');
        name = name.substring(name.lastIndexOf('/') + 1);
        int dot = name.lastIndexOf('.');
        String base = (dot > 0 ? name.substring(0, dot) : "")
                .replaceAll("[^A-Za-z0-9._ -]", "")
                .replaceAll("\\s+", " ")
                .replaceAll("^[ .]+|[ .]+$", "");
        if (base.length() > 100) base = base.substring(0, 100).trim();
        if (base.isEmpty()) base = "resume";
        return base + "." + kind.extension;
    }
}
