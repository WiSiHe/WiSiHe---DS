'use client';

import {
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Combobox as HeadlessCombobox,
} from '@headlessui/react';
import { IconCheck, IconChevronDown, IconSearch } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import * as React from 'react';

export interface ComboboxItem<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps<T = string> {
  /** Always required for accessibility. Use `hideLabel` to visually hide it. */
  label: string;
  /** Hides the label visually while keeping it readable by screen readers */
  hideLabel?: boolean;
  /** Optional helper text shown between the label and input */
  description?: string;
  /** Error message shown below; also applies error styling */
  errorMessage?: string;
  options: ComboboxItem<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  /** Controlled query for filtering — manage externally or let the component handle it */
  query?: string;
  onQueryChange?: (query: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function Combobox<T extends string | number = string>({
  label,
  hideLabel,
  description,
  errorMessage,
  options,
  value,
  onChange,
  query: externalQuery,
  onQueryChange,
  placeholder = 'Search...',
  disabled,
  className,
}: Readonly<ComboboxProps<T>>) {
  const generatedId = React.useId();
  const labelId = `${generatedId}-label`;
  const descriptionId = `${generatedId}-description`;
  const errorId = `${generatedId}-error`;

  const [internalQuery, setInternalQuery] = React.useState('');
  const query = externalQuery ?? internalQuery;

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setInternalQuery(q);
    onQueryChange?.(q);
  };

  const filteredOptions =
    query === ''
      ? options
      : options.filter(opt => opt.label.toLowerCase().includes(query.toLowerCase()));

  const hasError = !!errorMessage;

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      <label
        id={labelId}
        htmlFor={`${generatedId}-input`}
        className={cn('text-sm font-medium leading-none text-foreground', hideLabel && 'sr-only')}
      >
        {label}
      </label>

      {description && (
        <p id={descriptionId} className='text-xs text-foreground-muted'>
          {description}
        </p>
      )}

      <HeadlessCombobox value={value} onChange={onChange} disabled={disabled}>
        <div className='relative'>
          {/* Search icon */}
          <div className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted'>
            <IconSearch className='size-4' />
          </div>

          <ComboboxInput
            id={`${generatedId}-input`}
            aria-labelledby={labelId}
            aria-describedby={
              [hasError && errorId, description && descriptionId].filter(Boolean).join(' ') ||
              undefined
            }
            aria-invalid={hasError || undefined}
            displayValue={(val: T | null) =>
              val !== null ? (options.find(o => o.value === val)?.label ?? '') : ''
            }
            onChange={handleQueryChange}
            placeholder={placeholder}
            className={cn(
              'flex w-full rounded-md border bg-background pl-9 pr-10 py-2 text-sm text-foreground',
              'placeholder:text-foreground-muted transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              hasError
                ? 'border-danger bg-danger-subtle hover:border-danger-hover focus-visible:ring-danger'
                : 'border-border-strong focus-visible:ring-ring',
            )}
          />

          <ComboboxButton
            type='button'
            aria-label='Show options'
            className='absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors'
          >
            <IconChevronDown className='size-4' aria-hidden />
          </ComboboxButton>
        </div>

        <ComboboxOptions
          anchor='bottom start'
          className={cn(
            'z-50 w-(--input-width) rounded-xl border border-border bg-surface-elevated p-1 shadow-floating',
            'text-sm text-foreground empty:hidden [--anchor-gap:4px]',
            'transition-all duration-150 ease-out origin-top',
            'data-enter:opacity-100 data-enter:scale-100',
            'data-leave:opacity-0 data-leave:scale-95',
          )}
        >
          {filteredOptions.length === 0 ? (
            <div className='px-3 py-2 text-sm text-foreground-muted'>No results found.</div>
          ) : (
            filteredOptions.map(opt => (
              <ComboboxOption
                key={String(opt.value)}
                value={opt.value}
                disabled={opt.disabled}
                className={cn(
                  'flex items-center justify-between gap-2 rounded-lg px-3 py-2 cursor-pointer',
                  'text-foreground hover:bg-surface-hover transition-colors',
                  'data-focus:bg-surface-hover data-selected:font-medium',
                  'data-disabled:opacity-50 data-disabled:cursor-not-allowed',
                )}
              >
                {({ selected }) => (
                  <>
                    <span>{opt.label}</span>
                    {selected && <IconCheck className='size-4 text-accent shrink-0' />}
                  </>
                )}
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
      </HeadlessCombobox>

      {errorMessage && (
        <p id={errorId} role='alert' className='text-xs font-medium text-danger-text'>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
