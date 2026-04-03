// Ambient CSS module declaration — satisfies `noUncheckedSideEffectImports` for CSS side-effect imports
declare module '*.css' {
  const content: string;
  export default content;
}

// Minimal Lenis type declaration (lenis@1.x ships no separate @types package)
declare module 'lenis' {
  export interface LenisOptions {
    wrapper?: HTMLElement | Window;
    content?: HTMLElement;
    duration?: number;
    easing?: (t: number) => number;
    lerp?: number;
    smoothWheel?: boolean;
    wheelMultiplier?: number;
    touchMultiplier?: number;
    syncTouch?: boolean;
    syncTouchLerp?: number;
    infinite?: boolean;
  }

  export default class Lenis {
    scroll: number;
    constructor(options?: LenisOptions);
    on(event: 'scroll' | string, callback: (...args: unknown[]) => void): void;
    off(event: 'scroll' | string, callback: (...args: unknown[]) => void): void;
    raf(time: number): void;
    destroy(): void;
  }
}
