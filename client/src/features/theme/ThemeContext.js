import { createContext } from 'react';

/**
 * ThemeContext
 *
 * Shape: {
 *   theme:         'light' | 'dark' | 'system'   — stored preference
 *   resolvedTheme: 'light' | 'dark'               — what's actually rendered
 *   setTheme:      (theme: string) => void
 *   toggleTheme:   () => void                     — flips light ↔ dark
 * }
 */
export const ThemeContext = createContext(null);
