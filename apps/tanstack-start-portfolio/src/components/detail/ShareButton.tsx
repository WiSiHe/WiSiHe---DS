'use client';

import { IconShare } from '@tabler/icons-react';
import { Button } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import { useCallback, useState } from 'react';

type ShareButtonProps = {
  title: string;
  className?: string;
  variant?: 'secondary' | 'primary';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
};

export function ShareButton({
  title,
  className,
  variant = 'secondary',
  size = 'small',
  fullWidth = false,
}: ShareButtonProps) {
  const [shareText, setShareText] = useState('Share');

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled or share failed */
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareText('Copied!');
      window.setTimeout(() => setShareText('Share'), 2500);
    } catch {
      /* clipboard unavailable */
    }
  }, [title]);

  return (
    <Button
      type='button'
      onClick={() => void handleShare()}
      variant={variant}
      size={size}
      className={cn('gap-1.5 rounded-full', fullWidth && 'flex-1', className)}
    >
      <IconShare className='size-3.5' stroke={2} aria-hidden />
      {shareText}
    </Button>
  );
}
