import { fileURLToPath } from "node:url";
import { defineConfig, type ProxyOptions } from "vite";
import react from "@vitejs/plugin-react";

// In development, /api goes to the Spring Boot backend (backend/, port 8080).
// The proxy is same-origin from the browser's view, so drop Origin and skip the backend's CORS check.
const apiProxy: Record<string, ProxyOptions> = {
  "/api": {
    target: process.env.API_PROXY_TARGET ?? "http://localhost:8080",
    configure: (proxy) => proxy.on("proxyReq", (req) => req.removeHeader("origin")),
  },
};

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: { port: 3000, proxy: apiProxy },
  preview: { port: 3000, proxy: apiProxy },
});
