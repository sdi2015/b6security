export const themeModes = {
  light: {
    background: "0 0% 100%",
    foreground: "222.2 84% 4.9%",
    card: "0 0% 100%",
    "card-foreground": "222.2 84% 4.9%",
    popover: "0 0% 100%",
    "popover-foreground": "222.2 84% 4.9%",
    primary: "222.2 47.4% 11.2%",
    "primary-foreground": "210 40% 98%",
    secondary: "210 40% 96.1%",
    "secondary-foreground": "222.2 47.4% 11.2%",
    muted: "210 40% 96.1%",
    "muted-foreground": "215.4 16.3% 46.9%",
    accent: "210 40% 96.1%",
    "accent-foreground": "222.2 47.4% 11.2%",
    destructive: "0 84.2% 60.2%",
    "destructive-foreground": "210 40% 98%",
    border: "214.3 31.8% 91.4%",
    input: "214.3 31.8% 91.4%",
    ring: "222.2 84% 4.9%",
    sidebar: "0 0% 98%",
    "sidebar-foreground": "240 5.3% 26.1%",
    "sidebar-primary": "240 5.9% 10%",
    "sidebar-primary-foreground": "0 0% 98%",
    "sidebar-accent": "240 4.8% 95.9%",
    "sidebar-accent-foreground": "240 5.9% 10%",
    "sidebar-border": "220 13% 91%",
    "sidebar-ring": "217.2 91.2% 59.8%",
  },
  dark: {
    background: "222.2 84% 4.9%",
    foreground: "210 40% 98%",
    card: "222.2 84% 4.9%",
    "card-foreground": "210 40% 98%",
    popover: "222.2 84% 4.9%",
    "popover-foreground": "210 40% 98%",
    primary: "210 40% 98%",
    "primary-foreground": "222.2 47.4% 11.2%",
    secondary: "217.2 32.6% 17.5%",
    "secondary-foreground": "210 40% 98%",
    muted: "217.2 32.6% 17.5%",
    "muted-foreground": "215 20.2% 65.1%",
    accent: "217.2 32.6% 17.5%",
    "accent-foreground": "210 40% 98%",
    destructive: "0 62.8% 30.6%",
    "destructive-foreground": "210 40% 98%",
    border: "217.2 32.6% 17.5%",
    input: "217.2 32.6% 17.5%",
    ring: "212.7 26.8% 83.9%",
    sidebar: "240 5.9% 10%",
    "sidebar-foreground": "240 4.8% 95.9%",
    "sidebar-primary": "224.3 76.3% 48%",
    "sidebar-primary-foreground": "0 0% 100%",
    "sidebar-accent": "240 3.7% 15.9%",
    "sidebar-accent-foreground": "240 4.8% 95.9%",
    "sidebar-border": "240 3.7% 15.9%",
    "sidebar-ring": "217.2 91.2% 59.8%",
  },
  "high-contrast": {
    background: "0 0% 100%",
    foreground: "0 0% 0%",
    card: "0 0% 100%",
    "card-foreground": "0 0% 0%",
    popover: "0 0% 100%",
    "popover-foreground": "0 0% 0%",
    primary: "240 100% 21%",
    "primary-foreground": "0 0% 100%",
    secondary: "0 0% 90%",
    "secondary-foreground": "0 0% 0%",
    muted: "0 0% 88%",
    "muted-foreground": "0 0% 8%",
    accent: "0 0% 100%",
    "accent-foreground": "0 0% 0%",
    destructive: "0 100% 30%",
    "destructive-foreground": "0 0% 100%",
    border: "0 0% 20%",
    input: "0 0% 20%",
    ring: "240 100% 21%",
    sidebar: "0 0% 90%",
    "sidebar-foreground": "0 0% 0%",
    "sidebar-primary": "240 100% 21%",
    "sidebar-primary-foreground": "0 0% 100%",
    "sidebar-accent": "0 0% 100%",
    "sidebar-accent-foreground": "0 0% 0%",
    "sidebar-border": "0 0% 20%",
    "sidebar-ring": "240 100% 21%",
  },
} as const

export type ThemeMode = keyof typeof themeModes

export const radiiTokens = {
  sm: "0.375rem",
  md: "0.625rem",
  lg: "0.875rem",
  xl: "1.5rem",
  full: "999px",
} as const

export const spacingScale = {
  "3xs": 0.125,
  "2xs": 0.25,
  xs: 0.5,
  sm: 0.75,
  md: 1,
  lg: 1.5,
  xl: 2,
  "2xl": 3,
} as const

export const typographyTokens = {
  families: {
    sans: "\"Inter\", \"SF Pro Text\", system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
    mono: "\"JetBrains Mono\", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace",
  },
  sizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
  },
  lineHeights: {
    tight: "1.2",
    snug: "1.35",
    normal: "1.5",
    relaxed: "1.7",
  },
  weights: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  letterSpacing: {
    tighter: "-0.02em",
    tight: "-0.01em",
    normal: "0",
    wide: "0.02em",
  },
} as const

export const motionTokens = {
  duration: {
    xs: "75ms",
    sm: "120ms",
    md: "180ms",
    lg: "240ms",
  },
  easing: {
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    emphasized: "cubic-bezier(0.32, 0.72, 0, 1)",
    entrance: "cubic-bezier(0.16, 1, 0.3, 1)",
    exit: "cubic-bezier(0.4, 0, 1, 1)",
  },
} as const

export const densityPresets = {
  comfortable: {
    scale: 1,
    controlHeight: "2.75rem",
    tableRowHeight: "3.25rem",
    contentGap: "0.75rem",
  },
  compact: {
    scale: 0.9,
    controlHeight: "2.25rem",
    tableRowHeight: "2.75rem",
    contentGap: "0.5rem",
  },
} as const

export type Density = keyof typeof densityPresets

export const themeNames = Object.keys(themeModes) as ThemeMode[]
