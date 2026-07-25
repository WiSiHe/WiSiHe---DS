'use client';

import { IconCircleX, IconSearch } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import * as React from 'react';
import { useSearchBox } from 'react-instantsearch';

type CustomSearchBoxProps = Parameters<typeof useSearchBox>[0] & {
  inputLabel?: string;
  placeholder?: string;
};

export default function CustomSearchBox({
  inputLabel = 'Search paintings',
  placeholder = 'Search paintings…',
  ...searchBoxProps
}: CustomSearchBoxProps) {
  const { query, refine } = useSearchBox(searchBoxProps);
  const [inputValue, setInputValue] = React.useState(query);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Keep local value in sync with external query (e.g. cleared via URL)
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally only on query
  React.useEffect(() => {
    if (query !== inputValue) setInputValue(query);
  }, [query]);

  const searchImmediately = (value: string) => {
    refine(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchImmediately(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchImmediately(inputValue);
    }
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  const handleClear = () => {
    setInputValue('');
    searchImmediately('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className='relative w-full'>
      <button
        type='submit'
        aria-label='Search'
        className='absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors'
      >
        <IconSearch className='size-4' stroke={2} aria-hidden />
      </button>
      <input
        ref={inputRef}
        type='search'
        aria-label={inputLabel}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          'w-full pl-9 pr-8 py-2 rounded-full text-sm',
          'bg-surface border border-border text-foreground',
          'placeholder:text-foreground-muted',
          'focus:outline-none focus:border-accent',
          'transition-colors duration-150',
          '[&::-webkit-search-cancel-button]:hidden',
        )}
      />
      {inputValue && (
        <button
          type='button'
          onClick={handleClear}
          aria-label='Clear search'
          className='absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors'
        >
          <IconCircleX className='size-4' stroke={2} aria-hidden />
        </button>
      )}
    </form>
  );
}
