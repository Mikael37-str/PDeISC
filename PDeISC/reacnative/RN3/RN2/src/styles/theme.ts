// src/styles/theme.ts
export const theme = {
  colors: {
    // Backgrounds
    background: {
      primary: '#0A0E1A',      // Casi negro
      secondary: '#121824',    // Gris oscuro
      tertiary: '#1A2332',     // Gris medio oscuro
      card: '#1E2A3A',         // Fondo de tarjetas
      elevated: '#243447',     // Elementos elevados
    },
    
    // Acentos principales
    primary: {
      main: '#00D9FF',         // Cyan brillante
      light: '#33E1FF',
      dark: '#00B8D4',
      glow: 'rgba(0, 217, 255, 0.3)',
    },
    
    secondary: {
      main: '#00FF88',         // Verde neón
      light: '#33FFA3',
      dark: '#00CC6D',
      glow: 'rgba(0, 255, 136, 0.3)',
    },
    
    accent: {
      purple: '#B388FF',
      pink: '#FF4081',
      orange: '#FF9100',
    },
    
    // Estados
    success: '#00FF88',
    warning: '#FFB800',
    error: '#FF5252',
    info: '#00D9FF',
    
    // Textos
    text: {
      primary: '#E8EFF7',      // Blanco suave
      secondary: '#A0B4CC',    // Gris azulado
      tertiary: '#6B7F99',     // Gris más oscuro
      disabled: '#4A5A6F',
      inverse: '#0A0E1A',
    },
    
    // Bordes y divisores
    border: {
      light: 'rgba(255, 255, 255, 0.08)',
      medium: 'rgba(255, 255, 255, 0.12)',
      strong: 'rgba(255, 255, 255, 0.2)',
      glow: 'rgba(0, 217, 255, 0.4)',
    },
    
    // Overlays
    overlay: {
      light: 'rgba(10, 14, 26, 0.8)',
      medium: 'rgba(10, 14, 26, 0.9)',
      strong: 'rgba(10, 14, 26, 0.95)',
    },
    
    // Gradientes
    gradients: {
      primary: ['#00D9FF', '#0099CC'],
      secondary: ['#00FF88', '#00CC6D'],
      dark: ['#121824', '#0A0E1A'],
      card: ['#1E2A3A', '#1A2332'],
    },
  },
  
  // Sombras con glow
  shadows: {
    sm: {
      shadowColor: '#00D9FF',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#00D9FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#00D9FF',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    glow: {
      shadowColor: '#00FF88',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 20,
      elevation: 10,
    },
  },
  
  // Espaciado responsivo
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Tipografía
  typography: {
    sizes: {
      xs: 11,
      sm: 13,
      md: 15,
      lg: 18,
      xl: 24,
      xxl: 32,
      xxxl: 40,
    },
    weights: {
      light: '300' as any,
      regular: '400' as any,
      medium: '500' as any,
      semibold: '600' as any,
      bold: '700' as any,
      extrabold: '800' as any,
    },
  },
  
  // Border radius
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
};