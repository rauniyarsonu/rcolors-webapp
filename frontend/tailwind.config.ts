import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/*.tsx",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'brand-navy': '#0F3C63',
        'brand-sky': '#28A9DC',
        'brand-red': '#C1272D',
        'brand-green': '#235c1d',
        // Warm accent for decorative details; 2.2:1 on white, so not for text on light surfaces
        'brand-gold': '#C8A96A',
        // Estate tokens (white + sky theme), defined in globals.css
        es: {
          ink: 'rgb(var(--es-ink) / <alpha-value>)',
          body: 'rgb(var(--es-body) / <alpha-value>)',
          muted: 'rgb(var(--es-muted) / <alpha-value>)',
          surface: 'rgb(var(--es-surface) / <alpha-value>)',
          line: 'rgb(var(--es-line) / <alpha-value>)',
          accent: 'rgb(var(--es-accent) / <alpha-value>)',
          'accent-strong': 'rgb(var(--es-accent-strong) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        heading: ['var(--font-montserrat)'],
        display: ['var(--font-manrope)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        harlow: ['"Harlow Solid Italic"', 'cursive'],
      },
      keyframes: {
        'marquee-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-right': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'sweep-x': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        }
      },
      animation: {
        'sweep-x': 'sweep-x 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-up': 'fade-up 0.4s ease-out both',
        'marquee-left': 'marquee-left 180s linear infinite',
        'marquee-right': 'marquee-right 180s linear infinite',
      }
    },
  },
  plugins: [],
};
export default config;
