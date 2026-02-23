'use client';

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { cn } from '@wisihe/utils';
import { AnimatePresence, motion } from 'motion/react';
import { IoCheckmarkCircleOutline, IoChevronDownCircleOutline } from 'react-icons/io5';

type SelectProps = {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  label: string;
};

export const Select = ({ label, options, value, onChange }: SelectProps) => {
  return (
    <div className='relative mt-4'>
      <label className='block mb-1 text-sm font-semibold text-foreground'>{label}</label>
      <Listbox value={value} onChange={onChange}>
        {({ open }) => (
          <div className='relative w-full'>
            {/* --- Button --- */}
            <ListboxButton className='relative flex items-center justify-between w-full px-3 py-2 text-left transition-colors border rounded-md shadow-xs cursor-pointer border-border bg-surface hover:bg-surface-hover focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-1 text-foreground'>
              <span className='block truncate'>
                {options.find(option => option.value === value)?.label}
              </span>
              <div className='flex items-center pointer-events-none'>
                <IoChevronDownCircleOutline
                  className={cn(
                    'w-4 h-4 text-foreground-subtle transition-all',
                    open && ' rotate-180',
                  )}
                  aria-hidden='true'
                />
              </div>
            </ListboxButton>

            <AnimatePresence>
              {open && (
                <ListboxOptions
                  static
                  as={motion.div}
                  initial={{
                    opacity: 0,
                    // height: 0.5,
                    scaleY: 0.5,
                    y: -5,
                    transition: {
                      // duration: 0.4,
                      type: 'spring',
                    },
                  }}
                  animate={{
                    opacity: 1,
                    scaleY: 1,
                    // height: 'auto',
                    y: 0,
                    transition: {
                      // duration: 0.4,
                      type: 'spring',
                    },
                  }}
                  exit={{
                    opacity: 0,
                    scaleY: 0.5,
                    // height: 0.5,
                    y: -5,
                    transition: {
                      // duration: 0.4,
                      type: 'spring',
                    },
                  }}
                  // anchor="bottom"
                  className='absolute z-10 w-full mt-1 overflow-auto origin-top rounded-md shadow-lg bg-surface max-h-60 ring-1 ring-border-subtle focus:outline-hidden sm:text-sm'
                >
                  {options.map(option => (
                    <ListboxOption
                      key={option.value}
                      value={option.value}
                      className={({ selected, focus }) =>
                        cn(
                          'relative cursor-pointer flex gap-2 select-none py-2 px-4 transition-colors',
                          focus && 'bg-surface-hover',
                          selected ? 'bg-accent-subtle text-accent-text' : 'text-foreground',
                        )
                      }
                    >
                      {({ selected }) => (
                        <>
                          {selected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className='flex items-center text-accent-text'
                            >
                              <IoCheckmarkCircleOutline className='w-4 h-4' aria-hidden='true' />
                            </motion.div>
                          )}
                          <span>{option.label}</span>
                        </>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              )}
            </AnimatePresence>
          </div>
        )}
      </Listbox>
    </div>
  );
};
