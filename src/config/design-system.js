/**
 * Design System Configuration
 *
 * This file is the central hub for managing the entire Design System.
 * You can modify colors, spacing, typography, and more here.
 */

export const designSystem = {
  // Colors based on project theme
  colors: {
    // Primary - Main system color (Dark Red/Brown)
    primary: {
      light: "#A35D4E",  // Navbar / Logo background
      main: "#8F4A56",   // Buttons / Icons
      dark: "#743b46",   // Hover states
    },

    // Background - Theme colors for backgrounds
    background: {
      light: "#FFFFFF",  // Clean white
      modal: "#fffcfc",  // Soft white for modals
      theme: "#F7D7D1",  // Main pink background
      soft: "rgba(247, 215, 209, 0.3)", // Soft pink for sidebar active states
    },

    // Gray colors for text and secondary elements
    neutral: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      400: "#9CA3AF",
      500: "#6B7280",
      800: "#1F2937",
    },
  },

  // UI Structure
  radius: {
    lg: "0.5rem",      // 8px (Small buttons/inputs)
    xl: "0.75rem",     // 12px (Standard buttons)
    "2xl": "1rem",      // 16px (Playlist cards/sidebar)
    "3xl": "1.5rem",    // 24px (Standard cards)
    "4xl": "2rem",      // 32px (Modals)
    full: "9999px",
  },

  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    xl: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  },
};
