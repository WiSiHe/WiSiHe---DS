import { cn } from '@wisihe/utils';

export const MAIN_CONTENT_ID = 'main-content';

function focusMainContent() {
  // Browsers vary in whether a same-page hash link moves focus to its target, so focus it
  // explicitly. `tabIndex={-1}` on <main> makes it a valid, non-tab-order focus target.
  document.getElementById(MAIN_CONTENT_ID)?.focus();
}

/** First focusable element on every page; lets keyboard and screen-reader users bypass the header/nav. */
export function SkipToContentLink() {
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      onClick={focusMainContent}
      className={cn(
        'fixed top-4 left-1/2 z-60 -translate-x-1/2 opacity-0 transition-opacity duration-150',
        'pointer-events-none focus:pointer-events-auto focus:opacity-100',
        'rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground shadow-lg',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      )}
    >
      Skip to main content
    </a>
  );
}
