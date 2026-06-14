import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds & surfaces
        cream: "#FBF9F4",
        "app-bg": "#F4F2EA",
        surface: "#FFFFFF",
        "surface-2": "#FBFAF6",

        // Brand greens
        "green-950": "#16382A",
        "green-900": "#1B4332", // primary
        "green-700": "#2D6A4F",
        "green-500": "#40916C",
        "green-300": "#74C69D",
        "green-200": "#9CC4A8",
        "green-100": "#C9D6C4",
        "green-tint": "#EAF1EA",
        "green-tint-2": "#DCE8DD",

        // CTA / accent
        terracotta: "#C8541F",
        "terracotta-hover": "#A8420F",
        amber: "#E8A02C",
        "amber-text": "#B07A14",

        // Text
        ink: "#23271F",
        body: "#2E332B",
        "body-2": "#3A4339",
        muted: "#6F766B",
        "muted-2": "#9CA89F",

        // Borders
        border: "#E7E3D8",
        "border-2": "#E2DDCF",
        "border-3": "#DAD5C7",

        // Category tints (image placeholder backgrounds)
        "cat-interior": "#DCE8DD",
        "cat-horta": "#E8EDD5",
        "cat-ferramentas": "#E5E2D9",
        "cat-paisagismo": "#D6E4DC",
        "cat-pragas": "#EADFD2",

        // CMS status
        "status-published-text": "#2D6A4F",
        "status-published-bg": "#EAF1EA",
        "status-scheduled-text": "#B07A14",
        "status-scheduled-bg": "#FBF1DC",
        "status-draft-text": "#6F766B",
        "status-draft-bg": "#EFEDE4",

        // Editorial callouts
        "callout-tip-border": "#40916C",
        "callout-tip-bg": "#EAF1EA",
        "callout-warning-border": "#C8541F",
        "callout-warning-bg": "#FBF1E9",
        "callout-pros-bg": "#F1F8F2",
        "callout-pros-border": "#CDE3D4",
        "callout-cons-bg": "#FBF2EC",
        "callout-cons-border": "#E7D2C8",
      },
      fontFamily: {
        lora: ["var(--font-lora)", "Lora", "serif"],
        inter: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        // Default body font is Inter
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-lora)", "Lora", "serif"],
      },
      borderRadius: {
        pill: "999px",
        card: "14px",
        "card-lg": "20px",
      },
      boxShadow: {
        card: "0 8px 28px rgba(27,67,50,0.07)",
        "card-hover": "0 12px 30px rgba(27,67,50,0.10)",
        toast: "0 12px 32px rgba(0,0,0,0.22)",
      },
      maxWidth: {
        container: "1180px",
        prose: "70ch",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-450px 0" },
          "100%": { backgroundPosition: "450px 0" },
        },
        fade: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "none" },
        },
        toast: {
          from: { opacity: "0", transform: "translate(-50%,16px)" },
          to: { opacity: "1", transform: "translate(-50%,0)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.3s infinite linear",
        fade: "fade 0.4s ease both",
        toast: "toast 0.25s ease both",
      },

      /* ----------------------------------------------------------- */
      /* Article prose (@tailwindcss/typography)                     */
      /* Use as `prose prose-gj` on the MDX body wrapper.            */
      /* ----------------------------------------------------------- */
      typography: {
        gj: {
          css: {
            "--tw-prose-body": "#2E332B",
            "--tw-prose-headings": "#1B4332",
            "--tw-prose-links": "#2D6A4F",
            "--tw-prose-bold": "#23271F",
            "--tw-prose-counters": "#6F766B",
            "--tw-prose-bullets": "#74C69D",
            "--tw-prose-quotes": "#1B4332",
            "--tw-prose-quote-borders": "#40916C",
            "--tw-prose-hr": "#E7E3D8",
            "--tw-prose-captions": "#6F766B",

            maxWidth: "65ch",
            fontSize: "17.5px",
            lineHeight: "1.75",

            // Paragraph rhythm
            p: { marginTop: "1.15em", marginBottom: "1.15em" },

            // H2 — Lora 700, 24px, green-900
            h2: {
              fontFamily: "var(--font-lora), Lora, serif",
              fontWeight: "700",
              fontSize: "24px",
              lineHeight: "1.25",
              letterSpacing: "-0.01em",
              marginTop: "2.5rem",
              marginBottom: "1rem",
              scrollMarginTop: "120px",
            },

            // H3 — Lora 600, 20px, green-900
            h3: {
              fontFamily: "var(--font-lora), Lora, serif",
              fontWeight: "600",
              fontSize: "20px",
              lineHeight: "1.3",
              marginTop: "1.85rem",
              marginBottom: "0.75rem",
              scrollMarginTop: "120px",
            },

            // Links — green-700, underline, hover green-900
            a: {
              color: "#2D6A4F",
              textDecoration: "underline",
              textUnderlineOffset: "2px",
              fontWeight: "500",
              transition: "color 0.15s ease",
            },
            "a:hover": { color: "#1B4332" },

            // Blockquote — left border 4px green-500, green-tint bg, padding
            blockquote: {
              fontStyle: "normal",
              fontWeight: "400",
              color: "#1B4332",
              borderLeftWidth: "4px",
              borderLeftColor: "#40916C",
              backgroundColor: "#EAF1EA",
              borderRadius: "0 12px 12px 0",
              padding: "16px 20px",
              marginTop: "1.5em",
              marginBottom: "1.5em",
            },
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:last-of-type::after": { content: "none" },
            "blockquote p": { marginTop: "0.4em", marginBottom: "0.4em" },

            // Lists
            "ul > li::marker": { color: "#40916C" },
            "ol > li::marker": { color: "#6F766B", fontWeight: "600" },

            // Strong
            strong: { fontWeight: "700", color: "#23271F" },

            // Images & figures
            img: { borderRadius: "14px" },
            figcaption: { fontSize: "13px", color: "#6F766B" },

            // Inline code
            code: {
              fontWeight: "600",
              color: "#1B4332",
              backgroundColor: "#EAF1EA",
              padding: "2px 6px",
              borderRadius: "6px",
              fontSize: "0.9em",
            },
            "code::before": { content: "none" },
            "code::after": { content: "none" },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
