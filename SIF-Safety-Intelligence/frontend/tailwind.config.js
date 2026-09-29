/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        petro: {
          black: "#071522",
          green: "#0B1F33",
          surface: "#0F2A44",
        },
        safety: {
          amber: "#F2B233",
          yellow: "#F5C563",
          red: "#D9363E",
          green: "#20A464",
          blue: "#168AAD",
        },
        brand: {
          blue: "#1976C9",
          blue2: "#2F80C9",
        },
        ink: {
          primary: "#1F2937",
          secondary: "#6B7280",
        },
        line: "#D9DEE5",
        surfacebg: "#F5F7FA",
      },
      boxShadow: {
        glow: "0 0 0 3px rgba(25, 118, 201, 0.15)",
        card: "0 1px 2px rgba(16,24,40,0.06), 0 1px 3px rgba(16,24,40,0.08)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-in": "slideIn 0.35s ease-out",
        "pulse-red": "pulseRed 1.8s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideIn: { "0%": { opacity: 0, transform: "translateY(8px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        pulseRed: { "0%,100%": { boxShadow: "0 0 0 0 rgba(217,54,62,0.35)" }, "50%": { boxShadow: "0 0 0 8px rgba(217,54,62,0)" } },
      }
    },
  },
  plugins: [],
}
