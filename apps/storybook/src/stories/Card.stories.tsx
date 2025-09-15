import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, Button, Badge } from '@wisihe/ui-react';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible card component with compound sub-components for building complex UI elements.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'outlined', 'filled'],
      description: 'The visual style variant of the card',
    },
    padding: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'The padding size of the card',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card>
      <Card.Header>
        <Card.Title>Card Title</Card.Title>
        <Card.Description>
          This is a card description that provides context about the content.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <p>This is the main content of the card. It can contain any React elements.</p>
      </Card.Content>
      <Card.Footer>
        <Button>Action</Button>
      </Card.Footer>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card variant="default">
        <Card.Header>
          <Card.Title>Default Card</Card.Title>
          <Card.Description>Standard card with subtle border</Card.Description>
        </Card.Header>
        <Card.Content>
          <p>This is the default card variant.</p>
        </Card.Content>
      </Card>

      <Card variant="elevated">
        <Card.Header>
          <Card.Title>Elevated Card</Card.Title>
          <Card.Description>Card with shadow for depth</Card.Description>
        </Card.Header>
        <Card.Content>
          <p>This card has an elevated appearance with shadow.</p>
        </Card.Content>
      </Card>

      <Card variant="outlined">
        <Card.Header>
          <Card.Title>Outlined Card</Card.Title>
          <Card.Description>Transparent background with border</Card.Description>
        </Card.Header>
        <Card.Content>
          <p>This card has a transparent background.</p>
        </Card.Content>
      </Card>

      <Card variant="filled">
        <Card.Header>
          <Card.Title>Filled Card</Card.Title>
          <Card.Description>Card with filled background</Card.Description>
        </Card.Header>
        <Card.Content>
          <p>This card has a filled background color.</p>
        </Card.Content>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different card variants using design tokens.',
      },
    },
  },
};

export const PaddingSizes: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card padding="sm">
        <Card.Header padding="sm">
          <Card.Title>Small Padding</Card.Title>
        </Card.Header>
        <Card.Content padding="sm">
          <p>This card has small padding.</p>
        </Card.Content>
      </Card>

      <Card padding="md">
        <Card.Header padding="md">
          <Card.Title>Medium Padding</Card.Title>
        </Card.Header>
        <Card.Content padding="md">
          <p>This card has medium padding (default).</p>
        </Card.Content>
      </Card>

      <Card padding="lg">
        <Card.Header padding="lg">
          <Card.Title>Large Padding</Card.Title>
        </Card.Header>
        <Card.Content padding="lg">
          <p>This card has large padding.</p>
        </Card.Content>
      </Card>

      <Card padding="xl">
        <Card.Header padding="xl">
          <Card.Title>Extra Large Padding</Card.Title>
        </Card.Header>
        <Card.Content padding="xl">
          <p>This card has extra large padding.</p>
        </Card.Content>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different padding sizes for card components.',
      },
    },
  },
};

export const ComplexExample: Story = {
  render: () => (
    <Card variant="elevated" className="max-w-md">
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title>Project Dashboard</Card.Title>
          <Badge variant="success">Active</Badge>
        </div>
        <Card.Description>Overview of your current project status and metrics</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-text-secondary">Progress</span>
            <span className="font-medium">75%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div className="bg-accent-500 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-text-secondary">Tasks</div>
              <div className="font-semibold">24/32</div>
            </div>
            <div>
              <div className="text-text-secondary">Deadline</div>
              <div className="font-semibold">Dec 15</div>
            </div>
          </div>
        </div>
      </Card.Content>
      <Card.Footer>
        <div className="flex gap-2">
          <Button variant="primary" size="small">
            View Details
          </Button>
          <Button variant="secondary" size="small">
            Edit
          </Button>
        </div>
      </Card.Footer>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A complex card example showing real-world usage with multiple components.',
      },
    },
  },
};

export const TitleSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Card>
        <Card.Header>
          <Card.Title size="sm">Small Title</Card.Title>
          <Card.Description>This card has a small title</Card.Description>
        </Card.Header>
        <Card.Content>
          <p>Content for small title card.</p>
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title size="md">Medium Title</Card.Title>
          <Card.Description>This card has a medium title (default)</Card.Description>
        </Card.Header>
        <Card.Content>
          <p>Content for medium title card.</p>
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title size="lg">Large Title</Card.Title>
          <Card.Description>This card has a large title</Card.Description>
        </Card.Header>
        <Card.Content>
          <p>Content for large title card.</p>
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title size="xl">Extra Large Title</Card.Title>
          <Card.Description>This card has an extra large title</Card.Description>
        </Card.Header>
        <Card.Content>
          <p>Content for extra large title card.</p>
        </Card.Content>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different title sizes for card headers.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    variant: 'default',
    padding: 'md',
  },
  render: (args: React.ComponentProps<typeof Card>) => (
    <Card {...args}>
      <Card.Header>
        <Card.Title>Interactive Card</Card.Title>
        <Card.Description>Configure this card using the controls panel</Card.Description>
      </Card.Header>
      <Card.Content>
        <p>This card can be customized using the controls below.</p>
      </Card.Content>
      <Card.Footer>
        <Button>Action</Button>
      </Card.Footer>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive card that you can configure using the controls panel.',
      },
    },
  },
};
