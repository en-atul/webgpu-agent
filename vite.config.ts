import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/ddg": {
        target: "https://api.duckduckgo.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ddg/, ""),
      },
    },
    forwardConsole: {
      unhandledErrors: true,
      logLevels: ["warn", "error"],
    },
  },
});
