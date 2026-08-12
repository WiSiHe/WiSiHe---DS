'use client';

type DraftModeBannerProps = {
  enabled: boolean;
};

export function DraftModeBanner({ enabled }: DraftModeBannerProps) {
  if (!enabled) return null;

  return (
    <div className='fixed bottom-4 right-4 z-[100] flex items-center gap-3 rounded-full border border-accent/30 bg-surface-elevated px-4 py-2 text-xs shadow-lg'>
      <span className='font-mono uppercase tracking-widest text-accent'>Draft preview</span>
      <a
        href='/api/draft-mode/disable'
        className='text-foreground/70 underline hover:text-foreground'
      >
        Exit
      </a>
    </div>
  );
}
