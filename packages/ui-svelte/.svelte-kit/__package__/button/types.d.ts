import type { HTMLButtonAttributes } from 'svelte/elements';
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonProps = HTMLButtonAttributes & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    fullWidth?: boolean;
};
//# sourceMappingURL=types.d.ts.map