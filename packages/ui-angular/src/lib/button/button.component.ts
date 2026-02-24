import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { cn } from '@wisihe/utils';
import { cva } from 'class-variance-authority';

const button = cva(
  'inline-flex items-center justify-center gap-2 rounded-sm border font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-accent-contrast border-transparent hover:bg-accent-hover',
        secondary: 'bg-surface text-foreground border-border hover:bg-surface-hover',
        ghost: 'bg-transparent text-accent border-transparent hover:bg-accent-subtle',
        danger: 'bg-danger text-danger-contrast border-transparent hover:bg-danger-text',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'wisihe-button',
  standalone: true,
  imports: [NgIf],
  template: `
    <button
      [attr.type]="type"
      [class]="classes"
      [disabled]="isDisabled"
      [attr.aria-busy]="loading || null"
    >
      <span
        *ngIf="loading"
        class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        aria-hidden="true"
      ></span>
      <ng-content></ng-content>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() disabled = false;
  @Input() type: ButtonType = 'button';
  @Input() className = '';

  get isDisabled(): boolean {
    return this.disabled || this.loading;
  }

  get classes(): string {
    return cn(
      button({
        variant: this.variant,
        size: this.size,
        fullWidth: this.fullWidth,
      }),
      this.className,
    );
  }
}
