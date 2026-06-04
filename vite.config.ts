import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  base: command === "serve" ? "/" : "/geography-review-app/",
  plugins: [react()],
  build: {
    target: ["es2018", "safari13"]
  },
  server: {
    host: "0.0.0.0",
    port: 4173
  }
}));
