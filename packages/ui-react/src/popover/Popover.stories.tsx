import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button/Button';
import { Popover, PopoverButton, PopoverContent, PopoverItem } from './Popover';

const meta = {
  title: 'Molecules/Popover',
  component: Popover,
  tags: ['autodocs', 'new'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A floating panel that anchors to a trigger element. Built on HeadlessUI — keyboard-navigable, closes on Escape, manages focus correctly. Use `PopoverItem` (a styled `<button>`) for clickable menu items, or place any content inside `PopoverContent` for richer layouts.',
      },
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Basic dropdown using `PopoverItem` buttons. Each item is keyboard-focusable and announced correctly by screen readers.',
      },
    },
  },
  args: {},
  render: () => (
    <Popover>
      <PopoverButton as={Button} variant='secondary'>
        Open popover
      </PopoverButton>
      <PopoverContent>
        <PopoverItem>Profile</PopoverItem>
        <PopoverItem>Settings</PopoverItem>
        <PopoverItem>Sign out</PopoverItem>
      </PopoverContent>
    </Popover>
  ),
};

export const WithRichContent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Any content can be placed inside `PopoverContent` — not just `PopoverItem` buttons. Useful for tooltips, mini-forms, or informational panels.',
      },
    },
  },
  args: {},
  render: () => (
    <Popover>
      <PopoverButton as={Button}>Help</PopoverButton>
      <PopoverContent className='max-w-xs'>
        <div className='p-3'>
          <p className='font-medium text-foreground mb-1'>Need help?</p>
          <p className='text-xs text-muted-foreground'>
            Visit the docs or reach out to support for assistance.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
