import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '#1f2937', // default text color
            h1: { color: '#8B0000' }, // slate-900
            h2: { color: '#8B0000' }, // slate-800
            p: { color: '#8B0000' }, // slate-700
            a: { color: '#2563eb', textDecoration: 'underline' },
          },
        },
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        // brandFont: ['League Spartan', 'serif'],
        brandFont: ['General Sans', 'sans-serif'],
       },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;
