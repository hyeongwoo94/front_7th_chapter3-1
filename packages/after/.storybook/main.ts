import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-links",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    // GitHub Pages 에서 /front_7th_chapter3-1/storybook/ 경로로 서빙될 수 있도록 base 설정
    const base =
      process.env.STORYBOOK_BASE_HREF || "/"; // 로컬 dev 에서는 /

    return mergeConfig(config, {
      base,
      css: {
        postcss: {
          plugins: [
            // Tailwind v4 + autoprefixer
            require("@tailwindcss/postcss"),
            require("autoprefixer"),
          ],
        },
      },
    });
  },
};

export default config;
