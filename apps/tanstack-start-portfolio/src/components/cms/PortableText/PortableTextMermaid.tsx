'use client';

import { cn } from '@wisihe/utils';
import { useEffect, useId, useRef, useState } from 'react';
import { getResolvedTheme, useThemeStore } from '@/lib/store';

type PortableTextMermaidProps = {
  code: string;
  caption?: string | null;
};

type RenderState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready' }
  | { status: 'error'; message: string };

export function PortableTextMermaid({ code, caption }: PortableTextMermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reactId = useId().replace(/:/g, '');
  const theme = useThemeStore(state => state.theme);
  const [mounted, setMounted] = useState(false);
  const [renderState, setRenderState] = useState<RenderState>({ status: 'idle' });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const trimmed = code?.trim();
    const container = containerRef.current;

    if (!mounted || !trimmed || !container) {
      return;
    }

    let cancelled = false;
    setRenderState({ status: 'loading' });
    const resolvedTheme = getResolvedTheme(theme);

    void import('mermaid')
      .then(({ default: mermaid }) => {
        if (cancelled) return;

        mermaid.initialize({
          startOnLoad: false,
          theme: resolvedTheme === 'dark' ? 'dark' : 'default',
          securityLevel: 'strict',
          fontFamily: 'inherit',
        });

        const renderId = `mermaid-${reactId}-${Date.now()}`;
        container.replaceChildren();

        return mermaid.render(renderId, trimmed);
      })
      .then(result => {
        if (cancelled || !result || !containerRef.current) return;

        containerRef.current.replaceChildren();
        const wrapper = document.createElement('div');
        wrapper.innerHTML = result.svg;
        wrapper.setAttribute('role', 'img');
        if (caption?.trim()) {
          wrapper.setAttribute('aria-label', caption.trim());
        }
        containerRef.current.append(wrapper);
        setRenderState({ status: 'ready' });
      })
      .catch(error => {
        if (cancelled) return;
        const message =
          error instanceof Error ? error.message : 'Could not render Mermaid diagram.';
        setRenderState({ status: 'error', message });
      });

    return () => {
      cancelled = true;
    };
  }, [mounted, code, caption, reactId, theme]);

  const trimmed = code?.trim();
  if (!trimmed) return null;

  return (
    <figure
      className={cn(
        'not-prose my-5 w-full overflow-x-auto rounded-xl border border-border/70 bg-surface-elevated',
        renderState.status === 'loading' && 'min-h-32 animate-pulse',
      )}
    >
      <div className='flex justify-center p-4 md:p-5'>
        <div
          ref={containerRef}
          className={cn(
            'mermaid-diagram w-full max-w-full [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full',
            renderState.status === 'loading' && 'opacity-0',
          )}
        />
      </div>

      {renderState.status === 'error' ? (
        <div className='border-t border-border/70 px-4 py-3 text-sm text-foreground-subtle'>
          <p className='font-medium text-foreground'>Diagram could not be rendered.</p>
          <p className='mt-1 text-xs'>{renderState.message}</p>
          <pre className='mt-3 overflow-x-auto rounded-lg bg-surface-subtle p-3 font-mono text-xs leading-relaxed text-foreground-muted'>
            {trimmed}
          </pre>
        </div>
      ) : null}

      {caption?.trim() ? (
        <figcaption className='border-t border-border/70 px-4 py-2.5 text-center text-sm text-foreground-muted'>
          {caption.trim()}
        </figcaption>
      ) : null}
    </figure>
  );
}
