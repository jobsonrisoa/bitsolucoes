import type { StorybookConfig } from "@storybook/react-vite";
import { resolve } from "path";

const config: StorybookConfig = {
  stories: [
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
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
  viteFinal(config) {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = [
      { find: "@/context/AuthContext", replacement: resolve(__dirname, "mocks/auth-context.tsx") },
      { find: "next/link", replacement: resolve(__dirname, "mocks/next-link.tsx") },
      { find: "next/navigation", replacement: resolve(__dirname, "mocks/next-navigation.ts") },
      { find: "@", replacement: resolve(__dirname, "..") },
    ];
    return config;
  },
};

export default config;