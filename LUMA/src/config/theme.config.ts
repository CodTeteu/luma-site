/**
 * Theme Configuration
 * Design tokens and color palette for the LUMA brand.
 * ============================================================================
 */

export const colors = {
    // Primary Palette - Organic Luxury
    cream: "#F7F5F0",
    forestGreen: "#2A3B2E",
    mutedGold: "#C19B58",

    // Text Colors
    textBody: "#3E4A3F",
    textMuted: "#6B7A6C",

    // UI Colors
    border: "#DCD3C5",
    muted: "#E5E0D6",
    white: "#FFFFFF",

    // Accent States
    goldHover: "#b08d4b",
    greenDark: "#1a261d",
    greenDarker: "#1f2d22",
    footerBg: "#1c2820",

    // Functional
    destructive: "#9B2C2C",
} as const;

export const fonts = {
    heading: "'Playfair Display', serif",
    body: "'Cormorant Garamond', serif",
    sans: "'Lato', sans-serif",
} as const;

export const spacing = {
    sectionPadding: "py-24 px-6",
    containerMax: "max-w-7xl mx-auto",
} as const;

// Tailwind-friendly class strings for common patterns
export const themeClasses = {
    // Typography
    headingPrimary: "text-[#2A3B2E] font-[family-name:var(--font-heading)]",
    headingGold: "italic text-[#C19B58]",
    textMuted: "text-[#6B7A6C]",
    textBody: "text-[#3E4A3F]",

    // Buttons
    buttonPrimary: "bg-[#C19B58] text-white hover:bg-[#b08d4b] transition-colors",
    buttonSecondary: "bg-[#2A3B2E] text-[#F7F5F0] hover:bg-[#1a261d] transition-colors",
    buttonGhost: "text-[#3E4A3F] hover:text-[#C19B58] transition-colors",

    // Cards & Containers
    cardGlass: "bg-white/90 backdrop-blur-sm border border-white shadow-2xl",
    sectionLight: "bg-[#F7F5F0]",
    sectionWhite: "bg-white",
    sectionDark: "bg-[#2A3B2E] text-[#F7F5F0]",

    // Badges
    badge: "text-[10px] font-bold tracking-[0.2em] uppercase",
    badgeOutline: "px-3 py-1 border border-[#C19B58]/30 rounded-full bg-[#F7F5F0]/80 backdrop-blur-md",
} as const;

export type Colors = typeof colors;
export type ThemeClasses = typeof themeClasses;
