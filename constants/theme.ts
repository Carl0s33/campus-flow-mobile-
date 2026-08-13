// ─── PALETA LIGHT MODE ────────────────────────────────────────────────────────
export const LIGHT_COLORS = {
  primary: '#4F46E5',
  primaryDark: '#3730A3',
  primaryLight: '#E0E7FF',
  background: '#F4F5F8',
  surface: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#374151',
  textTertiary: '#6B7280',
  border: '#D1D5DB',
  borderLight: '#E5E7EB',
  danger: '#EF4444',
  success: '#10B981',
  cardOverlay: 'rgba(17,24,39,0.07)',
  chipBg: 'rgba(17,24,39,0.06)',
  pinDot: 'rgba(17,24,39,0.25)',
  tabBar: '#FFFFFF',
};

// ─── PALETA DARK MODE ─────────────────────────────────────────────────────────
export const DARK_COLORS = {
  primary: '#818CF8',
  primaryDark: '#6366F1',
  primaryLight: '#1E1B4B',
  background: '#0A0A0A',
  surface: '#1C1C1E',
  textPrimary: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textTertiary: '#6B7280',
  border: '#2D2D2F',
  borderLight: '#232325',
  danger: '#F87171',
  success: '#34D399',
  cardOverlay: 'rgba(255,255,255,0.08)',
  chipBg: 'rgba(255,255,255,0.07)',
  pinDot: 'rgba(255,255,255,0.3)',
  tabBar: '#111111',
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
  '#FBBF24',
  '#34D399',
  '#60A5FA',
  '#F472B6',
  '#A78BFA',
  '#FB923C',
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
  radiusSm: 8,
  radiusMd: 10,
  radiusLg: 12,
  width: 1,
};

export const SHADOWS = {
  postIt: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  light: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  hardSmall: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },
  hardMedium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
    elevation: 5,
  },
};
