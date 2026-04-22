import { useCallback, useLayoutEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'theme';

export function getTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === 'dark' ? 'dark' : 'light';
}

function applyThemeClass(theme: Theme) {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function setTheme(theme: Theme) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  applyThemeClass(theme);
}

export function toggleTheme(currentTheme?: Theme) {
  const nextTheme = (currentTheme ?? getTheme()) === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
  return nextTheme;
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => getTheme());

  useLayoutEffect(() => {
    const initialTheme = getTheme();
    applyThemeClass(initialTheme);
    setThemeState(initialTheme);
  }, []);

  const updateTheme = useCallback((nextTheme: Theme) => {
    setTheme(nextTheme);
    setThemeState(nextTheme);
  }, []);

  const handleToggleTheme = useCallback(() => {
    const nextTheme = toggleTheme(theme);
    setThemeState(nextTheme);
  }, [theme]);

  return {
    theme,
    getTheme,
    setTheme: updateTheme,
    toggleTheme: handleToggleTheme,
  };
}
