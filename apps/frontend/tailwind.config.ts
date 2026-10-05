import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        paper: "var(--paper)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        red: "var(--red)",
        blue: "var(--blue)",
        yellow: "var(--yellow)",
        terra: "var(--terra)",
        moss: "var(--moss)",
        "band-bg": "var(--band-bg)",
        "band-text": "var(--band-text)",
      },
      borderRadius: {
        DEFAULT: "2px",
      },
      boxShadow: {
        sm: "4px 4px 0 0 var(--ink)",
        DEFAULT: "6px 6px 0 0 var(--ink)",
        lg: "10px 10px 0 0 var(--ink)",
        "sm-dark": "4px 4px 0 0 var(--bg)",
        "dark": "6px 6px 0 0 var(--bg)",
        "lg-dark": "10px 10px 0 0 var(--bg)",
      },
      transitionTimingFunction: {
        'ease-out': 'var(--ease-out)',
        'ease-in': 'var(--ease-in)',
        'ease-expo': 'var(--ease-expo)',
      },
      transitionDuration: {
        'micro': 'var(--dur-micro)',
        'base': 'var(--dur-base)',
        'slow': 'var(--dur-slow)',
      }
    },
  },
  plugins: [],
};
export default config;
