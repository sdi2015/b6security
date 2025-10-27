import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"

import { AVAILABLE_THEMES, DEFAULT_DENSITY, DEFAULT_THEME, applyTheme } from "@/theme/theme"
import { Density, ThemeMode, densityPresets } from "@/theme/tokens"

const DENSITY_STORAGE_KEY = "guardtech:density"

type DensityContextValue = {
  density: Density
  setDensity: (value: Density) => void
}

const DensityContext = createContext<DensityContextValue | null>(null)

const readInitialDensity = (): Density => {
  if (typeof window === "undefined") return DEFAULT_DENSITY
  const stored = window.localStorage.getItem(DENSITY_STORAGE_KEY) as Density | null
  if (stored && stored in densityPresets) {
    return stored
  }
  return DEFAULT_DENSITY
}

const ThemeTokenBridge = ({ density, children }: PropsWithChildren<{ density: Density }>) => {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const nextTheme = (resolvedTheme as ThemeMode) ?? DEFAULT_THEME
    applyTheme(nextTheme, density)
  }, [density, resolvedTheme])

  return <>{children}</>
}

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [density, setDensity] = useState<Density>(readInitialDensity)

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(DENSITY_STORAGE_KEY, density)
  }, [density])

  const value = useMemo<DensityContextValue>(
    () => ({ density, setDensity }),
    [density],
  )

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={DEFAULT_THEME}
      enableSystem
      disableTransitionOnChange
      themes={AVAILABLE_THEMES}
    >
      <DensityContext.Provider value={value}>
        <ThemeTokenBridge density={density}>{children}</ThemeTokenBridge>
      </DensityContext.Provider>
    </NextThemesProvider>
  )
}

export const useDensity = () => {
  const context = useContext(DensityContext)
  if (!context) {
    throw new Error("useDensity must be used within the ThemeProvider")
  }
  return context
}

export const useThemeControls = () => {
  const density = useDensity()
  const theme = useTheme()
  return { ...theme, ...density }
}
