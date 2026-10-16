import interLatinWoff2 from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url';
import { Scripts } from '@tanstack/react-router';
import { cn } from '@wisihe/utils';
import type { CSSProperties, ReactNode } from 'react';
import { getResolvedTheme, useThemeStore } from '../../lib/store';
import { Meta } from './Meta';

export function RootDocument({ children }: { children: ReactNode }) {
  const theme = useThemeStore(state => state.theme);
  const resolved = getResolvedTheme(theme);

  // The theme class is applied by the inline script below (and the persisted store) before React hydrates, so it
  // legitimately differs from the server HTML; suppressHydrationWarning silences that on <html>/<body> only.
  return (
    <html lang='en' className={cn(resolved, 'scroll-smooth')} suppressHydrationWarning>
      <head>
        <link
          rel='preload'
          href={interLatinWoff2}
          as='font'
          type='font/woff2'
          crossOrigin='anonymous'
        />
        <Meta />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Flash prevention
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme-storage');
                  var mode = 'system';
                  if (theme) {
                    var parsed = JSON.parse(theme);
                    if (parsed.state && parsed.state.theme) mode = parsed.state.theme;
                  }
                  var resolved = mode;
                  if (mode === 'system') {
                    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.classList.add(resolved);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          'antialiased transition-colors duration-300 bg-background text-foreground',
          'font-[family-name:var(--font-inter)]',
        )}
        style={
          {
            '--font-geist-sans': '"Geist Sans", ui-sans-serif, system-ui, sans-serif',
            '--font-geist-mono': '"Geist Mono", ui-monospace, monospace',
            '--font-inter': '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
          } as CSSProperties
        }
      >
        {children}
        <Scripts />
      </body>
    </html>
  );
}
