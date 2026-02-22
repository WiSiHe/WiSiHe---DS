import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'circular', 'rectangular'],
    },
    animation: {
      control: 'select',
      options: ['pulse', 'none'],
    },
    className: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Text: Story = {
  args: {
    variant: 'text',
    className: 'w-[250px]',
  },
};

export const Circular: Story = {
  args: {
    variant: 'circular',
  },
};

export const Rectangular: Story = {
  args: {
    variant: 'rectangular',
    className: 'w-[250px] h-[150px]',
  },
};

export const CardSkeleton: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4 border border-border rounded-xl w-[300px]">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton variant="text" />
          <Skeleton variant="text" className="w-2/3" />
        </div>
      </div>
      <Skeleton variant="rectangular" className="h-[150px] mt-2" />
    </div>
  ),
};
