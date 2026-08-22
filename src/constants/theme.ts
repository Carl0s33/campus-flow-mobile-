// ─── PALETA LIGHT MODE ────────────────────────────────────────────────────────
export const LIGHT_COLORS = {
  primary: '#2F9E41', // Verde IFRN
  primaryDark: '#227E31',
  primaryLight: '#D2F0D8',
  background: '#F8FAFC', // Cinza Gelo / Cool Slate
  surface: '#FFFFFF',
  textPrimary: '#1A1C20', // Soft black
  textSecondary: '#64748B', // Slate gray
  textTertiary: '#A0A4A8',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  danger: '#E91429',
  success: '#2F9E41',
  cardOverlay: 'rgba(0,0,0,0.03)',
  chipBg: 'rgba(47,158,65,0.08)',
  pinDot: 'rgba(47,158,65,0.3)',
  tabBar: '#FFFFFF',
};

// ─── PALETA DARK MODE ─────────────────────────────────────────────────────────
export const DARK_COLORS = {
  primary: '#2F9E41', // Verde IFRN
  primaryDark: '#45C259', // Lighter green for dark mode pop
  primaryLight: '#185B22',
  background: '#121212', // Material Dark
  surface: '#1E1E1E', // Material Surface
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A4A8', // Gray
  textTertiary: '#64748B',
  border: '#333333',
  borderLight: '#1E1E1E',
  danger: '#E91429',
  success: '#45C259',
  cardOverlay: 'rgba(255,255,255,0.03)',
  chipBg: 'rgba(255,255,255,0.05)',
  pinDot: 'rgba(255,255,255,0.3)',
  tabBar: '#121212',
};

// ─── FUNÇÃO SELETORA DE COR DE TEXTO PARA CONSTRASTE GARANTIDO ────────────────
/**
 * Calcula a cor ideal do texto (preto ou branco) de acordo com a luminosidade da cor de fundo.
 * Garante 100% de legibilidade em qualquer cor de Post-it ou cartão.
 */
export function getContrastTextColor(hexColor: string): '#111827' | '#FFFFFF' {
  if (!hexColor || !hexColor.startsWith('#')) return '#111827';
  
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  
  // Fórmula de Luminância W3C
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? '#111827' : '#FFFFFF';
}

// ─── FUNÇÃO SELETORA DO TEMA ──────────────────────────────────────────────────
export function getColors(isDark: boolean) {
  return isDark ? DARK_COLORS : LIGHT_COLORS;
}

// ─── CORES PADRÃO (alias compatível) ──────────────────────────────────────────
export const COLORS = {
  ...LIGHT_COLORS,
  matteYellow: '#FBBF24',
  matteGreen: '#34D399',
  matteBlue: '#60A5FA',
  mattePink: '#F472B6',
  mattePurple: '#A78BFA',
  matteOrange: '#FB923C',
  accentYellow: '#FBBF24',
  accentPurple: '#A78BFA',
  accentGreen: '#34D399',
  accentOrange: '#FB923C',
  accentRedLight: '#F472B6',
  accentGray: '#E5E7EB',
  accentIndigoLight: '#E0E7FF',
  textOnDark: '#FFFFFF',
  error: '#EF4444',
};

export const MATTE_COLORS = [
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#EC4899', // Pink
  '#8B5CF6', // Violet
  '#F97316', // Orange
];

// ─── TIPOGRAFIA ───────────────────────────────────────────────────────────────
export const SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FONTS = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};

export const BORDER = {
  radiusSm: 12,
  radiusMd: 16,
  radiusLg: 20,
  width: 1,
};

export const SHADOWS = {
  postIt: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  light: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  hardSmall: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  hardMedium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
};
