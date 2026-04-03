import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { IconChevronDown } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

export interface SelectOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

const selectVariants = cva(
  [
    'relative w-full cursor-pointer rounded-md border border-input bg-background py-2 pl-3 pr-10 text-left text-sm text-foreground',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 transition-colors group',
  ],
  {
    variants: {
      variant: {
        default: 'hover:border-border',
        filled:
          'bg-muted border-transparent hover:bg-muted/80 focus-visible:bg-background focus-visible:border-ring',
      },
      selectSize: {
        default: 'h-10 text-sm',
        sm: 'h-8 text-xs py-1',
        lg: 'h-12 text-base py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      selectSize: 'default',
    },
  },
);

export interface SelectProps extends VariantProps<typeof selectVariants> {
  options: SelectOption[];
  value: SelectOption | null;
  onChange: (value: SelectOption) => void;
  /** Visible or screen-reader-only label for the listbox trigger. */
  label: string;
  /** Hides the label visually while keeping it available to assistive tech. */
  hideLabel?: boolean;
  className?: string;
  placeholder?: string;
  icon?: React.ReactNode;
}

export function Select({
  options,
  value,
  onChange,
  label,
  hideLabel,
  className,
  variant,
  selectSize,
  placeholder,
  icon,
}: Readonly<SelectProps>) {
  const selectedOption = value;
  const generatedId = React.useId();
  const labelId = `${generatedId}-label`;
  const buttonId = `${generatedId}-button`;
  const leadingIcon = icon ?? selectedOption?.icon;

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      <label
        id={labelId}
        htmlFor={buttonId}
        className={cn('text-sm font-medium leading-none text-foreground', hideLabel && 'sr-only')}
      >
        {label}
      </label>
      <Listbox value={selectedOption || undefined} onChange={onChange}>
        <div className='relative w-full'>
          <ListboxButton id={buttonId} className={selectVariants({ variant, selectSize })}>
            <span className='flex items-center gap-2 truncate'>
              {leadingIcon ? (
                <span className='text-muted-foreground group-hover:text-foreground transition-colors'>
                  {leadingIcon}
                </span>
              ) : null}
              {selectedOption ? (
                selectedOption.label
              ) : (
                <span className='text-muted-foreground'>{placeholder}</span>
              )}
            </span>
            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
              <IconChevronDown
                className='h-4 w-4 text-muted-foreground transition-transform group-data-open:rotate-180'
                aria-hidden
              />
            </span>
          </ListboxButton>
          <ListboxOptions
            transition
            className='absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-surface border border-border py-1 text-base shadow-md focus:outline-none sm:text-sm transition duration-100 ease-in data-leave:data-closed:opacity-0 origin-top'
          >
            {options.map(option => (
              <ListboxOption
                key={option.value}
                className='group relative cursor-pointer select-none py-2 pl-3 pr-9 text-foreground data-focus:bg-surface-hover data-focus:text-foreground transition-colors'
                value={option}
              >
                <div className='flex items-center gap-2'>
                  {option.icon && (
                    <span className='text-muted-foreground group-data-focus:text-foreground transition-colors'>
                      {option.icon}
                    </span>
                  )}
                  <span className='block truncate font-normal group-data-selected:font-medium text-sm'>
                    {option.label}
                  </span>
                </div>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
