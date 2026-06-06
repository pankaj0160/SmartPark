import { useContext } from 'react';
import { ThemeContext } from './ThemeContext.js';

/**
 * useTheme()
 *
 * Returns the current theme context. Must be used inside <ThemeProvider>.
 *
 * @returns {{
 *   theme:         'light' | 'dark' | 'system',
 *   resolvedTheme: 'light' | 'dark',
 *   setTheme:      (t: string) => void,
 *   toggleTheme:   () => void
 * }}
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return context;
}
