import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        mist: "#f2f7ff",
        ocean: {
          50: "#eff8ff",
          100: "#d9edff",
          300: "#79b8ff",
          500: "#2284ff",
          700: "#1258c8",
          900: "#0f2d6d"
        },
        mint: {
          100: "#d7fbe8",
          300: "#7fe1b0",
          500: "#25b872",
          700: "#177f4f"
        },
        sand: "#fff7e8"
      },
      borderRadius: {
        xl2: "1.5rem"
      },
      boxShadow: {
        glow: "0 22px 48px rgba(19, 71, 177, 0.18)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.45) 1px, transparent 0)"
      },
      fontFamily: {
        display: [
          "\"SF Pro Display\"",
          "\"PingFang SC\"",
          "\"HarmonyOS Sans SC\"",
          "\"Noto Sans SC\"",
          "sans-serif"
        ]
      }
    }
  },
  plugins: []
} satisfies Config;
