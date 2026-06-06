import { useEffect, useMemo, useState } from 'react';
import { ThemeContext } from './ThemeContext.js';
import { applyThemeToDocument, getResolvedTheme, getStoredTheme } from './theme.js';

export function ThemeProvider({ children }) {
  const [theme,       setThemeState] = useState(() => getStoredTheme());
  const [prefersDark, setPrefersDark] = useState(() => readPrefersDark());

  // Listen for OS dark-mode changes
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setPrefersDark(e.matches);

    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  // Apply theme tokens to <html> and persist preference
  useEffect(() => {
    applyThemeToDocument(theme, prefersDark);

    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem('smartpark_theme', theme);
    } catch {
      // Ignore — in-memory theme is still applied correctly.
    }
  }, [prefersDark, theme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme: getResolvedTheme(theme, prefersDark),
      setTheme: setThemeState,
      toggleTheme: () =>
        setThemeState((current) =>
          getResolvedTheme(current, prefersDark) === 'dark' ? 'light' : 'dark'
        ),
    }),
    [prefersDark, theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function readPrefersDark() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
