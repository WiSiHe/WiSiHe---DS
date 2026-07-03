'use client';

import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/app/providers';

type PortableTextCodeBlockProps = {
  code: string;
  language?: string;
  filename?: string;
};

export function PortableTextCodeBlock({ code, language, filename }: PortableTextCodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';
  const style = isDark ? oneDark : oneLight;

  return (
    <figure className='not-prose my-5 w-full overflow-x-auto rounded-xl border border-border/70 bg-surface-elevated'>
      {filename ? (
        <figcaption className='border-b border-border/70 px-4 py-2 text-xs font-mono text-foreground-muted'>
          {filename}
        </figcaption>
      ) : null}
      <SyntaxHighlighter
        language={language || 'text'}
        style={style}
        customStyle={{
          margin: 0,
          padding: '1rem',
          fontSize: '0.8125rem',
          lineHeight: '1.65',
          background: 'transparent',
        }}
        PreTag='div'
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </figure>
  );
}
