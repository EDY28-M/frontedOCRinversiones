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
        // New Design V3
        "matte-dark": "#1a1a1a",
        "industrial-gray": "#e5e7eb",
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        body: ["Roboto", "sans-serif"],
      },
      boxShadow: {
        'sharp': '0 10px 30px -5px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        'none': '0px',
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%239CA3AF' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
