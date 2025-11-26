import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  // 개발 환경(dev)에서는 항상 "/", 빌드 시에만 환경 변수로 제어
  const base =
    command === "serve"
      ? "/"
      : process.env.VITE_BASE_PATH || "/front_7th_chapter3-1/";

  return {
    base,
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
  };
});
