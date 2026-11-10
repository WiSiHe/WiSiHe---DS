import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildTokenResolutionRoot,
  resolveRgbChannels,
  resolveTokenValue,
} from '../scripts/lib/token-loader.js';

const root = buildTokenResolutionRoot();
const color = (theme, name) =>
  resolveTokenValue(`{semantic.${theme === 'dark' ? 'dark.' : ''}color.${name}}`, root);

function luminance(hex) {
  assert.match(hex, /^#[\da-f]{6}$/i);
  const channels = [1, 3, 5].map(i => {
    const value = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test('interactive and status text pairs meet AA in both themes and states', () => {
  for (const theme of ['light', 'dark']) {
    const pairs = [
      ...['foreground', 'foreground-subtle', 'foreground-muted'].flatMap(foreground =>
        [
          'background',
          'surface',
          'surface-elevated',
          'surface-subtle',
          'surface-hover',
          'surface-active',
        ].map(background => [foreground, background]),
      ),
      ['accent', 'surface'],
      ['accent-text', 'surface-active'],
      ['accent-text', 'accent-subtle'],
      ['accent-text', 'accent-surface'],
      ['foreground', 'danger-subtle'],
      ['foreground-muted', 'danger-subtle'],
      ['danger-text', 'background'],
      ...['success', 'warning', 'danger', 'info'].map(role => [`${role}-text`, `${role}-subtle`]),
      ...['accent', 'success', 'warning', 'danger', 'info'].flatMap(role =>
        ['', '-hover', '-active'].map(state => [`${role}-contrast`, `${role}${state}`]),
      ),
      ...['accent-warm', 'accent-cool'].flatMap(role =>
        ['', '-hover'].map(state => [`${role}-contrast`, `${role}${state}`]),
      ),
    ];
    for (const [foreground, background] of pairs) {
      const ratio = contrast(color(theme, foreground), color(theme, background));
      assert.ok(ratio >= 4.5, `${theme}: ${foreground} on ${background} is ${ratio.toFixed(2)}:1`);
    }
  }
});

test('elevated surfaces are neutral and distinct from tinted surfaces', () => {
  for (const theme of ['light', 'dark']) {
    assert.notEqual(color(theme, 'surface-elevated'), color(theme, 'surface-subtle'));
    for (const background of [
      'background',
      'surface',
      'surface-elevated',
      'surface-subtle',
      'surface-hover',
      'surface-active',
    ]) {
      assert.ok(contrast(color(theme, 'border-strong'), color(theme, background)) >= 3);
    }
    for (const background of [
      'background',
      'surface',
      'surface-elevated',
      'surface-subtle',
      'surface-hover',
      'surface-active',
      'accent-subtle',
      'danger-subtle',
    ]) {
      assert.ok(
        contrast(color(theme, 'ring'), color(theme, background)) >= 3,
        `${theme}: ring on ${background}`,
      );
    }
    for (const foreground of ['danger', 'danger-hover']) {
      for (const background of ['background', 'danger-subtle']) {
        assert.ok(
          contrast(color(theme, foreground), color(theme, background)) >= 3,
          `${theme}: ${foreground} on ${background}`,
        );
      }
    }
  }
});

test('legacy RGB channels resolve from the theme accent', () => {
  assert.equal(resolveRgbChannels('{semantic.color.accent}', root), '218, 44, 0');
  assert.equal(resolveRgbChannels('{semantic.dark.color.accent}', root), '255, 84, 176');
});

test('dark corners are sharp while full radius remains circular', () => {
  for (const size of ['sm', 'md', 'lg', 'xl', '2xl', '3xl']) {
    assert.equal(resolveTokenValue(`{semantic.dark.size.radius.${size}}`, root), '0px');
    assert.notEqual(resolveTokenValue(`{semantic.size.radius.${size}}`, root), '0px');
  }
  assert.equal(resolveTokenValue('{semantic.dark.size.radius.full}', root), '9999px');
  assert.equal(resolveTokenValue('{semantic.size.radius.full}', root), '9999px');
});

test('floating shadow varies by theme and glow is dark-only', () => {
  assert.notEqual(
    resolveTokenValue('{semantic.shadow.floating}', root),
    resolveTokenValue('{semantic.dark.shadow.floating}', root),
  );
  assert.equal(resolveTokenValue('{semantic.shadow.glow}', root), '0 0 0 0 transparent');
  assert.match(
    resolveTokenValue('{semantic.dark.shadow.glow}', root),
    /semantic\.dark\.color\.accent/,
  );
});
