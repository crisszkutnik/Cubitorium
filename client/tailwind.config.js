import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"

  ],
  theme: {
    extend: {
      colors: {
        'text-primary': '#032D60',
        'accent-primary': '#5849FF',
        'accent-dark': '#032D60'
      },
      fontFamily: {
        sans: ['Inria Sans', 'sans-serif']
      }
    },
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          primary: {
            "50": "#E8E4FF",
            "100": "#DEDAFF",
            "200": "#BEB6FF",
            "300": "#9C91FF",
            "400": "#8276FF",
            "500": "#5849FF",
            "600": "#4135DB",
            "700": "#2E24B7",
            "800": "#1E1793",
            "900": "#130E7A",
            DEFAULT: "#5849FF",
            foreground: "#000000",
          },
        }
      }
    }
  })]
}

