import {
  Density,
  densityPresets,
  motionTokens,
  radiiTokens,
  spacingScale,
  themeModes,
  ThemeMode,
  themeNames,
  typographyTokens,
} from "./tokens"

const toRem = (value: number) => `${parseFloat(value.toFixed(3))}rem`

const assignCssVariables = (
  element: HTMLElement,
  values: Record<string, string | number>,
  prefix = "",
) => {
  Object.entries(values).forEach(([key, rawValue]) => {
    const cssVariableName = `--${prefix}${key}`
    element.style.setProperty(cssVariableName, String(rawValue))
  })
}

export const applyTheme = (mode: ThemeMode, density: Density) => {
  if (typeof document === "undefined") return

  const root = document.documentElement
  const modeTokens = themeModes[mode] ?? themeModes.light
  const densityToken = densityPresets[density] ?? densityPresets.comfortable

  assignCssVariables(root, modeTokens)
  assignCssVariables(root, radiiTokens, "radius-")
  assignCssVariables(root, typographyTokens.families, "font-family-")
  assignCssVariables(root, typographyTokens.sizes, "font-size-")
  assignCssVariables(root, typographyTokens.lineHeights, "font-lineheight-")
  assignCssVariables(root, typographyTokens.weights, "font-weight-")
  assignCssVariables(root, typographyTokens.letterSpacing, "font-letterspacing-")
  assignCssVariables(root, motionTokens.duration, "motion-duration-")
  assignCssVariables(root, motionTokens.easing, "motion-easing-")

  Object.entries(spacingScale).forEach(([token, baseValue]) => {
    const scaled = Number(baseValue) * densityToken.scale
    root.style.setProperty(`--space-${token}`, toRem(scaled))
  })

  root.style.setProperty("--control-height", densityToken.controlHeight)
  root.style.setProperty("--table-row-height", densityToken.tableRowHeight)
  root.style.setProperty("--content-gap", densityToken.contentGap)
  root.style.setProperty("--density-scale", String(densityToken.scale))

  root.dataset.theme = mode
  root.dataset.density = density
}

export const DEFAULT_THEME: ThemeMode = "light"
export const DEFAULT_DENSITY: Density = "comfortable"
export const AVAILABLE_THEMES = themeNames
