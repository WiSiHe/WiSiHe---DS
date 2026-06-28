import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button/Button';
import {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './Dialog';

const meta = {
  title: 'Molecules/Dialog',
  component: Dialog,
  tags: ['autodocs', 'new'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An accessible modal dialog built on HeadlessUI. Focus is trapped inside the dialog while open and restored to the trigger on close. Pressing Escape closes it automatically. Use the sub-components `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogBody`, and `DialogFooter` to compose the layout.',
      },
    },
  },
  args: { onClose: () => {}, children: null, open: false },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function DialogDemo({ size }: { size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <Dialog open={open} onClose={setOpen} size={size} showClose>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold text-foreground'>
            Confirm action
          </DialogTitle>
          <DialogDescription className='text-sm text-foreground-muted'>
            Are you sure you want to proceed? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p>Some additional context can go here if needed.</p>
        </DialogBody>
        <DialogFooter>
          <Button variant='secondary' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Confirm</Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Default `md` size dialog with header, body, footer, and a close button. Click "Open Dialog" to see it in action.',
      },
    },
  },
  args: { open: false },
  render: () => <DialogDemo />,
};

export const Small: Story = {
  parameters: {
    docs: {
      description: { story: '`size="sm"` — compact dialog, ideal for quick confirmations.' },
    },
  },
  args: { open: false },
  render: () => <DialogDemo size='sm' />,
};

export const Large: Story = {
  parameters: {
    docs: { description: { story: '`size="lg"` — wider dialog for forms or richer content.' } },
  },
  args: { open: false },
  render: () => <DialogDemo size='lg' />,
};
