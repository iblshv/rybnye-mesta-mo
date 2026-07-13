import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        pine: {
          50: "#edf7f0",
          100: "#d8ecde",
          500: "#2d6a4f",
          700: "#164734",
          900: "#092b24"
        },
        water: {
          500: "#1f6f8b",
          700: "#104a62",
          900: "#082f42"
        },
        sand: {
          50: "#fbf7ef",
          100: "#f3ead8",
          200: "#e4d5b8"
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(8, 47, 66, 0.12)",
        lift: "0 12px 28px rgba(9, 43, 36, 0.16)"
      }
    }
  },
  plugins: []
};

export default config;
