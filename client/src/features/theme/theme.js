/**
 * theme.js
 *
 * SmartPark Design System — Theme Configuration
 *
 * Two premium themes:
 *   light — warm white canvas, deep navy text, emerald brand accents
 *   dark  — deep graphite surface, crisp sky accents, high contrast text
 *
 * Font pairing (Claude × ChatGPT hybrid):
 *   Display / headings  → "Sora"         (geometric, modern, airy)
 *   Body / UI text      → "Inter"        (neutral, ultra-readable)
 *   Mono / code         → "JetBrains Mono" (crisp, professional)
 *
 * Used by ThemeProvider.jsx — which injects Google Fonts and applies
 * CSS variables to <html data-theme="light|dark">.
 */

export const THEME_STORAGE_KEY = 'smartpark_theme';
export const themeOptions       = ['light', 'dark', 'system'];

// ─────────────────────────────────────────────────────────────────────────────
// Font stacks
// ─────────────────────────────────────────────────────────────────────────────

export const FONT_GOOGLE_URL =
  'https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap';

export const fonts = {
  display: "'Sora', 'SF Pro Display', system-ui, sans-serif",
  body:    "'Inter', 'SF Pro Text', -apple-system, system-ui, sans-serif",
  mono:    "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
};

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens per theme
// ─────────────────────────────────────────────────────────────────────────────

export const themes = {
  light: {
    // Canvas
    '--app-bg':               '#F7F8FC',
    '--app-bg-alt':           '#EEF1F8',

    // Surfaces
    '--app-surface':          '#FFFFFF',
    '--app-surface-muted':    '#F3F5FB',
    '--app-surface-subtle':   '#E8ECF4',
    '--app-surface-raised':   '#FFFFFF',
    '--app-surface-strong':   '#0F1D35',

    // Borders
    '--app-border':           '#DDE2EF',
    '--app-border-strong':    '#BFC8DC',
    '--app-border-focus':     '#168556',

    // Text — deep navy hierarchy
    '--app-text':             '#0F1D35',
    '--app-text-secondary':   '#3A4A63',
    '--app-text-muted':       '#5A6E8C',
    '--app-text-soft':        '#8496B0',
    '--app-text-inverse':     '#FFFFFF',

    // Brand — parking emerald
    '--brand-50':             '#EDFAF3',
    '--brand-100':            '#D2F4E3',
    '--brand-200':            '#A8E9CB',
    '--brand-300':            '#6DD9A8',
    '--brand-400':            '#38C485',
    '--brand-500':            '#20A66B',
    '--brand-600':            '#168556',
    '--brand-700':            '#116845',
    '--brand-800':            '#0D5238',
    '--brand-900':            '#083D2A',

    // Accent — cobalt blue (for availability, maps, links)
    '--accent-400':           '#4A90D9',
    '--accent-500':           '#2B73BF',
    '--accent-600':           '#1A5EA3',

    // Semantic
    '--color-success-bg':     '#EDFAF3',
    '--color-success-text':   '#116845',
    '--color-success-border': '#A8E9CB',
    '--color-warning-bg':     '#FFFBEB',
    '--color-warning-text':   '#92400E',
    '--color-warning-border': '#FDE68A',
    '--color-danger-bg':      '#FEF2F2',
    '--color-danger-text':    '#991B1B',
    '--color-danger-border':  '#FECACA',
    '--color-info-bg':        '#EFF6FF',
    '--color-info-text':      '#1A5EA3',
    '--color-info-border':    '#BFDBFE',

    // Special UI
    '--app-pill':             '#EEF1F8',
    '--app-pill-text':        '#3A4A63',
    '--app-shadow-sm':        '0 1px 3px rgba(15, 29, 53, 0.08), 0 1px 2px rgba(15, 29, 53, 0.04)',
    '--app-shadow':           '0 4px 16px rgba(15, 29, 53, 0.08), 0 2px 6px rgba(15, 29, 53, 0.05)',
    '--app-shadow-lg':        '0 10px 40px rgba(15, 29, 53, 0.12), 0 4px 16px rgba(15, 29, 53, 0.07)',
    '--app-shadow-xl':        '0 24px 64px rgba(15, 29, 53, 0.14), 0 8px 24px rgba(15, 29, 53, 0.08)',

    // Map overlays
    '--map-overlay-bg':       'rgba(247, 248, 252, 0.92)',
    '--map-marker-bg':        '#168556',
    '--map-marker-text':      '#FFFFFF',

    // Gradient backgrounds
    '--app-gradient-hero':    'linear-gradient(135deg, #F7F8FC 0%, #EDF9F4 50%, #F0F4FF 100%)',
    '--app-gradient-card':    'linear-gradient(180deg, #FFFFFF 0%, #F7F8FC 100%)',
    '--app-gradient-brand':   'linear-gradient(135deg, #20A66B 0%, #168556 100%)',

    // Fonts
    '--font-display':         "'Sora', 'SF Pro Display', system-ui, sans-serif",
    '--font-body':            "'Inter', 'SF Pro Text', -apple-system, system-ui, sans-serif",
    '--font-mono':            "'JetBrains Mono', 'SF Mono', monospace",
  },

  dark: {
    // Canvas — deep graphite (not pure black — more premium)
    '--app-bg':               '#0D1117',
    '--app-bg-alt':           '#080C12',

    // Surfaces — layered graphite
    '--app-surface':          '#161B27',
    '--app-surface-muted':    '#1C2333',
    '--app-surface-subtle':   '#232D42',
    '--app-surface-raised':   '#1E2840',
    '--app-surface-strong':   '#080C12',

    // Borders — subtle glow edges
    '--app-border':           'rgba(148, 163, 200, 0.12)',
    '--app-border-strong':    'rgba(148, 163, 200, 0.22)',
    '--app-border-focus':     '#38C485',

    // Text — crisp white hierarchy
    '--app-text':             '#E8EEF8',
    '--app-text-secondary':   '#B8C8E0',
    '--app-text-muted':       '#8A9BB8',
    '--app-text-soft':        '#5A6E8C',
    '--app-text-inverse':     '#0F1D35',

    // Brand — brighter emerald for dark bg contrast
    '--brand-50':             '#0A2318',
    '--brand-100':            '#0E3324',
    '--brand-200':            '#164D36',
    '--brand-300':            '#22724F',
    '--brand-400':            '#38C485',
    '--brand-500':            '#4ED49A',
    '--brand-600':            '#6BDFA F',
    '--brand-700':            '#8EEAC2',
    '--brand-800':            '#B5F2D8',
    '--brand-900':            '#D8F9EC',

    // Accent — sky blue (vivid on dark)
    '--accent-400':           '#60A5FA',
    '--accent-500':           '#3B82F6',
    '--accent-600':           '#2563EB',

    // Semantic
    '--color-success-bg':     'rgba(56, 196, 133, 0.12)',
    '--color-success-text':   '#4ED49A',
    '--color-success-border': 'rgba(56, 196, 133, 0.25)',
    '--color-warning-bg':     'rgba(251, 191, 36, 0.10)',
    '--color-warning-text':   '#FBBF24',
    '--color-warning-border': 'rgba(251, 191, 36, 0.22)',
    '--color-danger-bg':      'rgba(248, 113, 113, 0.10)',
    '--color-danger-text':    '#F87171',
    '--color-danger-border':  'rgba(248, 113, 113, 0.22)',
    '--color-info-bg':        'rgba(96, 165, 250, 0.10)',
    '--color-info-text':      '#60A5FA',
    '--color-info-border':    'rgba(96, 165, 250, 0.22)',

    // Special UI
    '--app-pill':             'rgba(148, 163, 200, 0.12)',
    '--app-pill-text':        '#B8C8E0',
    '--app-shadow-sm':        '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
    '--app-shadow':           '0 4px 16px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3)',
    '--app-shadow-lg':        '0 10px 40px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.35)',
    '--app-shadow-xl':        '0 24px 64px rgba(0, 0, 0, 0.6), 0 8px 24px rgba(0, 0, 0, 0.4)',

    // Map overlays
    '--map-overlay-bg':       'rgba(13, 17, 23, 0.92)',
    '--map-marker-bg':        '#38C485',
    '--map-marker-text':      '#0D1117',

    // Gradient backgrounds
    '--app-gradient-hero':    'linear-gradient(135deg, #0D1117 0%, #0A1C14 50%, #0D1730 100%)',
    '--app-gradient-card':    'linear-gradient(180deg, #1C2333 0%, #161B27 100%)',
    '--app-gradient-brand':   'linear-gradient(135deg, #38C485 0%, #20A66B 100%)',

    // Fonts (same family, dark mode applies via CSS variables)
    '--font-display':         "'Sora', 'SF Pro Display', system-ui, sans-serif",
    '--font-body':            "'Inter', 'SF Pro Text', -apple-system, system-ui, sans-serif",
    '--font-mono':            "'JetBrains Mono', 'SF Mono', monospace",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Core theme functions (unchanged API — fully backward compatible)
// ─────────────────────────────────────────────────────────────────────────────

export function getStoredTheme() {
  if (typeof localStorage === 'undefined') return 'system';
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return themeOptions.includes(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

export function getResolvedTheme(theme, prefersDark) {
  if (theme === 'system') return prefersDark ? 'dark' : 'light';
  return theme;
}

/**
 * Applies the resolved theme to <html> — sets data-theme, color-scheme,
 * CSS classes, and injects all design-token CSS variables.
 */
export function applyThemeToDocument(theme, prefersDark) {
  if (typeof document === 'undefined') {
    return getResolvedTheme(theme, prefersDark);
  }

  const resolvedTheme = getResolvedTheme(theme, prefersDark);
  const root          = document.documentElement;

  // Legacy attributes (keep for Tailwind dark: variant compatibility)
  root.dataset.theme    = resolvedTheme;
  root.style.colorScheme = resolvedTheme;
  root.classList.toggle('dark',  resolvedTheme === 'dark');
  root.classList.toggle('light', resolvedTheme === 'light');

  // Inject all design tokens as CSS variables
  const tokens = themes[resolvedTheme];
  Object.entries(tokens).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  return resolvedTheme;
}
