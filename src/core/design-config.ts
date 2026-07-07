export interface DesignConfig {
  typography: {
    weightStyle: 'thin' | 'normal' | 'medium' | 'bold'
    letterSpacing: 'tight' | 'normal' | 'wide'
  }
  shape: {
    density: 'compact' | 'normal' | 'comfortable'
    borderStyle: 'solid' | 'none' | 'subtle'
    radius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  }
  elevation: {
    style: 'flat' | 'subtle' | 'medium' | 'dramatic'
    separator: 'border' | 'shadow' | 'space'
  }
  components: {
    buttonShape: 'default' | 'pill' | 'square'
    cardStyle: 'bordered' | 'elevated' | 'flat' | 'glass'
    inputStyle: 'outline' | 'filled' | 'underline'
    tableStyle: 'striped' | 'bordered' | 'minimal'
  }
  motion: {
    hoverEffect: 'none' | 'opacity' | 'scale' | 'glow'
    cardHover: 'none' | 'lift' | 'glow' | 'tilt-3d'
  }
  visualStyle: {
    decorative: 'none' | 'grid-lines' | 'dots' | 'gradient-blob'
    gradient: 'none' | 'primary' | 'spectrum'
  }
}

export const DEFAULT_DESIGN_CONFIG: DesignConfig = {
  typography: { weightStyle: 'medium', letterSpacing: 'normal' },
  shape: { density: 'normal', borderStyle: 'solid', radius: 'md' },
  elevation: { style: 'subtle', separator: 'border' },
  components: {
    buttonShape: 'default',
    cardStyle: 'bordered',
    inputStyle: 'outline',
    tableStyle: 'bordered',
  },
  motion: {
    hoverEffect: 'none',
    cardHover: 'none',
  },
  visualStyle: {
    decorative: 'none',
    gradient: 'none',
  },
}

export function mergeDesignConfig(
  base: DesignConfig,
  partial: Partial<DesignConfig>,
): DesignConfig {
  return {
    typography: { ...base.typography, ...partial.typography },
    shape: { ...base.shape, ...partial.shape },
    elevation: { ...base.elevation, ...partial.elevation },
    components: { ...base.components, ...partial.components },
    motion: { ...base.motion, ...partial.motion },
    visualStyle: { ...base.visualStyle, ...partial.visualStyle },
  }
}
