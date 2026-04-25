/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
  primary: "#6366f1",
  secondary: "#8b5cf6",
  back: "#f8fafc",
  mtext: "#0f172a",

  // 🔹 Derived primary shades
  primaryLight: "#818cf8",   // indigo-400
  primaryDark: "#4f46e5",    // indigo-600

  // 🔹 Derived secondary shades
  secondaryLight: "#a78bfa", // violet-400
  secondaryDark: "#7c3aed",  // violet-600

  // 🔹 Background variations
  surface: "#ffffff",        // cards
  surfaceSoft: "#f1f5f9",    // subtle sections

  // 🔹 Borders & subtle UI
  border: "#e2e8f0",         // slate-200
  borderDark: "#cbd5e1",     // slate-300

  // 🔹 Text hierarchy
  textLight: "#475569",      // slate-600
  textMuted: "#64748b",      // slate-500

  // 🔹 States (kept minimal & consistent)
  success: "#22c55e",        // green-500
  warning: "#f59e0b",        // amber-500
  error: "#ef4444",          // red-500
},

      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        averia: ["Averia Serif Libre", "serif"]
      },

      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem"
        }
      }
    },
  },
  plugins: [],
}