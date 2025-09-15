import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@wisihe/ui-react';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A small status indicator component for displaying labels, counts, or status information.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
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
      description: 'The visual style variant of the badge',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'The size of the badge',
    },
    children: {
      control: { type: 'text' },
      description: 'The badge text content',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Error</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="accent">Accent</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="accent-warm">Warm</Badge>
      <Badge variant="accent-cool">Cool</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available badge variants using design tokens.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different badge sizes.',
      },
    },
  },
};

export const StatusIndicators: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-text-secondary">Status:</span>
        <Badge variant="success">Online</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-text-secondary">Status:</span>
        <Badge variant="warning">Away</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-text-secondary">Status:</span>
        <Badge variant="destructive">Offline</Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common use case for status indicators.',
      },
    },
  },
};

export const Counts: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-text-secondary">Notifications:</span>
        <Badge variant="destructive">99+</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-text-secondary">Messages:</span>
        <Badge variant="accent">5</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-text-secondary">Tasks:</span>
        <Badge variant="outline">12</Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Using badges to display counts and numbers.',
      },
    },
  },
};

export const Labels: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <span className="text-text-secondary">Tags:</span>
        <Badge variant="accent-warm">React</Badge>
        <Badge variant="accent-cool">TypeScript</Badge>
        <Badge variant="accent">Tailwind</Badge>
        <Badge variant="outline">Storybook</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="text-text-secondary">Categories:</span>
        <Badge variant="secondary">Frontend</Badge>
        <Badge variant="secondary">UI/UX</Badge>
        <Badge variant="secondary">Design System</Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Using badges as labels and tags.',
      },
    },
  },
};

export const WithDifferentContent: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success">✓ Complete</Badge>
      <Badge variant="warning">⚠ Pending</Badge>
      <Badge variant="destructive">✗ Failed</Badge>
      <Badge variant="accent">NEW</Badge>
      <Badge variant="outline">BETA</Badge>
      <Badge variant="accent-warm">HOT</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges with different content including symbols and text.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    children: 'Interactive Badge',
    variant: 'default',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive badge that you can configure using the controls panel.',
      },
    },
  },
};
