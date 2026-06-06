/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],

  // Use data-theme="dark" attribute (matches what ThemeProvider sets)
  // This makes all Tailwind `dark:` variants work correctly
  darkMode: ['selector', '[data-theme="dark"]'],

  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eefbf5',
          100: '#d6f5e6',
          500: '#20a66b',
          600: '#168556',
          700: '#126b47',
        },
        // These let you write text-app-text, bg-app-surface etc.
        // They reference the CSS variables so they auto-switch with theme.
        app: {
          text:    'var(--app-text)',
          muted:   'var(--app-text-muted)',
          soft:    'var(--app-text-soft)',
          bg:      'var(--app-bg)',
          surface: 'var(--app-surface)',
          border:  'var(--app-border)',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'SF Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
