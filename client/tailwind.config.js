/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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
  plugins: [],
}

