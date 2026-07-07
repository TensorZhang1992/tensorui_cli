import type { DesignConfig } from './design-config.js'

export function dcRadius(dc: DesignConfig) {
  const map = {
    none: 'rounded-none', sm: 'rounded', md: 'rounded-lg',
    lg: 'rounded-xl', xl: 'rounded-2xl', full: 'rounded-3xl',
  }
  return map[dc.shape.radius]
}

export function btnShape(dc: DesignConfig) {
  if (dc.components.buttonShape === 'pill') return 'rounded-full'
  if (dc.components.buttonShape === 'square') return 'rounded-none'
  const map = {
    none: 'rounded-none', sm: 'rounded-sm', md: 'rounded-md',
    lg: 'rounded-lg', xl: 'rounded-xl', full: 'rounded-full',
  }
  return map[dc.shape.radius]
}

export function dcCardStyle(dc: DesignConfig) {
  const map = {
    bordered: '', elevated: 'border-0 shadow-lg',
    flat: 'border-0 shadow-none', glass: 'border-white/20 backdrop-blur-md bg-card/80',
  }
  return map[dc.components.cardStyle]
}

export function dcInputStyle(dc: DesignConfig) {
  const map = {
    outline: '', filled: 'border-0 bg-muted',
    underline: 'border-0 border-b-2 rounded-none bg-transparent',
  }
  return map[dc.components.inputStyle]
}

export function cardShadow(dc: DesignConfig) {
  const map = { flat: 'shadow-none', subtle: 'shadow-sm', medium: 'shadow-md', dramatic: 'shadow-xl' }
  return map[dc.elevation.style]
}

export function sectionPy(dc: DesignConfig) {
  const map = { compact: 'py-8', normal: 'py-12', comfortable: 'py-16' }
  return map[dc.shape.density]
}

export function cardPadding(dc: DesignConfig) {
  const map = { compact: 'p-3', normal: 'p-4', comfortable: 'p-6' }
  return map[dc.shape.density]
}

export function titleWeight(dc: DesignConfig) {
  const map = { thin: 'font-light', normal: 'font-normal', medium: 'font-semibold', bold: 'font-bold' }
  return map[dc.typography.weightStyle]
}

export function dcBorderStyle(dc: DesignConfig) {
  const map = { solid: '', none: 'border-0', subtle: 'border border-border/40' }
  return map[dc.shape.borderStyle]
}

export function gapSize(dc: DesignConfig) {
  const map = { compact: 'gap-3', normal: 'gap-4', comfortable: 'gap-6' }
  return map[dc.shape.density]
}

export function textWeight(dc: DesignConfig) {
  const map = { thin: 'font-light', normal: 'font-normal', medium: 'font-medium', bold: 'font-semibold' }
  return map[dc.typography.weightStyle]
}

export function dcLetterSpacing(dc: DesignConfig) {
  const map = { tight: 'tracking-tight', normal: '', wide: 'tracking-wide' }
  return map[dc.typography.letterSpacing]
}

export function dcCardHover(dc: DesignConfig) {
  const map = {
    none: '', lift: 'hover:-translate-y-1 hover:shadow-lg transition-all duration-200',
    glow: 'hover:ring-2 hover:ring-primary/30 transition-all duration-200',
    'tilt-3d': 'hover:[transform:perspective(800px)_rotateY(2deg)_rotateX(-2deg)] transition-transform duration-300',
  }
  return map[dc.motion.cardHover]
}

export function dcHoverEffect(dc: DesignConfig) {
  const map = {
    none: '', opacity: 'hover:opacity-80 transition-opacity duration-200',
    scale: 'hover:scale-[1.02] transition-transform duration-200',
    glow: 'hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-shadow duration-200',
  }
  return map[dc.motion.hoverEffect]
}

export function dcGradientBtnClass(dc: DesignConfig) {
  if (dc.visualStyle.gradient === 'none') return ''
  return 'border-0 hover:opacity-90 transition-opacity'
}

export function dcGradientBtnStyle(dc: DesignConfig): Record<string, string> {
  if (dc.visualStyle.gradient === 'none') return {}
  if (dc.visualStyle.gradient === 'primary') {
    return { background: 'linear-gradient(135deg, var(--primary), var(--chart-2))' }
  }
  return { background: 'linear-gradient(135deg, var(--chart-1), var(--primary), var(--chart-2))' }
}

export function dcTableRowClass(dc: DesignConfig) {
  const map = { striped: 'even:bg-muted/50', bordered: '', minimal: 'border-0' }
  return map[dc.components.tableStyle]
}

export function dcTableWrapperClass(dc: DesignConfig) {
  const map = { striped: 'border-0', bordered: '', minimal: 'border-0' }
  return map[dc.components.tableStyle]
}

export function decorativeBgStyle(dc: DesignConfig): Record<string, string> {
  switch (dc.visualStyle.decorative) {
    case 'grid-lines':
      return {
        backgroundImage: 'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }
    case 'dots':
      return {
        backgroundImage: 'radial-gradient(circle, var(--border) 1.2px, transparent 1.2px)',
        backgroundSize: '24px 24px',
      }
    default:
      return {}
  }
}
