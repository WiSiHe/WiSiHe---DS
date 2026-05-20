import { Scripts } from '@tanstack/react-router';
import { cn } from '@wisihe/utils';
import type { ReactNode } from 'react';
import { useThemeStore } from '../../lib/store';
import { Meta } from './Meta';

export function RootDocument({ children }: { children: ReactNode }) {
  const theme = useThemeStore(state => state.theme);

  return (
    <html lang='en' className={cn(theme, 'scroll-smooth')}>
      <head>
        <Meta />
        {/* Flash prevention script */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Flash prevention script must run synchronously before rendering
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme-storage');
                  if (theme) {
                    var parsed = JSON.parse(theme);
                    if (parsed.state && parsed.state.theme) {
                      document.documentElement.classList.add(parsed.state.theme);
                    }
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className='antialiased transition-colors duration-300 bg-background text-foreground'>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
