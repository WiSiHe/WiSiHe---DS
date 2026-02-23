'use client';

import { useState } from 'react';
import { IoCheckmark, IoHeart, IoStar } from 'react-icons/io5';
import Chip from './Chip';

const ChipDemo = () => {
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [removableChips, setRemovableChips] = useState([
    'Design',
    'Development',
    'React',
    'TypeScript',
  ]);

  const handleToggleChip = (label: string) => {
    setSelectedChips(prev =>
      prev.includes(label) ? prev.filter(chip => chip !== label) : [...prev, label],
    );
  };

  const handleRemoveChip = (label: string) => {
    setRemovableChips(prev => prev.filter(chip => chip !== label));
  };

  return (
    <div className='p-8 space-y-8 bg-surface rounded-xl'>
      <h2 className='text-2xl font-bold text-foreground mb-6'>Chip Component Demo</h2>

      {/* Basic Variations */}
      <section className='space-y-4'>
        <h3 className='text-lg font-semibold text-foreground'>Basic Variations</h3>
        <div className='flex flex-wrap gap-3'>
          <Chip label='Default' />
          <Chip label='Primary' variation='primary' />
          <Chip label='Secondary' variation='secondary' />
          <Chip label='Tertiary' variation='tertiary' />
          <Chip label='Highlight' variation='highlight' />
          <Chip label='Success' variation='success' />
        </div>
      </section>

      {/* Outlined Chips */}
      <section className='space-y-4'>
        <h3 className='text-lg font-semibold text-foreground'>Outlined Chips</h3>
        <div className='flex flex-wrap gap-3'>
          <Chip label='Outlined Default' outlined />
          <Chip label='Outlined Primary' variation='primary' outlined />
          <Chip label='Outlined Secondary' variation='secondary' outlined />
          <Chip label='Outlined Highlight' variation='highlight' outlined />
        </div>
      </section>

      {/* Interactive Chips */}
      <section className='space-y-4'>
        <h3 className='text-lg font-semibold text-foreground'>Interactive Chips</h3>
        <div className='flex flex-wrap gap-3'>
          {['Design', 'Development', 'UI/UX', 'Frontend', 'Backend'].map(label => (
            <Chip
              key={label}
              label={label}
              selected={selectedChips.includes(label)}
              onClick={() => handleToggleChip(label)}
              outlined
            />
          ))}
        </div>
        <p className='text-sm text-foreground-subtle'>
          Selected: {selectedChips.length > 0 ? selectedChips.join(', ') : 'None'}
        </p>
      </section>

      {/* Chips with Icons */}
      <section className='space-y-4'>
        <h3 className='text-lg font-semibold text-foreground'>Chips with Icons</h3>
        <div className='flex flex-wrap gap-3'>
          <Chip label='Favorite' Icon={IoHeart} variation='highlight' />
          <Chip label='Starred' Icon={IoStar} variation='primary' />
          <Chip label='Completed' Icon={IoCheckmark} variation='secondary' />
          <Chip label='Icon Right' Icon={IoHeart} iconPosition='right' outlined />
        </div>
      </section>

      {/* Removable Chips */}
      <section className='space-y-4'>
        <h3 className='text-lg font-semibold text-foreground'>Removable Chips</h3>
        <div className='flex flex-wrap gap-3'>
          {removableChips.map(label => (
            <Chip
              key={label}
              label={label}
              removable
              onRemove={() => handleRemoveChip(label)}
              variation='primary'
            />
          ))}
        </div>
        {removableChips.length === 0 && (
          <p className='text-sm text-foreground-muted italic'>All chips removed</p>
        )}
      </section>

      {/* Different Sizes */}
      <section className='space-y-4'>
        <h3 className='text-lg font-semibold text-foreground'>Different Sizes</h3>
        <div className='flex flex-wrap items-center gap-3'>
          <Chip label='Small' size='small' />
          <Chip label='Medium' size='medium' />
          <Chip label='Large' size='large' />
        </div>
      </section>

      {/* Disabled Chips */}
      <section className='space-y-4'>
        <h3 className='text-lg font-semibold text-foreground'>Disabled Chips</h3>
        <div className='flex flex-wrap gap-3'>
          <Chip label='Disabled Default' disabled />
          <Chip label='Disabled Primary' variation='primary' disabled />
          <Chip label='Disabled Interactive' disabled interactive />
        </div>
      </section>

      {/* Non-interactive Chips */}
      <section className='space-y-4'>
        <h3 className='text-lg font-semibold text-foreground'>Non-interactive Chips</h3>
        <div className='flex flex-wrap gap-3'>
          <Chip label='Read Only' interactive={false} />
          <Chip label='Static' interactive={false} variation='secondary' />
        </div>
      </section>

      {/* Complex Examples */}
      <section className='space-y-4'>
        <h3 className='text-lg font-semibold text-foreground'>Complex Examples</h3>
        <div className='flex flex-wrap gap-3'>
          <Chip
            label='Project Status'
            additionalText='Active'
            Icon={IoCheckmark}
            variation='success'
            size='large'
          />
          <Chip
            label='Priority'
            additionalText='High'
            Icon={IoStar}
            variation='highlight'
            outlined
          />
          <Chip
            label='Category'
            additionalText='Design'
            Icon={IoHeart}
            variation='primary'
            removable
            onRemove={() => console.log('Removed')}
          />
        </div>
      </section>
    </div>
  );
};

export default ChipDemo;
