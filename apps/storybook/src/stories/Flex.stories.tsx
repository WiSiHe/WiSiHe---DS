import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex, Card } from '@wisihe/ui-react';

const meta: Meta<typeof Flex> = {
  title: 'Components/Flex',
  component: Flex,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A flexible container component for creating flexible layouts with consistent spacing and alignment.',
      },
    },
  },
  argTypes: {
    direction: {
      control: { type: 'select' },
      options: ['row', 'column'],
      description: 'The direction of the flex container',
    },
    wrap: {
      control: { type: 'select' },
      options: ['wrap', 'nowrap'],
      description: 'Whether flex items should wrap',
    },
    justify: {
      control: { type: 'select' },
      options: ['start', 'end', 'center', 'between', 'around'],
      description: 'How to justify content along the main axis',
    },
    align: {
      control: { type: 'select' },
      options: ['start', 'end', 'center', 'baseline', 'stretch'],
      description: 'How to align items along the cross axis',
    },
    gap: {
      control: { type: 'select' },
      options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64],
      description: 'The gap between flex items',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const DemoItem = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-accent-100 text-accent-900 p-4 rounded border border-accent-200 ${className}`}
  >
    {children}
  </div>
);

export const Default: Story = {
  render: () => (
    <Flex>
      <DemoItem>Item 1</DemoItem>
      <DemoItem>Item 2</DemoItem>
      <DemoItem>Item 3</DemoItem>
    </Flex>
  ),
};

export const Directions: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Row Direction (Default)</h3>
        <Flex direction="row" gap={4}>
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
          <DemoItem>Item 3</DemoItem>
        </Flex>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Column Direction</h3>
        <Flex direction="column" gap={4}>
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
          <DemoItem>Item 3</DemoItem>
        </Flex>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different flex directions: row and column.',
      },
    },
  },
};

export const JustifyContent: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Justify Start</h3>
        <Flex justify="start" gap={4}>
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
        </Flex>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Justify Center</h3>
        <Flex justify="center" gap={4}>
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
        </Flex>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Justify End</h3>
        <Flex justify="end" gap={4}>
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
        </Flex>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Justify Between</h3>
        <Flex justify="between" gap={4}>
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
          <DemoItem>Item 3</DemoItem>
        </Flex>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Justify Around</h3>
        <Flex justify="around" gap={4}>
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
          <DemoItem>Item 3</DemoItem>
        </Flex>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different justify content options for main axis alignment.',
      },
    },
  },
};

export const AlignItems: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Align Start</h3>
        <Flex align="start" gap={4} className="h-32">
          <DemoItem>Item 1</DemoItem>
          <DemoItem className="h-16">Tall Item</DemoItem>
          <DemoItem>Item 3</DemoItem>
        </Flex>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Align Center</h3>
        <Flex align="center" gap={4} className="h-32">
          <DemoItem>Item 1</DemoItem>
          <DemoItem className="h-16">Tall Item</DemoItem>
          <DemoItem>Item 3</DemoItem>
        </Flex>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Align End</h3>
        <Flex align="end" gap={4} className="h-32">
          <DemoItem>Item 1</DemoItem>
          <DemoItem className="h-16">Tall Item</DemoItem>
          <DemoItem>Item 3</DemoItem>
        </Flex>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Align Stretch</h3>
        <Flex align="stretch" gap={4} className="h-32">
          <DemoItem>Item 1</DemoItem>
          <DemoItem className="h-16">Tall Item</DemoItem>
          <DemoItem>Item 3</DemoItem>
        </Flex>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different align items options for cross axis alignment.',
      },
    },
  },
};

export const Gaps: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Gap 0</h3>
        <Flex gap={0}>
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
          <DemoItem>Item 3</DemoItem>
        </Flex>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Gap 2</h3>
        <Flex gap={2}>
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
          <DemoItem>Item 3</DemoItem>
        </Flex>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Gap 4 (Default)</h3>
        <Flex gap={4}>
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
          <DemoItem>Item 3</DemoItem>
        </Flex>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Gap 8</h3>
        <Flex gap={8}>
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
          <DemoItem>Item 3</DemoItem>
        </Flex>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different gap sizes between flex items.',
      },
    },
  },
};

export const Wrap: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">No Wrap (Default)</h3>
        <Flex wrap="nowrap" gap={4} className="w-64">
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
          <DemoItem>Item 3</DemoItem>
          <DemoItem>Item 4</DemoItem>
          <DemoItem>Item 5</DemoItem>
        </Flex>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Wrap</h3>
        <Flex wrap="wrap" gap={4} className="w-64">
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
          <DemoItem>Item 3</DemoItem>
          <DemoItem>Item 4</DemoItem>
          <DemoItem>Item 5</DemoItem>
        </Flex>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Flex wrap behavior when items overflow the container.',
      },
    },
  },
};

export const RealWorldExample: Story = {
  render: () => (
    <Card className="max-w-2xl">
      <Card.Header>
        <Card.Title>User Profile</Card.Title>
        <Card.Description>Manage your account settings and preferences</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="space-y-6">
          <Flex direction="row" justify="between" align="center">
            <div>
              <h4 className="font-semibold">John Doe</h4>
              <p className="text-text-secondary">john@example.com</p>
            </div>
            <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center text-surface-pure font-semibold">
              JD
            </div>
          </Flex>

          <Flex direction="column" gap={4}>
            <Flex direction="row" justify="between" align="center">
              <span className="text-text-secondary">Account Status</span>
              <span className="text-success-600 font-medium">Active</span>
            </Flex>
            <Flex direction="row" justify="between" align="center">
              <span className="text-text-secondary">Last Login</span>
              <span className="text-text-primary">2 hours ago</span>
            </Flex>
            <Flex direction="row" justify="between" align="center">
              <span className="text-text-secondary">Member Since</span>
              <span className="text-text-primary">Jan 2023</span>
            </Flex>
          </Flex>
        </div>
      </Card.Content>
      <Card.Footer>
        <Flex direction="row" gap={2} justify="end">
          <button className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors">
            Cancel
          </button>
          <button className="px-4 py-2 bg-accent-500 text-surface-pure rounded hover:bg-accent-600 transition-colors">
            Save Changes
          </button>
        </Flex>
      </Card.Footer>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world example showing Flex components in a user profile card.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    direction: 'row',
    wrap: 'wrap',
    justify: 'start',
    align: 'start',
    gap: 4,
  },
  render: (args: React.ComponentProps<typeof Flex>) => (
    <Flex {...args}>
      <DemoItem>Item 1</DemoItem>
      <DemoItem>Item 2</DemoItem>
      <DemoItem>Item 3</DemoItem>
    </Flex>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive flex container that you can configure using the controls panel.',
      },
    },
  },
};
