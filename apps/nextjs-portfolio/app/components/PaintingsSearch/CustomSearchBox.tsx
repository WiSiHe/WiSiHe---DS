'use client';

import { Button, Input } from '@wisihe/ui-react';
import * as React from 'react';
import { IoCloseCircle, IoSearchOutline } from 'react-icons/io5';
import { useSearchBox } from 'react-instantsearch';

export default function CustomSearchBox(props: Parameters<typeof useSearchBox>[0]) {
  const { query, refine } = useSearchBox(props);
  const [inputValue, setInputValue] = React.useState(query);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (query !== inputValue) setInputValue(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <Input
      ref={inputRef}
      value={inputValue}
      onChange={e => {
        setInputValue(e.target.value);
        refine(e.target.value);
      }}
      placeholder='Search paintings...'
      leftIcon={<IoSearchOutline className='w-5 h-5 shrink-0' />}
      rightIcon={
        inputValue ? (
          <Button
            variant='tertiary'
            size='icon'
            onClick={() => {
              setInputValue('');
              refine('');
            }}
            className='p-1 h-auto w-auto text-muted-foreground hover:text-foreground shrink-0 rounded-full'
          >
            <IoCloseCircle className='w-5 h-5' />
          </Button>
        ) : null
      }
    />
  );
}
