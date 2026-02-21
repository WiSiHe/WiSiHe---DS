import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { cva } from 'class-variance-authority';
import { cn } from '@wisihe/utils';

const badge = cva(
  'inline-flex items-center rounded-full border font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
  {
    variants: {
      variant: {
        default: 'bg-accent text-accent-contrast border-transparent hover:bg-accent-hover',
        secondary: 'bg-surface-hover text-foreground border-transparent hover:bg-surface-active',
        success: 'bg-success text-success-contrast border-transparent hover:bg-success-text',
        warning: 'bg-warning text-warning-contrast border-transparent hover:bg-warning-text',
        danger: 'bg-danger text-danger-contrast border-transparent hover:bg-danger-text',
        outline: 'bg-transparent text-foreground border-border hover:bg-surface-hover',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'wisihe-badge',
  standalone: true,
  template: `
    <span [class]="classes">
      <ng-content></ng-content>
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'default';
  @Input() size: BadgeSize = 'md';
  @Input() className = '';

  get classes(): string {
    return cn(
      badge({
        variant: this.variant,
        size: this.size,
      }),
      this.className,
    );
  }
}
