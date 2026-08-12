import { Scripts } from '@tanstack/react-router';
import { cn } from '@wisihe/utils';
import type { CSSProperties, ReactNode } from 'react';
import { getResolvedTheme, useThemeStore } from '../../lib/store';
import { Meta } from './Meta';

export function RootDocument({ children }: { children: ReactNode }) {
  const theme = useThemeStore(state => state.theme);
  const resolved = getResolvedTheme(theme);

  return (
    <html lang='en' className={cn(resolved, 'scroll-smooth')}>
      <head>
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
        className={cn(
          'antialiased transition-colors duration-300 bg-background text-foreground',
          'font-[family-name:var(--font-inter)]',
        )}
        style={
          {
            '--font-geist-sans': '"Geist Sans", ui-sans-serif, system-ui, sans-serif',
            '--font-geist-mono': '"Geist Mono", ui-monospace, monospace',
            '--font-inter': '"Inter", ui-sans-serif, system-ui, sans-serif',
          } as CSSProperties
        }
      >
        {children}
        <Scripts />
      </body>
    </html>
  );
}
