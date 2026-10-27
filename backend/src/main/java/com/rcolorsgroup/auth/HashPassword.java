package com.rcolorsgroup.auth;

import java.io.Console;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Prints a BCrypt hash for ADMIN_PASSWORD_HASH. Asks for the password so it
 * doesn't end up in the shell history (see README > Configuration):
 *
 *   mvn -q compile exec:java -Dexec.mainClass=com.rcolorsgroup.auth.HashPassword
 */
public final class HashPassword {
    private HashPassword() {}

    public static void main(String[] args) {
        Console console = System.console();
        String password;
        if (args.length > 0) password = args[0];
        else if (console != null) password = new String(console.readPassword("Admin password: "));
        else throw new IllegalStateException("No console: pass the password as the first argument");
        if (password.length() < 10) throw new IllegalArgumentException("Use at least 10 characters");
        System.out.println(new BCryptPasswordEncoder(12).encode(password));
    }
}
