import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from './Badge';

const meta = {
  title: 'Design System/Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'destructive',
        'success',
        'warning',
        'accent',
        'outline',
        'accent-warm',
        'accent-cool',
      ],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div className='flex flex-wrap items-center gap-2'>
      {(
        [
          'default',
          'secondary',
          'destructive',
          'success',
          'warning',
          'accent',
          'outline',
          'accent-warm',
          'accent-cool',
        ] as const
      ).map(variant => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
