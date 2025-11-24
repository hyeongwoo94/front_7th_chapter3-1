import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import path from "path";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
    ],
    framework: {
        name: "@storybook/react-vite",
        options: {},
    },
    docs: {
        autodocs: "tag",
    },
    async viteFinal(config) {
        // Tailwind 설정 파일 경로를 환경 변수로 설정
        process.env.TAILWIND_CONFIG = path.resolve(
            __dirname,
            "../tailwind.config.js"
        );

        return mergeConfig(config, {
            resolve: {
                alias: {
                    "@": path.resolve(__dirname, "../src"),
                },
            },
            css: {
                postcss: path.resolve(__dirname, "../postcss.config.js"),
            },
            // 작업 디렉토리를 packages/after로 설정
            root: path.resolve(__dirname, ".."),
        });
    },
};

export default config;
