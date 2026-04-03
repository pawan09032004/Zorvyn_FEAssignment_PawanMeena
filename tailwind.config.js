/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-base": "var(--color-bg-base)",
        "bg-surface": "var(--color-bg-surface)",
        "bg-surface-2": "var(--color-bg-surface-2)",
        "bg-surface-3": "var(--color-bg-surface-3)",
        "text-primary": "var(--color-text-primary)",
        "text-muted": "var(--color-text-muted)",
        accent: "var(--color-accent)",
        "accent-glow": "var(--color-accent-glow)",
        positive: "var(--color-positive)",
        negative: "var(--color-negative)",
        tertiary: "var(--color-tertiary)",
        "neutral-500": "var(--color-neutral-500)",
        "neutral-600": "var(--color-neutral-600)",
        "neutral-700": "var(--color-neutral-700)",
        border: "var(--color-border)",
        "on-accent": "var(--color-on-accent)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"],
        body: ["var(--font-body)"],
      },
      borderRadius: {
        none: "0px",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      boxShadow: {
        ambient: "var(--shadow-ambient)",
        card: "var(--shadow-card)",
      },
      spacing: {
        18: "4.5rem",
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(24px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        ticker: "ticker 24s linear infinite",
        fadeIn: "fadeIn 220ms ease-out",
        slideUp: "slideUp 240ms ease-out",
      },
    },
  },
  plugins: [],
};

