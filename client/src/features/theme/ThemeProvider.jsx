import { useEffect, useMemo, useState } from 'react';
import { ThemeContext } from './ThemeContext.js';
import {
  applyThemeToDocument,
  FONT_GOOGLE_URL,
  getResolvedTheme,
  getStoredTheme,
} from './theme.js';

/**
 * ThemeProvider
 *
 * Responsibilities:
 *  1. Injects Google Fonts (Sora + Inter + JetBrains Mono) once on mount.
 *  2. Listens to the OS prefers-color-scheme media query.
 *  3. Persists theme preference to localStorage.
 *  4. Applies all design-token CSS variables to <html> via applyThemeToDocument().
 *  5. Exposes { theme, resolvedTheme, setTheme, toggleTheme } via ThemeContext.
 */
export function ThemeProvider({ children }) {
  const [theme,      setThemeState] = useState(() => getStoredTheme());
  const [prefersDark, setPrefersDark] = useState(() => readPrefersDark());

  // ── Inject Google Fonts once ──────────────────────────────────────────────
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Preconnect hints
    ensureLink('https://fonts.googleapis.com',      'preconnect');
    ensureLink('https://fonts.gstatic.com',         'preconnect', true);

    // Font stylesheet — only inject if not already there
    const existing = document.querySelector(`link[href="${FONT_GOOGLE_URL}"]`);
    if (!existing) {
      const link = document.createElement('link');
      link.rel  = 'stylesheet';
      link.href = FONT_GOOGLE_URL;
      document.head.appendChild(link);
    }
  }, []);

  // ── OS dark-mode listener ─────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setPrefersDark(e.matches);

    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  // ── Apply theme tokens + persist ──────────────────────────────────────────
  useEffect(() => {
    applyThemeToDocument(theme, prefersDark);

    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem('smartpark_theme', theme);
    } catch {
      // Ignore — in-memory theme is already applied.
    }
  }, [prefersDark, theme]);

  // ── Context value ─────────────────────────────────────────────────────────
  const value = useMemo(
    () => ({
      theme,
      resolvedTheme: getResolvedTheme(theme, prefersDark),

      setTheme: setThemeState,

      /** Toggles between light and dark (ignores 'system' — commits to explicit choice). */
      toggleTheme: () =>
        setThemeState((current) =>
          getResolvedTheme(current, prefersDark) === 'dark' ? 'light' : 'dark'
        ),
    }),
    [prefersDark, theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function readPrefersDark() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/** Idempotent — only creates the <link> if one with that href doesn't exist. */
function ensureLink(href, rel, crossOrigin = false) {
  if (document.querySelector(`link[href="${href}"][rel="${rel}"]`)) return;
  const link = document.createElement('link');
  link.rel  = rel;
  link.href = href;
  if (crossOrigin) link.crossOrigin = '';
  document.head.insertBefore(link, document.head.firstChild);
}
