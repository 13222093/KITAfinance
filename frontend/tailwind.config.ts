import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'body': ['16px', { lineHeight: '20px', fontWeight: '400' }],
        'subheading': ['20px', { lineHeight: '24px', fontWeight: '600' }],
        'heading': ['23px', { lineHeight: '27px', fontWeight: '700' }],
        'button': ['18px', { lineHeight: '22px', fontWeight: '600' }],
      },
      colors: {
        // Brand Colors
        white: '#F6F9F9',
        'dark-gray': '#1A1C22',
        'light-gray': '#7D7F9C',
        indigo: '#5072F6',
        mint: '#78F893',
        salmon: '#F9847E',
        sand: '#FFEFB5',
        // Keep primary as alias for indigo
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#5072F6',
          600: '#4f5fd9',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
      backgroundColor: {
        'app-bg': '#1A1C22',
        'component-bg': '#7D7F9C',
      },
      textColor: {
        'active': '#F6F9F9',
        'inactive': '#7D7F9C',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
