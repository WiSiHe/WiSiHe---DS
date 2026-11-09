import { Description, Field, Switch as HeadlessSwitch, Label } from '@headlessui/react';
import { cn } from '@wisihe/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const trackVariants = cva(
  [
    'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-border-strong data-checked:border-transparent',
    'transition-colors duration-200 ease-in-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    // Unchecked: use border + surface so the track outline is visible in both light/dark
    'bg-surface-subtle data-checked:bg-accent',
  ],
  {
    variants: {
      size: {
        sm: 'h-5 w-9',
        default: 'h-6 w-11',
        lg: 'h-7 w-14',
      },
    },
    defaultVariants: { size: 'default' },
  },
);

const thumbVariants = cva(
  [
    'pointer-events-none inline-block rounded-full bg-foreground group-data-checked:bg-accent-contrast shadow ring-0',
    'transition-transform duration-200 ease-in-out',
  ],
  {
    variants: {
      size: {
        sm: 'size-4 translate-x-0 group-data-checked:translate-x-4',
        default: 'size-5 translate-x-0 group-data-checked:translate-x-5',
        lg: 'size-6 translate-x-0 group-data-checked:translate-x-7',
      },
    },
    defaultVariants: { size: 'default' },
  },
);

export interface SwitchProps
  extends Omit<React.ComponentProps<typeof HeadlessSwitch>, 'className'>,
    VariantProps<typeof trackVariants> {
  /** Always required for accessibility. */
  label: string;
  className?: string;
}

/**
 * Bare toggle widget. `label` is always supplied for aria-label.
 * For a labelled field use `SwitchField` instead.
 */
export function Switch({ label, size, className, ...props }: Readonly<SwitchProps>) {
  return (
    <HeadlessSwitch
      aria-label={label}
      className={cn(trackVariants({ size }), 'group', className)}
      {...props}
    >
      <span className={thumbVariants({ size })} aria-hidden='true' />
    </HeadlessSwitch>
  );
}

// ── SwitchField ────────────────────────────────────────────────────────────────

export interface SwitchFieldProps extends SwitchProps {
  /**
   * Optional helper text shown below the label.
   * Wired to the switch via `aria-describedby` automatically.
   */
  description?: string;
}

/**
 * Fully accessible switch with a visible label and optional description.
 * Uses HeadlessUI Field + Label + Description so clicking the label text
 * toggles the switch and screen readers receive all context.
 */
export function SwitchField({
  label,
  description,
  size,
  className,
  ...props
}: Readonly<SwitchFieldProps>) {
  return (
    <Field className='flex items-center gap-3'>
      <HeadlessSwitch className={cn(trackVariants({ size }), 'group', className)} {...props}>
        <span className={thumbVariants({ size })} aria-hidden='true' />
      </HeadlessSwitch>

      <div className='flex flex-col gap-0.5'>
        {/* HeadlessUI Label clicking toggles the associated Switch in the Field */}
        <Label className='text-sm font-medium text-foreground leading-none cursor-pointer'>
          {label}
        </Label>
        {description && (
          <Description className='text-xs text-foreground-muted'>{description}</Description>
        )}
      </div>
    </Field>
  );
}
