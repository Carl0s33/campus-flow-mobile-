import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { getColors, COLORS } from '@/constants/theme';

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
  const systemColorScheme = useColorScheme(); // 'dark' | 'light' | null
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  // Sincroniza com mudanças no tema do sistema
  useEffect(() => {
    setIsDark(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleTheme = () => setIsDark(prev => !prev);

  const baseColors = getColors(isDark);
  const colors = {
    ...baseColors,
    matteYellow: '#FBBF24',
    matteGreen: isDark ? '#34D399' : '#10B981',
    matteBlue: isDark ? '#60A5FA' : '#3B82F6',
    mattePink: '#F472B6',
    mattePurple: isDark ? '#A78BFA' : '#8B5CF6',
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
