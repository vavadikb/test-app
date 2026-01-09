import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          brown: "#8b5a2b",
          dark: "#6f4520"
        },
        card: "#ffffff",
        accent: "#ff5100",
        accentLight: "rgba(255, 81, 0, 0.1)",
        success: "#3cab68"
      },
      boxShadow: {
        soft: "0 16px 38px rgba(0,0,0,0.12)",
        insetGlow: "0 10px 40px -20px rgba(255,81,0,0.35)"
      },
      borderRadius: {
        xl: "20px"
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
