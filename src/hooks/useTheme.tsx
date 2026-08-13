import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getColors, COLORS } from '../constants/theme';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: ReturnType<typeof getColors> & {
    matteYellow: string;
    matteGreen: string;
    matteBlue: string;
    mattePink: string;
    mattePurple: string;
    matteOrange: string;
  };
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  colors: { ...COLORS },
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(prev => !prev);

  const baseColors = getColors(isDark);
  const colors = {
    ...baseColors,
    matteYellow: '#FBBF24',
    matteGreen: '#34D399',
    matteBlue: '#60A5FA',
    mattePink: '#F472B6',
    mattePurple: '#A78BFA',
    matteOrange: '#FB923C',
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
