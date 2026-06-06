import test from 'node:test';
import assert from 'node:assert/strict';
import { applyThemeToDocument, getResolvedTheme, getStoredTheme, themes, themeOptions } from './theme.js';

// ── getResolvedTheme ──────────────────────────────────────────────────────────

test('resolved theme honours explicit light selection regardless of OS preference', () => {
  assert.equal(getResolvedTheme('light', true),  'light');
  assert.equal(getResolvedTheme('light', false), 'light');
});

test('resolved theme honours explicit dark selection regardless of OS preference', () => {
  assert.equal(getResolvedTheme('dark', true),  'dark');
  assert.equal(getResolvedTheme('dark', false), 'dark');
});

test('resolved theme follows OS preference when set to system', () => {
  assert.equal(getResolvedTheme('system', true),  'dark');
  assert.equal(getResolvedTheme('system', false), 'light');
});

// ── applyThemeToDocument (no DOM) ─────────────────────────────────────────────

test('applyThemeToDocument returns dark when system + prefersDark (no document)', () => {
  assert.equal(applyThemeToDocument('system', true),  'dark');
});

test('applyThemeToDocument returns light when system + not prefersDark (no document)', () => {
  assert.equal(applyThemeToDocument('system', false), 'light');
});

test('applyThemeToDocument returns explicit light (no document)', () => {
  assert.equal(applyThemeToDocument('light', true),  'light');
});

test('applyThemeToDocument returns explicit dark (no document)', () => {
  assert.equal(applyThemeToDocument('dark', false), 'dark');
});

// ── Design tokens ─────────────────────────────────────────────────────────────

test('both light and dark token maps exist', () => {
  assert.ok(themes.light, 'light tokens missing');
  assert.ok(themes.dark,  'dark tokens missing');
});

test('light and dark token maps have the same keys', () => {
  const lightKeys = Object.keys(themes.light).sort();
  const darkKeys  = Object.keys(themes.dark).sort();
  assert.deepEqual(lightKeys, darkKeys, 'token key mismatch between light and dark');
});

test('every token key starts with -- (valid CSS custom property)', () => {
  for (const [key] of Object.entries(themes.light)) {
    assert.ok(key.startsWith('--'), `invalid token key: ${key}`);
  }
});

test('core brand tokens are defined in light theme', () => {
  const required = ['--brand-500', '--brand-600', '--app-text', '--app-bg', '--app-surface'];
  for (const token of required) {
    assert.ok(themes.light[token], `missing token in light: ${token}`);
  }
});

test('core brand tokens are defined in dark theme', () => {
  const required = ['--brand-500', '--brand-600', '--app-text', '--app-bg', '--app-surface'];
  for (const token of required) {
    assert.ok(themes.dark[token], `missing token in dark: ${token}`);
  }
});

test('font tokens are present in both themes', () => {
  for (const themeKey of ['light', 'dark']) {
    assert.ok(themes[themeKey]['--font-display'], `--font-display missing in ${themeKey}`);
    assert.ok(themes[themeKey]['--font-body'],    `--font-body missing in ${themeKey}`);
    assert.ok(themes[themeKey]['--font-mono'],    `--font-mono missing in ${themeKey}`);
  }
});

// ── getStoredTheme ────────────────────────────────────────────────────────────

test('getStoredTheme returns system when localStorage is unavailable', () => {
  assert.equal(getStoredTheme(), 'system');
});

// ── themeOptions ──────────────────────────────────────────────────────────────

test('themeOptions contains light, dark and system', () => {
  assert.deepEqual([...themeOptions].sort(), ['dark', 'light', 'system']);
});
