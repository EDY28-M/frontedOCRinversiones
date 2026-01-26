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
        // Colores del diseño HTML (Google Stitch) - pixel-perfect
        primary: "#001aff",
        "primary-dark": "#0014cc",
        accent: "#facc15",
        "accent-hover": "#eab308",
        surface: "#ffffff",
        "surface-alt": "#f9fafb",
        "text-main": "#111827",
        "text-muted": "#6b7280",
        "border-light": "#e5e7eb",
        // Legacy
        secondary: "#002060",
        "background-light": "#F3F4F6",
        "background-dark": "#111827",
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
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
