'use client';

import { cn } from '@wisihe/utils';
import { CodeHighlighter } from './CodeHighlighter';

interface CodeExampleWrapperProps {
  code: string;
  shouldAnimate?: boolean;
  currentSlide: number;
  className?: string;
}

export function CodeExampleWrapper({
  code,
  shouldAnimate,
  currentSlide,
  className = '',
}: CodeExampleWrapperProps) {
  const codeBlock = (
    <div
      className={cn('mb-8 rounded-xl overflow-hidden border border-border/50 bg-surface-elevated/50 shadow-xl', className)}
    >
      <div className="bg-surface-elevated/80 px-5 py-3 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-accent" />
          <span className="text-xs font-mono text-foreground/70 uppercase tracking-wider font-semibold">
            Code Example
          </span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
      </div>
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <CodeHighlighter language="tsx" code={code} />
      </div>
    </div>
  );

  return codeBlock;
}
