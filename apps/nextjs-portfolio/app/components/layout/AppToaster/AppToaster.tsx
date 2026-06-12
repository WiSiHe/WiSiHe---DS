'use client';

import { Toaster } from 'sonner';

export default function AppToaster() {
  return (
    <Toaster
      position='bottom-center'
      toastOptions={{
        classNames: {
          toast: 'bg-surface border border-border text-foreground shadow-lg rounded-xl font-sans',
          success: 'border-success/30',
          error: 'border-error-500/30',
        },
      }}
    />
  );
}
