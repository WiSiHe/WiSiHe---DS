'use client';

import { useState } from 'react';

type ColorScale = {
  name: string;
  colors: { name: string; value: string }[];
};

const numericScales: ColorScale[] = [
  {
    name: 'Neutral',
    colors: [
      { name: 'neutral-50', value: 'var(--color-neutral-50)' },
      { name: 'neutral-100', value: 'var(--color-neutral-100)' },
      { name: 'neutral-200', value: 'var(--color-neutral-200)' },
      { name: 'neutral-300', value: 'var(--color-neutral-300)' },
      { name: 'neutral-400', value: 'var(--color-neutral-400)' },
      { name: 'neutral-500', value: 'var(--color-neutral-500)' },
      { name: 'neutral-600', value: 'var(--color-neutral-600)' },
      { name: 'neutral-700', value: 'var(--color-neutral-700)' },
      { name: 'neutral-800', value: 'var(--color-neutral-800)' },
      { name: 'neutral-900', value: 'var(--color-neutral-900)' },
      { name: 'neutral-950', value: 'var(--color-neutral-950)' },
    ],
  },
  {
    name: 'Accent',
    colors: [
      { name: 'accent-50', value: 'var(--color-accent-50)' },
      { name: 'accent-100', value: 'var(--color-accent-100)' },
      { name: 'accent-200', value: 'var(--color-accent-200)' },
      { name: 'accent-300', value: 'var(--color-accent-300)' },
      { name: 'accent-400', value: 'var(--color-accent-400)' },
      { name: 'accent-500', value: 'var(--color-accent-500)' },
      { name: 'accent-600', value: 'var(--color-accent-600)' },
      { name: 'accent-700', value: 'var(--color-accent-700)' },
      { name: 'accent-800', value: 'var(--color-accent-800)' },
      { name: 'accent-900', value: 'var(--color-accent-900)' },
      { name: 'accent-950', value: 'var(--color-accent-950)' },
    ],
  },
  {
    name: 'Success',
    colors: [
      { name: 'success-50', value: 'var(--color-success-50)' },
      { name: 'success-100', value: 'var(--color-success-100)' },
      { name: 'success-200', value: 'var(--color-success-200)' },
      { name: 'success-300', value: 'var(--color-success-300)' },
      { name: 'success-400', value: 'var(--color-success-400)' },
      { name: 'success-500', value: 'var(--color-success-500)' },
      { name: 'success-600', value: 'var(--color-success-600)' },
      { name: 'success-700', value: 'var(--color-success-700)' },
      { name: 'success-800', value: 'var(--color-success-800)' },
      { name: 'success-900', value: 'var(--color-success-900)' },
      { name: 'success-950', value: 'var(--color-success-950)' },
    ],
  },
  {
    name: 'Warning',
    colors: [
      { name: 'warning-50', value: 'var(--color-warning-50)' },
      { name: 'warning-100', value: 'var(--color-warning-100)' },
      { name: 'warning-200', value: 'var(--color-warning-200)' },
      { name: 'warning-300', value: 'var(--color-warning-300)' },
      { name: 'warning-400', value: 'var(--color-warning-400)' },
      { name: 'warning-500', value: 'var(--color-warning-500)' },
      { name: 'warning-600', value: 'var(--color-warning-600)' },
      { name: 'warning-700', value: 'var(--color-warning-700)' },
      { name: 'warning-800', value: 'var(--color-warning-800)' },
      { name: 'warning-900', value: 'var(--color-warning-900)' },
      { name: 'warning-950', value: 'var(--color-warning-950)' },
    ],
  },
  {
    name: 'Danger',
    colors: [
      { name: 'danger-50', value: 'var(--color-danger-50)' },
      { name: 'danger-100', value: 'var(--color-danger-100)' },
      { name: 'danger-200', value: 'var(--color-danger-200)' },
      { name: 'danger-300', value: 'var(--color-danger-300)' },
      { name: 'danger-400', value: 'var(--color-danger-400)' },
      { name: 'danger-500', value: 'var(--color-danger-500)' },
      { name: 'danger-600', value: 'var(--color-danger-600)' },
      { name: 'danger-700', value: 'var(--color-danger-700)' },
      { name: 'danger-800', value: 'var(--color-danger-800)' },
      { name: 'danger-900', value: 'var(--color-danger-900)' },
      { name: 'danger-950', value: 'var(--color-danger-950)' },
    ],
  },
  {
    name: 'Info',
    colors: [
      { name: 'info-50', value: 'var(--color-info-50)' },
      { name: 'info-100', value: 'var(--color-info-100)' },
      { name: 'info-200', value: 'var(--color-info-200)' },
      { name: 'info-300', value: 'var(--color-info-300)' },
      { name: 'info-400', value: 'var(--color-info-400)' },
      { name: 'info-500', value: 'var(--color-info-500)' },
      { name: 'info-600', value: 'var(--color-info-600)' },
      { name: 'info-700', value: 'var(--color-info-700)' },
      { name: 'info-800', value: 'var(--color-info-800)' },
      { name: 'info-900', value: 'var(--color-info-900)' },
      { name: 'info-950', value: 'var(--color-info-950)' },
    ],
  },
];

const semanticColors = [
  {
    category: 'Background',
    description: 'Main page backgrounds',
    colors: [
      { name: 'background', class: 'bg-background', var: 'var(--color-background)' },
      { name: 'background-subtle', class: 'bg-background-subtle', var: 'var(--color-background-subtle)' },
    ],
  },
  {
    category: 'Surface',
    description: 'Cards, panels, elevated elements',
    colors: [
      { name: 'surface', class: 'bg-surface', var: 'var(--color-surface)' },
      { name: 'surface-subtle', class: 'bg-surface-subtle', var: 'var(--color-surface-subtle)' },
      { name: 'surface-hover', class: 'bg-surface-hover', var: 'var(--color-surface-hover)' },
      { name: 'surface-active', class: 'bg-surface-active', var: 'var(--color-surface-active)' },
      { name: 'surface-elevated', class: 'bg-surface-elevated', var: 'var(--color-surface-elevated)' },
    ],
  },
  {
    category: 'Border',
    description: 'Borders and dividers',
    colors: [
      { name: 'border', class: 'border-border', var: 'var(--color-border)' },
      { name: 'border-subtle', class: 'border-border-subtle', var: 'var(--color-border-subtle)' },
      { name: 'border-strong', class: 'border-border-strong', var: 'var(--color-border-strong)' },
    ],
  },
  {
    category: 'Foreground',
    description: 'Text and icons',
    colors: [
      { name: 'foreground', class: 'text-foreground', var: 'var(--color-foreground)' },
      { name: 'foreground-subtle', class: 'text-foreground-subtle', var: 'var(--color-foreground-subtle)' },
      { name: 'foreground-muted', class: 'text-foreground-muted', var: 'var(--color-foreground-muted)' },
    ],
  },
  {
    category: 'Accent',
    description: 'Primary brand color (Teal)',
    colors: [
      { name: 'accent', class: 'bg-accent', var: 'var(--color-accent)' },
      { name: 'accent-hover', class: 'bg-accent-hover', var: 'var(--color-accent-hover)' },
      { name: 'accent-active', class: 'bg-accent-active', var: 'var(--color-accent-active)' },
      { name: 'accent-subtle', class: 'bg-accent-subtle', var: 'var(--color-accent-subtle)' },
      { name: 'accent-contrast', class: 'bg-accent-contrast', var: 'var(--color-accent-contrast)' },
      { name: 'accent-surface', class: 'bg-accent-surface', var: 'var(--color-accent-surface)' },
      { name: 'accent-border', class: 'border-accent-border', var: 'var(--color-accent-border)' },
      { name: 'accent-text', class: 'text-accent-text', var: 'var(--color-accent-text)' },
    ],
  },
  {
    category: 'Success',
    description: 'Green for positive actions',
    colors: [
      { name: 'success', class: 'bg-success', var: 'var(--color-success)' },
      { name: 'success-contrast', class: 'bg-success-contrast', var: 'var(--color-success-contrast)' },
      { name: 'success-subtle', class: 'bg-success-subtle', var: 'var(--color-success-subtle)' },
      { name: 'success-text', class: 'text-success-text', var: 'var(--color-success-text)' },
    ],
  },
  {
    category: 'Warning',
    description: 'Orange for warnings',
    colors: [
      { name: 'warning', class: 'bg-warning', var: 'var(--color-warning)' },
      { name: 'warning-contrast', class: 'bg-warning-contrast', var: 'var(--color-warning-contrast)' },
      { name: 'warning-subtle', class: 'bg-warning-subtle', var: 'var(--color-warning-subtle)' },
      { name: 'warning-text', class: 'text-warning-text', var: 'var(--color-warning-text)' },
    ],
  },
  {
    category: 'Danger',
    description: 'Red for errors and destructive actions',
    colors: [
      { name: 'danger', class: 'bg-danger', var: 'var(--color-danger)' },
      { name: 'danger-contrast', class: 'bg-danger-contrast', var: 'var(--color-danger-contrast)' },
      { name: 'danger-subtle', class: 'bg-danger-subtle', var: 'var(--color-danger-subtle)' },
      { name: 'danger-text', class: 'text-danger-text', var: 'var(--color-danger-text)' },
    ],
  },
  {
    category: 'Info',
    description: 'Blue for informational messages',
    colors: [
      { name: 'info', class: 'bg-info', var: 'var(--color-info)' },
      { name: 'info-contrast', class: 'bg-info-contrast', var: 'var(--color-info-contrast)' },
      { name: 'info-subtle', class: 'bg-info-subtle', var: 'var(--color-info-subtle)' },
      { name: 'info-text', class: 'text-info-text', var: 'var(--color-info-text)' },
    ],
  },
];

export default function ColorsPage() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (text: string, colorName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(colorName);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-foreground mb-4">
            Color System
          </h1>
          <p className="text-lg text-foreground-subtle max-w-3xl">
            A comprehensive color system with semantic colors (theme-aware) and numeric scales
            (fixed). Semantic colors adapt to light/dark mode, while numeric scales remain
            consistent.
          </p>
        </div>

        {/* Semantic Colors Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold font-serif text-foreground mb-2">
            Semantic Colors
          </h2>
          <p className="text-foreground-subtle mb-8">
            Theme-aware colors that change between light and dark mode. Use these for UI elements.
          </p>

          <div className="space-y-12">
            {semanticColors.map((group) => (
              <div key={group.category} className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    {group.category}
                  </h3>
                  <p className="text-sm text-foreground-muted">{group.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {group.colors.map((color) => {
                    const isTextColor = color.class.startsWith('text-');
                    const isBorderColor = color.class.startsWith('border-');
                    const displayClass = isTextColor
                      ? color.class
                      : isBorderColor
                        ? `border-2 ${color.class}`
                        : color.class;

                    return (
                      <div
                        key={color.name}
                        className="group relative bg-surface border border-border rounded-lg p-4 hover:border-accent transition-colors cursor-pointer"
                        onClick={() => copyToClipboard(color.var, color.name)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-medium text-foreground text-sm mb-1">
                              {color.name}
                            </div>
                            <div className="text-xs text-foreground-muted font-mono">
                              {color.class}
                            </div>
                          </div>
                          {copiedColor === color.name && (
                            <span className="text-xs text-accent font-medium">Copied!</span>
                          )}
                        </div>

                        {/* Color Swatch */}
                        <div className="space-y-2">
                          {isTextColor ? (
                            <div className={`${displayClass} text-lg font-semibold py-2 px-3 rounded bg-surface-subtle`}>
                              Sample Text
                            </div>
                          ) : isBorderColor ? (
                            <div className={`${displayClass} h-12 rounded bg-surface`} />
                          ) : (
                            <div className={`${displayClass} h-12 rounded`} />
                          )}
                        </div>

                        {/* CSS Variable */}
                        <div className="mt-3 pt-3 border-t border-border-subtle">
                          <div className="text-xs text-foreground-muted font-mono break-all">
                            {color.var}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Numeric Scales Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold font-serif text-foreground mb-2">
            Numeric Color Scales
          </h2>
          <p className="text-foreground-subtle mb-8">
            Fixed colors that remain consistent across themes. Use for precise control and custom
            designs.
          </p>

          <div className="space-y-12">
            {numericScales.map((scale) => (
              <div key={scale.name} className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">{scale.name} Scale</h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2">
                  {scale.colors.map((color) => (
                    <div
                      key={color.name}
                      className="group relative cursor-pointer"
                      onClick={() => copyToClipboard(color.value, color.name)}
                    >
                      <div
                        className="h-20 rounded-lg border border-border hover:border-accent transition-colors mb-2"
                        style={{ backgroundColor: color.value }}
                      />
                      <div className="text-xs font-medium text-foreground mb-1">
                        {color.name.split('-')[1]}
                      </div>
                      <div className="text-xs text-foreground-muted font-mono truncate">
                        {color.name}
                      </div>
                      {copiedColor === color.name && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded text-xs whitespace-nowrap">
                          Copied!
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Usage Examples */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold font-serif text-foreground mb-2">
            Usage Examples
          </h2>
          <p className="text-foreground-subtle mb-8">
            Examples of how to use the color system in your components.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buttons */}
            <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-accent text-accent-contrast rounded-lg font-medium hover:bg-accent-hover transition-colors">
                  Primary
                </button>
                <button className="px-4 py-2 bg-surface border border-border text-foreground rounded-lg font-medium hover:bg-surface-hover transition-colors">
                  Secondary
                </button>
                <button className="px-4 py-2 bg-success text-success-contrast rounded-lg font-medium hover:opacity-90 transition-opacity">
                  Success
                </button>
                <button className="px-4 py-2 bg-danger text-danger-contrast rounded-lg font-medium hover:opacity-90 transition-opacity">
                  Danger
                </button>
              </div>
            </div>

            {/* Cards */}
            <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Cards</h3>
              <div className="space-y-3">
                <div className="bg-surface-subtle border border-border-subtle rounded-lg p-4">
                  <div className="font-medium text-foreground mb-1">Card Title</div>
                  <div className="text-sm text-foreground-subtle">
                    Card content with subtle background
                  </div>
                </div>
                <div className="bg-accent-subtle border border-accent-border rounded-lg p-4">
                  <div className="font-medium text-accent-text mb-1">Accent Card</div>
                  <div className="text-sm text-foreground-subtle">
                    Card with accent background
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Alerts</h3>
              <div className="space-y-3">
                <div className="bg-success-subtle border border-success/30 rounded-lg p-4">
                  <div className="font-medium text-success-text mb-1">Success</div>
                  <div className="text-sm text-foreground-subtle">
                    Operation completed successfully
                  </div>
                </div>
                <div className="bg-warning-subtle border border-warning/30 rounded-lg p-4">
                  <div className="font-medium text-warning-text mb-1">Warning</div>
                  <div className="text-sm text-foreground-subtle">
                    Please review before proceeding
                  </div>
                </div>
                <div className="bg-danger-subtle border border-danger/30 rounded-lg p-4">
                  <div className="font-medium text-danger-text mb-1">Error</div>
                  <div className="text-sm text-foreground-subtle">
                    Something went wrong
                  </div>
                </div>
                <div className="bg-info-subtle border border-info/30 rounded-lg p-4">
                  <div className="font-medium text-info-text mb-1">Info</div>
                  <div className="text-sm text-foreground-subtle">
                    Here's some helpful information
                  </div>
                </div>
              </div>
            </div>

            {/* Text Hierarchy */}
            <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Text Hierarchy</h3>
              <div className="space-y-2">
                <div className="text-foreground text-xl font-semibold">Primary Text</div>
                <div className="text-foreground-subtle text-base">
                  Secondary text for descriptions
                </div>
                <div className="text-foreground-muted text-sm">
                  Muted text for less important information
                </div>
                <div className="text-accent font-medium">Accent colored text</div>
                <div className="text-success font-medium">Success message</div>
                <div className="text-danger font-medium">Error message</div>
              </div>
            </div>
          </div>
        </section>

        {/* CSS Variables Reference */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold font-serif text-foreground mb-2">
            CSS Variables Reference
          </h2>
          <p className="text-foreground-subtle mb-8">
            All available CSS variables for direct use in your styles.
          </p>

          <div className="bg-surface border border-border rounded-lg p-6 overflow-x-auto">
            <pre className="text-sm text-foreground-muted font-mono">
              <code>{`/* Semantic Colors (Theme-aware) */
--color-background
--color-background-subtle
--color-surface
--color-surface-subtle
--color-surface-hover
--color-surface-active
--color-surface-elevated
--color-border
--color-border-subtle
--color-border-strong
--color-foreground
--color-foreground-subtle
--color-foreground-muted
--color-accent
--color-accent-hover
--color-accent-active
--color-accent-subtle
--color-accent-contrast
--color-accent-surface
--color-accent-border
--color-accent-text
--color-success
--color-success-contrast
--color-success-subtle
--color-success-text
--color-warning
--color-warning-contrast
--color-warning-subtle
--color-warning-text
--color-danger
--color-danger-contrast
--color-danger-subtle
--color-danger-text
--color-info
--color-info-contrast
--color-info-subtle
--color-info-text

/* Numeric Scales (Fixed) */
--color-neutral-50 through --color-neutral-950
--color-accent-50 through --color-accent-950
--color-success-50 through --color-success-950
--color-warning-50 through --color-warning-950
--color-danger-50 through --color-danger-950
--color-info-50 through --color-info-950`}</code>
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}


