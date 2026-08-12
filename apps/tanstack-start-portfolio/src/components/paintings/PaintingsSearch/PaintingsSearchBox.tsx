'use client';

import { IconCircleX, IconSearch } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import { useEffect, useRef, useState } from 'react';
import { usePaintingsSearchContext } from '@/lib/algolia/paintingsSearch/PaintingsSearchProvider';

export default function PaintingsSearchBox() {
  const { query, setQuery } = usePaintingsSearchContext();
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const commitQuery = (value: string) => {
    setQuery(value);
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
        aria-label='Search paintings'
        value={inputValue}
        onChange={event => setInputValue(event.target.value)}
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
          className='absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors'
        >
          <IconCircleX className='size-4' stroke={2} aria-hidden />
        </button>
      ) : null}
    </form>
  );
}
