'use client';

import { Theme } from '@/custom-app-ui/common/src/models/theme';
import { createContext, ReactNode, useContext, useMemo } from 'react';

interface ThemeContextType {
  themes: Theme[] | null;
  root?: HTMLElement;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children, themes }: { children: ReactNode; themes: Theme[] | null }) => {
  const root = typeof document !== 'undefined' ? document.documentElement : void 0;

  return (
    <ThemeContext.Provider value={useMemo(() => ({ themes, root }), [themes, root])}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
