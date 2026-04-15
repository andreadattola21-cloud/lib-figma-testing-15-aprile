/**
 * JS/TS token exports.
 *
 * These mirror the CSS custom properties so tokens can be used
 * programmatically (e.g. in canvas libraries, charts, tests).
 *
 * AUTO-GENERATED — run `npm run tokens:sync` to update.
 */

export const tokens = {
  color: {
    primitive: {
      white: "#ffffff",
      black: "#000000",
      gray: {
        100: "#f5f5f5",
        200: "#e5e5e5",
        300: "#d4d4d4",
        400: "#a3a3a3",
        500: "#737373",
        600: "#525252",
        700: "#404040",
        800: "#262626",
        900: "#171717",
      },
      blue: {
        100: "#dbeafe",
        500: "#3b82f6",
        600: "#2563eb",
        700: "#1d4ed8",
      },
      red: { 500: "#ef4444", 600: "#dc2626" },
      green: { 500: "#22c55e", 600: "#16a34a" },
    },
  },
  space: {
    0: "0px",
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    16: "64px",
  },
  radius: {
    none: "0px",
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
  },
} as const;

export type Tokens = typeof tokens;
