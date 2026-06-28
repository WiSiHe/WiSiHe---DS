'use client';

import { IconCircleX, IconSearch } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import { useEffect, useRef, useState } from 'react';
import { usePaintingsSearchContext } from '@/lib/algolia/paintingsSearch/PaintingsSearchProvider';

const SEARCH_DEBOUNCE_MS = 300;

export default function PaintingsSearchBox() {
  const { query, setQuery } = usePaintingsSearchContext();
  const [inputValue, setInputValue] = useState(query);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const commitQuery = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setQuery(value);
  };

  const scheduleQuery = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setQuery(value), SEARCH_DEBOUNCE_MS);
  };

  const handleChange = (value: string) => {
    setInputValue(value);
    scheduleQuery(value);
  };

  const handleClear = () => {
    setInputValue('');
    commitQuery('');
    inputRef.current?.focus();
  };

  return (
    <form
      className='relative w-full'
      onSubmit={event => {
        event.preventDefault();
        commitQuery(inputValue);
      }}
    >
      <IconSearch
        className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none'
        stroke={2}
        aria-hidden
      />
      <input
        ref={inputRef}
        type='search'
        aria-label='Search paintings'
        value={inputValue}
        onChange={event => handleChange(event.target.value)}
        onKeyDown={event => {
          if (event.key === 'Enter') commitQuery(inputValue);
          if (event.key === 'Escape') handleClear();
        }}
        placeholder='Search paintings…'
        className={cn(
          'w-full pl-9 pr-8 py-2 rounded-full text-sm',
          'bg-surface border border-border text-foreground',
          'placeholder:text-foreground-muted',
          'focus:outline-none focus:border-accent',
          '[&::-webkit-search-cancel-button]:hidden',
        )}
      />
      {inputValue ? (
        <button
          type='button'
          onClick={handleClear}
          aria-label='Clear search'
          className='absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground'
        >
          <IconCircleX className='size-4' stroke={2} aria-hidden />
        </button>
      ) : null}
    </form>
  );
}
