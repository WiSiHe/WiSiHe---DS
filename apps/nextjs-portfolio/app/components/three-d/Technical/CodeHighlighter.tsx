'use client';

import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../../../providers';

interface CodeHighlighterProps {
  language: string;
  code: string;
}

const FONT_SIZES = [0.875, 1, 1.125, 1.25, 1.5, 1.75, 2];
const DEFAULT_FONT_SIZE_INDEX = 1; // 1rem

export function CodeHighlighter({ language, code }: CodeHighlighterProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [fontSizeIndex, setFontSizeIndex] = useState(DEFAULT_FONT_SIZE_INDEX);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use light theme by default until mounted to prevent hydration mismatch
  const isDark = mounted && resolvedTheme === 'dark';
  const style = isDark ? oneDark : oneLight;

  const currentFontSize = FONT_SIZES[fontSizeIndex] ?? 1;
  const canZoomIn = fontSizeIndex < FONT_SIZES.length - 1;
  const canZoomOut = fontSizeIndex > 0;

  const handleZoomIn = () => {
    if (canZoomIn) {
      setFontSizeIndex(fontSizeIndex + 1);
    }
  };

  const handleZoomOut = () => {
    if (canZoomOut) {
      setFontSizeIndex(fontSizeIndex - 1);
    }
  };

  return (
    <div className='relative'>
      <SyntaxHighlighter
        language={language}
        style={style}
        customStyle={{
          margin: 0,
          padding: '2rem',
          fontSize: `${currentFontSize}rem`,
          lineHeight: '1.6',
          background: 'transparent',
          minWidth: 'fit-content',
        }}
        PreTag='div'
        wrapLines={false}
        wrapLongLines={true}
      >
        {code}
      </SyntaxHighlighter>
      {/* Zoom Controls */}
      <div className='absolute top-4 right-4 flex items-center gap-2 bg-accent text-accent-contrast rounded-lg px-2 py-1.5 shadow-sm'>
        <button
          onClick={handleZoomOut}
          type='button'
          disabled={!canZoomOut}
          className={`p-1.5 rounded transition-all ${
            canZoomOut
              ? 'text-foreground hover:bg-surface cursor-pointer'
              : 'text-foreground/30 cursor-not-allowed'
          }`}
          aria-label='Decrease code font size'
        >
          <svg
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={2}
            stroke='currentColor'
            className='w-4 h-4'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5H6'
            />
          </svg>
        </button>
        <span
          className='text-xs font-mono text-foreground/70 min-w-[3rem] text-center'
          aria-live='polite'
        >
          {Math.round(currentFontSize * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          type='button'
          disabled={!canZoomIn}
          className={`p-1.5 rounded transition-all ${
            canZoomIn
              ? 'text-foreground hover:bg-surface cursor-pointer'
              : 'text-foreground/30 cursor-not-allowed'
          }`}
          aria-label='Increase code font size'
        >
          <svg
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={2}
            stroke='currentColor'
            className='w-4 h-4'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6'
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
