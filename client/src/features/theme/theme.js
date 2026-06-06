export const THEME_STORAGE_KEY = 'smartpark_theme';
export const themeOptions = ['light', 'dark', 'system'];

// ─────────────────────────────────────────────────────────────
// Stored preference
// ─────────────────────────────────────────────────────────────

export function getStoredTheme() {
  if (typeof localStorage === 'undefined') return 'system';
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return themeOptions.includes(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

// ─────────────────────────────────────────────────────────────
// Resolution
// ─────────────────────────────────────────────────────────────

export function getResolvedTheme(theme, prefersDark) {
  if (theme === 'system') return prefersDark ? 'dark' : 'light';
  return theme;
}

// ─────────────────────────────────────────────────────────────
// Design tokens — light
// Dark text on white/grey — high contrast
// ─────────────────────────────────────────────────────────────

const LIGHT_TOKENS = {
  '--app-bg':             '#f8fafc',
  '--app-surface':        '#ffffff',
  '--app-surface-muted':  '#f1f5f9',
  '--app-surface-subtle': '#e2e8f0',
  '--app-surface-strong': '#0f172a',
  '--app-border':         '#e2e8f0',
  '--app-border-strong':  '#cbd5e1',
  // TEXT — dark, crisp, readable on white
  '--app-text':           '#0f172a',   // near-black — headings, labels
  '--app-text-muted':     '#334155',   // dark slate — body copy
  '--app-text-soft':      '#64748b',   // medium grey — hints, placeholders
  '--app-pill':           '#f1f5f9',
  '--app-shadow':         '0 4px 24px rgba(15, 23, 42, 0.08)',
  '--app-shadow-lg':      '0 10px 40px rgba(15, 23, 42, 0.12)',
};

// ─────────────────────────────────────────────────────────────
// Design tokens — dark
// Bright text on dark — clearly visible, no eye strain
// ─────────────────────────────────────────────────────────────

const DARK_TOKENS = {
  '--app-bg':             '#0f172a',
  '--app-surface':        '#1e293b',
  '--app-surface-muted':  '#263347',
  '--app-surface-subtle': '#2d3e52',
  '--app-surface-strong': '#020617',
  '--app-border':         'rgba(148, 163, 184, 0.18)',
  '--app-border-strong':  'rgba(148, 163, 184, 0.32)',
  // TEXT — bright, clearly visible on dark backgrounds
  '--app-text':           '#f1f5f9',   // near-white — headings, labels
  '--app-text-muted':     '#cbd5e1',   // light grey-blue — body copy
  '--app-text-soft':      '#94a3b8',   // medium grey — hints, placeholders
  '--app-pill':           'rgba(148, 163, 184, 0.14)',
  '--app-shadow':         '0 4px 24px rgba(0, 0, 0, 0.40)',
  '--app-shadow-lg':      '0 10px 40px rgba(0, 0, 0, 0.55)',
};

// ─────────────────────────────────────────────────────────────
// Apply to document
// Sets data-theme, color-scheme, classes, and all CSS variables
// ─────────────────────────────────────────────────────────────

export function applyThemeToDocument(theme, prefersDark) {
  if (typeof document === 'undefined') {
    return getResolvedTheme(theme, prefersDark);
  }

  const resolvedTheme = getResolvedTheme(theme, prefersDark);
  const root = document.documentElement;

  // Attribute + classes (used by CSS selectors and Tailwind dark: variants)
  root.dataset.theme     = resolvedTheme;
  root.style.colorScheme = resolvedTheme;
  root.classList.toggle('dark',  resolvedTheme === 'dark');
  root.classList.toggle('light', resolvedTheme === 'light');

  // Inject all design tokens so var(--app-*) always reflects
  // the current theme immediately — no flash on switch
  const tokens = resolvedTheme === 'dark' ? DARK_TOKENS : LIGHT_TOKENS;
  for (const [key, value] of Object.entries(tokens)) {
    root.style.setProperty(key, value);
  }

  return resolvedTheme;
}
