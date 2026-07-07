import { getGlobalLenis } from '@/app/lib/lenis-registry';

type ScrollControllableLenis = {
  stop?: () => void;
  start?: () => void;
};

let lockCount = 0;
let savedStyles: {
  htmlOverflow: string;
  bodyOverflow: string;
  bodyPaddingRight: string;
} | null = null;

/** Ref-counted document scroll lock — works with native scroll and Lenis. */
export function lockDocumentScroll(): void {
  if (typeof document === 'undefined') return;

  lockCount += 1;
  if (lockCount !== 1) return;

  const lenis = getGlobalLenis() as ScrollControllableLenis | null;
  lenis?.stop?.();

  const { style: htmlStyle } = document.documentElement;
  const { style: bodyStyle } = document.body;
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

  savedStyles = {
    htmlOverflow: htmlStyle.overflow,
    bodyOverflow: bodyStyle.overflow,
    bodyPaddingRight: bodyStyle.paddingRight,
  };

  htmlStyle.overflow = 'hidden';
  bodyStyle.overflow = 'hidden';
  if (scrollbarWidth > 0) {
    bodyStyle.paddingRight = `${scrollbarWidth}px`;
  }
}

export function unlockDocumentScroll(): void {
  if (typeof document === 'undefined' || lockCount === 0) return;

  lockCount -= 1;
  if (lockCount !== 0) return;

  const lenis = getGlobalLenis() as ScrollControllableLenis | null;
  const { style: htmlStyle } = document.documentElement;
  const { style: bodyStyle } = document.body;

  if (savedStyles) {
    htmlStyle.overflow = savedStyles.htmlOverflow;
    bodyStyle.overflow = savedStyles.bodyOverflow;
    bodyStyle.paddingRight = savedStyles.bodyPaddingRight;
    savedStyles = null;
  }

  lenis?.start?.();
}
