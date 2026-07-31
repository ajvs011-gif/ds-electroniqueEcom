import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "ds-blue": "#0057B8",
        "ds-blue-dark": "#0B2D5C",
        "ds-black": "#222222",
        "ds-gray": "#F4F4F4",
        "ds-green": "#22C55E",
        "ds-red": "#EF4444",
        "ds-orange": "#F97316",
      },
      fontFamily: {
        display: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        card: "0 12px 26px rgba(11,45,92,0.10)",
      },
    },
  },
  plugins: [],
};
export default config;
