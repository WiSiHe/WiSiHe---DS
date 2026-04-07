'use client';

import { Button, Input } from '@wisihe/ui-react';
import * as React from 'react';
import { IoCloseCircle, IoSearchOutline } from 'react-icons/io5';
import { useSearchBox } from 'react-instantsearch';

export default function CustomSearchBox(props: Parameters<typeof useSearchBox>[0]) {
  const { query, refine } = useSearchBox(props);
  const [inputValue, setInputValue] = React.useState(query);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally only depends on query to avoid sync loop
  React.useEffect(() => {
    if (query !== inputValue) setInputValue(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refine(inputValue);
  };

  return (
    <form onSubmit={handleSubmit} className='flex gap-2 w-full'>
      <Input
        ref={inputRef}
        label='Search paintings'
        hideLabel
        value={inputValue}
        onChange={e => {
          setInputValue(e.target.value);
        }}
        placeholder='Search paintings...'
        leftIcon={<IoSearchOutline className='w-5 h-5 shrink-0' />}
        rightIcon={
          inputValue ? (
            <Button
              type='button'
              variant='tertiary'
              size='icon'
              onClick={() => {
                setInputValue('');
                refine('');
              }}
              className='p-1 h-auto w-auto text-muted-foreground hover:text-foreground shrink-0 rounded-full pointer-events-auto'
            >
              <IoCloseCircle className='w-5 h-5' />
            </Button>
          ) : null
        }
      />
      <Button type='submit' variant='primary' className='shrink-0'>
        Search
      </Button>
    </form>
  );
}
