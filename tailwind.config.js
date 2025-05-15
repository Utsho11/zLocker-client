import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        gradientStart: "hsla(232, 56%, 63%, 1)", // #6b79d5
        gradientMiddle: "hsla(283, 37%, 59%, 1)", // #a871bd
        gradientEnd: "hsla(327, 89%, 71%, 1)", // #f06ca8
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};

module.exports = config;
