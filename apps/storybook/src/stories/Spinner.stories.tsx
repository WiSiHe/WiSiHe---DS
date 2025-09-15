import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner, Card } from '@wisihe/ui-react';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A loading spinner component with different sizes and colors using design tokens.',
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'The size of the spinner',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'accent', 'success', 'warning', 'error', 'neutral'],
      description: 'The color of the spinner',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="text-center">
        <Spinner size="sm" />
        <p className="text-sm text-text-secondary mt-2">Small</p>
      </div>
      <div className="text-center">
        <Spinner size="md" />
        <p className="text-sm text-text-secondary mt-2">Medium</p>
      </div>
      <div className="text-center">
        <Spinner size="lg" />
        <p className="text-sm text-text-secondary mt-2">Large</p>
      </div>
      <div className="text-center">
        <Spinner size="xl" />
        <p className="text-sm text-text-secondary mt-2">Extra Large</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different spinner sizes.',
      },
    },
  },
};

export const Colors: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div className="text-center">
        <Spinner color="primary" />
        <p className="text-sm text-text-secondary mt-2">Primary</p>
      </div>
      <div className="text-center">
        <Spinner color="secondary" />
        <p className="text-sm text-text-secondary mt-2">Secondary</p>
      </div>
      <div className="text-center">
        <Spinner color="accent" />
        <p className="text-sm text-text-secondary mt-2">Accent</p>
      </div>
      <div className="text-center">
        <Spinner color="success" />
        <p className="text-sm text-text-secondary mt-2">Success</p>
      </div>
      <div className="text-center">
        <Spinner color="warning" />
        <p className="text-sm text-text-secondary mt-2">Warning</p>
      </div>
      <div className="text-center">
        <Spinner color="error" />
        <p className="text-sm text-text-secondary mt-2">Error</p>
      </div>
      <div className="text-center">
        <Spinner color="neutral" />
        <p className="text-sm text-text-secondary mt-2">Neutral</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different spinner colors using design tokens.',
      },
    },
  },
};

export const InButtons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <button className="px-4 py-2 bg-primary-500 text-surface-pure rounded flex items-center gap-2 hover:bg-primary-600 transition-colors">
        <Spinner size="sm" color="neutral" />
        Loading...
      </button>
      <button className="px-4 py-2 bg-accent-500 text-surface-pure rounded flex items-center gap-2 hover:bg-accent-600 transition-colors">
        <Spinner size="sm" color="neutral" />
        Processing
      </button>
      <button className="px-4 py-2 bg-success-500 text-surface-pure rounded flex items-center gap-2 hover:bg-success-600 transition-colors">
        <Spinner size="sm" color="neutral" />
        Saving...
      </button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Spinners used in button contexts.',
      },
    },
  },
};

export const InCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <Card.Header>
          <Card.Title>Loading Data</Card.Title>
          <Card.Description>Please wait while we fetch your information</Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="flex items-center justify-center py-8">
            <Spinner size="lg" color="accent" />
          </div>
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title>Processing Request</Card.Title>
          <Card.Description>Your request is being processed</Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Spinner size="lg" color="success" />
              <p className="text-text-secondary mt-4">This may take a few moments...</p>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Spinners used in card contexts for loading states.',
      },
    },
  },
};

export const Overlay: Story = {
  render: () => (
    <div className="relative">
      <Card className="opacity-50">
        <Card.Header>
          <Card.Title>Content Behind Overlay</Card.Title>
          <Card.Description>This content is dimmed while loading</Card.Description>
        </Card.Header>
        <Card.Content>
          <p>
            This is some content that would normally be visible, but is now dimmed to show the
            loading state.
          </p>
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-neutral-200 rounded"></div>
            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
          </div>
        </Card.Content>
      </Card>

      <div className="absolute inset-0 flex items-center justify-center bg-surface-pure bg-opacity-75">
        <div className="text-center">
          <Spinner size="xl" color="primary" />
          <p className="text-text-secondary mt-4 font-medium">Loading...</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Spinner used in an overlay context with dimmed background content.',
      },
    },
  },
};

export const InlineText: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-text-primary">
        Please wait <Spinner size="sm" color="accent" className="inline mx-2" /> while we process
        your request.
      </p>

      <p className="text-text-primary">
        <Spinner size="sm" color="success" className="inline mr-2" />
        Your data is being saved...
      </p>

      <p className="text-text-primary">
        <Spinner size="sm" color="warning" className="inline mr-2" />
        Syncing with server...
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Spinners used inline with text content.',
      },
    },
  },
};

export const CustomSizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="text-center">
        <Spinner size="sm" className="w-3 h-3" />
        <p className="text-sm text-text-secondary mt-2">Custom Small</p>
      </div>
      <div className="text-center">
        <Spinner size="md" className="w-8 h-8" />
        <p className="text-sm text-text-secondary mt-2">Custom Medium</p>
      </div>
      <div className="text-center">
        <Spinner size="lg" className="w-16 h-16" />
        <p className="text-sm text-text-secondary mt-2">Custom Large</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Spinners with custom sizes using className overrides.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    size: 'md',
    color: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive spinner that you can configure using the controls panel.',
      },
    },
  },
};
