import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  // 로컬 개발 환경에서는 "/", GitHub Pages 배포 시에는 "/front_7th_chapter3-1/"
  base: process.env.VITE_BASE_PATH || (process.env.NODE_ENV === "production" ? "/front_7th_chapter3-1/" : "/"),
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});
