// tailwind.config.ts
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
        flare: "#FF4E00",
        glow: "#FF9508",
        bg: "#000000",
        text: "#FFFFFF"
      }
    }
  },
  plugins: []
};
export default config;
