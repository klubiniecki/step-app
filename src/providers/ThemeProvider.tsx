import React, { createContext, useContext, useMemo, useState } from 'react';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

type ThemeContextValue = {
  mode: 'light' | 'dark';
  setMode: (m: 'light' | 'dark') => void;
  paperTheme: typeof MD3LightTheme;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const GREEN = {
  primary: '#10b981',
  secondary: '#34d399',
  error: '#ef4444',
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  const paperTheme = useMemo(() => {
    const base = mode === 'dark' ? MD3DarkTheme : MD3LightTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: GREEN.primary,
        secondary: GREEN.secondary,
        error: GREEN.error,
      },
    } as typeof MD3LightTheme;
  }, [mode]);

  const value: ThemeContextValue = { mode, setMode, paperTheme };
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeProvider');
  return ctx;
}
