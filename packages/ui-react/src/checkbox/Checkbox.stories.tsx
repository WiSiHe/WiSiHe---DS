import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Design System/Atoms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error'],
    },
    inputSize: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: args => {
    const [enabled, setEnabled] = useState(false);
    return (
      <div className='flex items-center gap-3'>
        <Checkbox {...args} checked={enabled} onChange={setEnabled} />
        <button
          type='button'
          className='text-sm font-medium text-foreground cursor-pointer bg-transparent border-0 p-0 text-left'
          onClick={() => setEnabled(!enabled)}
        >
          Accept terms and conditions
        </button>
      </div>
    );
  },
};

export const States: Story = {
  render: () => (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-3'>
        <Checkbox checked={false} onChange={() => {}} />
        <span className='text-sm text-foreground'>Unchecked</span>
      </div>
      <div className='flex items-center gap-3'>
        <Checkbox checked={true} onChange={() => {}} />
        <span className='text-sm text-foreground'>Checked</span>
      </div>
      <div className='flex items-center gap-3'>
        <Checkbox
          checked={false}
          onChange={() => {}}
          disabled
          className='opacity-50 cursor-not-allowed'
        />
        <span className='text-sm text-foreground'>Disabled</span>
      </div>
      <div className='flex items-center gap-3'>
        <Checkbox checked={false} onChange={() => {}} variant='error' />
        <span className='text-sm text-error'>Error State</span>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-3'>
        <Checkbox checked={true} onChange={() => {}} inputSize='sm' />
        <span className='text-sm text-foreground'>Small</span>
      </div>
      <div className='flex items-center gap-3'>
        <Checkbox checked={true} onChange={() => {}} inputSize='default' />
        <span className='text-sm text-foreground'>Default</span>
      </div>
      <div className='flex items-center gap-3'>
        <Checkbox checked={true} onChange={() => {}} inputSize='lg' />
        <span className='text-sm text-foreground'>Large</span>
      </div>
    </div>
  ),
};
