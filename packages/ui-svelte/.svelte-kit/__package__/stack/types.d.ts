import type { HTMLAttributes } from 'svelte/elements';
export type StackDirection = 'row' | 'column';
export type StackGap = 'none' | 'sm' | 'md' | 'lg';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch';
export type StackJustify = 'start' | 'center' | 'end' | 'between';
export type StackProps = HTMLAttributes<HTMLDivElement> & {
    direction?: StackDirection;
    gap?: StackGap;
    align?: StackAlign;
    justify?: StackJustify;
    wrap?: boolean;
};
//# sourceMappingURL=types.d.ts.map