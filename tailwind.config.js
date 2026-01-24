/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#F5C344", // Yellow Accent
        secondary: "#002060", // Deep Blue
        "background-light": "#F3F4F6",
        "background-dark": "#111827",
        "surface": "#ffffff",
        "surface-alt": "#f8fafc",
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'sharp': '0 10px 30px -5px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        'none': '0px',
      },
    },
  },
  plugins: [],
}
