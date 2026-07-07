function hexToSrgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ]
}

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function linearRgbToOklab(r: number, g: number, b: number): [number, number, number] {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)

  return [
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
  ]
}

export function hexToOklch(hex: string): [number, number, number] {
  const [r, g, b] = hexToSrgb(hex)
  const [lr, lg, lb] = [srgbToLinear(r), srgbToLinear(g), srgbToLinear(b)]
  const [L, a, bVal] = linearRgbToOklab(lr, lg, lb)
  const C = Math.sqrt(a * a + bVal * bVal)
  let H = Math.atan2(bVal, a) * (180 / Math.PI)
  if (H < 0) H += 360
  return [L, C, H]
}

function fmt(l: number, c: number, h: number): string {
  return `oklch(${l.toFixed(3)} ${Math.max(0, c).toFixed(3)} ${h.toFixed(1)})`
}

export interface DerivedTokens {
  light: Record<string, string>
  dark: Record<string, string>
}

export function deriveTokens(primaryHex: string): DerivedTokens {
  const [pL, pC, pH] = hexToOklch(primaryHex)
  const achromatic = pC < 0.02
  const h = achromatic ? 0 : pH
  const t = (c: number) => (achromatic ? 0 : c)

  const primaryFgL = pL > 0.6 ? 0.15 : 0.985

  const light: Record<string, string> = {
    '--background': fmt(0.97, t(0.007), h),
    '--foreground': fmt(0.145, t(0.03), h),
    '--card': fmt(0.99, t(0.004), h),
    '--card-foreground': fmt(0.145, t(0.03), h),
    '--popover': fmt(0.99, t(0.004), h),
    '--popover-foreground': fmt(0.145, t(0.03), h),
    '--primary': fmt(pL, pC, h),
    '--primary-foreground': fmt(primaryFgL, 0, 0),
    '--secondary': fmt(0.955, t(0.012), h),
    '--secondary-foreground': fmt(0.205, t(0.03), h),
    '--muted': fmt(0.93, t(0.015), h),
    '--muted-foreground': fmt(0.556, t(0.02), h),
    '--accent': fmt(0.92, t(0.035), h),
    '--accent-foreground': fmt(0.205, t(0.03), h),
    '--destructive': fmt(0.577, 0.245, 27.3),
    '--destructive-foreground': fmt(0.577, 0.245, 27.3),
    '--border': fmt(0.902, t(0.025), h),
    '--input': fmt(0.902, t(0.025), h),
    '--ring': fmt(pL, pC * 0.7, h),
    '--chart-1': fmt(0.646, t(0.222), h),
    '--chart-2': fmt(0.6, t(0.118), (h + 72) % 360),
    '--chart-3': fmt(0.398, t(0.07), (h + 144) % 360),
    '--chart-4': fmt(0.828, t(0.189), (h + 216) % 360),
    '--chart-5': fmt(0.769, t(0.188), (h + 288) % 360),
    '--sidebar': fmt(0.97, t(0.008), h),
    '--sidebar-foreground': fmt(0.145, t(0.03), h),
    '--sidebar-primary': fmt(pL, pC, h),
    '--sidebar-primary-foreground': fmt(primaryFgL, 0, 0),
    '--sidebar-accent': fmt(0.93, t(0.025), h),
    '--sidebar-accent-foreground': fmt(0.205, t(0.03), h),
    '--sidebar-border': fmt(0.902, t(0.025), h),
    '--sidebar-ring': fmt(pL, pC * 0.7, h),
  }

  const darkPrimaryL = Math.min(pL + 0.15, 0.75)
  const darkPrimaryFgL = darkPrimaryL > 0.6 ? 0.15 : 0.985

  const dark: Record<string, string> = {
    '--background': fmt(0.145, t(0.014), h),
    '--foreground': fmt(0.985, t(0.004), h),
    '--card': fmt(0.17, t(0.014), h),
    '--card-foreground': fmt(0.985, t(0.004), h),
    '--popover': fmt(0.17, t(0.014), h),
    '--popover-foreground': fmt(0.985, t(0.004), h),
    '--primary': fmt(darkPrimaryL, pC * 0.85, h),
    '--primary-foreground': fmt(darkPrimaryFgL, 0, 0),
    '--secondary': fmt(0.269, t(0.018), h),
    '--secondary-foreground': fmt(0.985, t(0.004), h),
    '--muted': fmt(0.269, t(0.018), h),
    '--muted-foreground': fmt(0.708, t(0.025), h),
    '--accent': fmt(0.269, t(0.03), h),
    '--accent-foreground': fmt(0.985, t(0.004), h),
    '--destructive': fmt(0.396, 0.141, 25.7),
    '--destructive-foreground': fmt(0.637, 0.237, 25.3),
    '--border': fmt(0.269, t(0.018), h),
    '--input': fmt(0.269, t(0.018), h),
    '--ring': fmt(darkPrimaryL, pC * 0.6, h),
    '--chart-1': fmt(0.488, t(0.243), h),
    '--chart-2': fmt(0.696, t(0.17), (h + 72) % 360),
    '--chart-3': fmt(0.769, t(0.188), (h + 144) % 360),
    '--chart-4': fmt(0.627, t(0.265), (h + 216) % 360),
    '--chart-5': fmt(0.645, t(0.246), (h + 288) % 360),
    '--sidebar': fmt(0.205, t(0.018), h),
    '--sidebar-foreground': fmt(0.985, t(0.004), h),
    '--sidebar-primary': fmt(darkPrimaryL, pC * 0.85, h),
    '--sidebar-primary-foreground': fmt(darkPrimaryFgL, 0, 0),
    '--sidebar-accent': fmt(0.269, t(0.025), h),
    '--sidebar-accent-foreground': fmt(0.985, t(0.004), h),
    '--sidebar-border': fmt(0.269, t(0.018), h),
    '--sidebar-ring': fmt(darkPrimaryL, pC * 0.6, h),
  }

  return { light, dark }
}
