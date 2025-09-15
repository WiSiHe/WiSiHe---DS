import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid, Card } from '@wisihe/ui-react';

const meta: Meta<typeof Grid> = {
  title: 'Components/Grid',
  component: Grid,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A grid layout component for creating responsive grid layouts with consistent spacing and alignment.',
      },
    },
  },
  argTypes: {
    columns: {
      control: { type: 'select' },
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      description: 'The number of columns in the grid',
    },
    rows: {
      control: { type: 'select' },
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      description: 'The number of rows in the grid',
    },
    gap: {
      control: { type: 'select' },
      options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64],
      description: 'The gap between grid items',
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
    <Grid columns={3} gap={4}>
      <DemoItem>Item 1</DemoItem>
      <DemoItem>Item 2</DemoItem>
      <DemoItem>Item 3</DemoItem>
    </Grid>
  ),
};

export const ColumnVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">2 Columns</h3>
        <Grid columns={2} gap={4}>
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
          <DemoItem>Item 3</DemoItem>
          <DemoItem>Item 4</DemoItem>
        </Grid>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">3 Columns</h3>
        <Grid columns={3} gap={4}>
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
          <DemoItem>Item 3</DemoItem>
          <DemoItem>Item 4</DemoItem>
          <DemoItem>Item 5</DemoItem>
          <DemoItem>Item 6</DemoItem>
        </Grid>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">4 Columns</h3>
        <Grid columns={4} gap={4}>
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
          <DemoItem>Item 3</DemoItem>
          <DemoItem>Item 4</DemoItem>
          <DemoItem>Item 5</DemoItem>
          <DemoItem>Item 6</DemoItem>
          <DemoItem>Item 7</DemoItem>
          <DemoItem>Item 8</DemoItem>
        </Grid>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different column configurations for grid layouts.',
      },
    },
  },
};

export const GapVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Gap 0</h3>
        <Grid columns={3} gap={0}>
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
          <DemoItem>Item 3</DemoItem>
        </Grid>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Gap 2</h3>
        <Grid columns={3} gap={2}>
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
          <DemoItem>Item 3</DemoItem>
        </Grid>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Gap 4 (Default)</h3>
        <Grid columns={3} gap={4}>
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
          <DemoItem>Item 3</DemoItem>
        </Grid>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Gap 8</h3>
        <Grid columns={3} gap={8}>
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
          <DemoItem>Item 3</DemoItem>
        </Grid>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different gap sizes between grid items.',
      },
    },
  },
};

export const JustifyContent: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Justify Start</h3>
        <Grid columns={3} gap={4} justify="start" className="w-96">
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
        </Grid>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Justify Center</h3>
        <Grid columns={3} gap={4} justify="center" className="w-96">
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
        </Grid>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Justify End</h3>
        <Grid columns={3} gap={4} justify="end" className="w-96">
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
        </Grid>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Justify Between</h3>
        <Grid columns={3} gap={4} justify="between" className="w-96">
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
          <DemoItem>Item 3</DemoItem>
        </Grid>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different justify content options for grid alignment.',
      },
    },
  },
};

export const AlignItems: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Align Start</h3>
        <Grid columns={3} gap={4} align="start" className="h-32">
          <DemoItem>Item 1</DemoItem>
          <DemoItem className="h-16">Tall Item</DemoItem>
          <DemoItem>Item 3</DemoItem>
        </Grid>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Align Center</h3>
        <Grid columns={3} gap={4} align="center" className="h-32">
          <DemoItem>Item 1</DemoItem>
          <DemoItem className="h-16">Tall Item</DemoItem>
          <DemoItem>Item 3</DemoItem>
        </Grid>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Align End</h3>
        <Grid columns={3} gap={4} align="end" className="h-32">
          <DemoItem>Item 1</DemoItem>
          <DemoItem className="h-16">Tall Item</DemoItem>
          <DemoItem>Item 3</DemoItem>
        </Grid>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Align Stretch</h3>
        <Grid columns={3} gap={4} align="stretch" className="h-32">
          <DemoItem>Item 1</DemoItem>
          <DemoItem className="h-16">Tall Item</DemoItem>
          <DemoItem>Item 3</DemoItem>
        </Grid>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different align items options for grid alignment.',
      },
    },
  },
};

export const WithGridCol: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">12 Column Grid with Spans</h3>
        <Grid columns={12} gap={4}>
          <Grid.Col span={6}>
            <DemoItem>Span 6</DemoItem>
          </Grid.Col>
          <Grid.Col span={6}>
            <DemoItem>Span 6</DemoItem>
          </Grid.Col>
          <Grid.Col span={4}>
            <DemoItem>Span 4</DemoItem>
          </Grid.Col>
          <Grid.Col span={4}>
            <DemoItem>Span 4</DemoItem>
          </Grid.Col>
          <Grid.Col span={4}>
            <DemoItem>Span 4</DemoItem>
          </Grid.Col>
          <Grid.Col span={3}>
            <DemoItem>Span 3</DemoItem>
          </Grid.Col>
          <Grid.Col span={3}>
            <DemoItem>Span 3</DemoItem>
          </Grid.Col>
          <Grid.Col span={3}>
            <DemoItem>Span 3</DemoItem>
          </Grid.Col>
          <Grid.Col span={3}>
            <DemoItem>Span 3</DemoItem>
          </Grid.Col>
        </Grid>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Using GridCol component for more complex grid layouts with spans.',
      },
    },
  },
};

export const ResponsiveGrid: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Responsive Grid (Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
          <DemoItem>Item 3</DemoItem>
          <DemoItem>Item 4</DemoItem>
          <DemoItem>Item 5</DemoItem>
          <DemoItem>Item 6</DemoItem>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of responsive grid using Tailwind classes (not the Grid component).',
      },
    },
  },
};

export const RealWorldExample: Story = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <Grid columns={4} gap={6}>
        <Card>
          <Card.Header>
            <Card.Title size="sm">Total Users</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="text-3xl font-bold text-accent-600">1,234</div>
            <p className="text-success-600 text-sm">+12% from last month</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title size="sm">Revenue</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="text-3xl font-bold text-success-600">$45,678</div>
            <p className="text-success-600 text-sm">+8% from last month</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title size="sm">Orders</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="text-3xl font-bold text-warning-600">567</div>
            <p className="text-error-600 text-sm">-3% from last month</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title size="sm">Conversion</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="text-3xl font-bold text-accent-warm-600">3.2%</div>
            <p className="text-success-600 text-sm">+0.5% from last month</p>
          </Card.Content>
        </Card>
      </Grid>

      <Grid columns={2} gap={6}>
        <Card>
          <Card.Header>
            <Card.Title>Recent Activity</Card.Title>
            <Card.Description>Latest user actions and system events</Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span className="text-sm">User John Doe logged in</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                <span className="text-sm">New order #1234 created</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                <span className="text-sm">Payment processing delayed</span>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Quick Actions</Card.Title>
            <Card.Description>Common tasks and shortcuts</Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-accent-100 text-accent-900 rounded hover:bg-accent-200 transition-colors">
                Add User
              </button>
              <button className="p-3 bg-success-100 text-success-900 rounded hover:bg-success-200 transition-colors">
                Create Order
              </button>
              <button className="p-3 bg-warning-100 text-warning-900 rounded hover:bg-warning-200 transition-colors">
                View Reports
              </button>
              <button className="p-3 bg-accent-warm-100 text-accent-warm-900 rounded hover:bg-accent-warm-200 transition-colors">
                Settings
              </button>
            </div>
          </Card.Content>
        </Card>
      </Grid>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world example showing Grid components in a dashboard layout.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    columns: 3,
    gap: 4,
    justify: 'start',
    align: 'start',
  },
  render: (args: React.ComponentProps<typeof Grid>) => (
    <Grid {...args}>
      <DemoItem>Item 1</DemoItem>
      <DemoItem>Item 2</DemoItem>
      <DemoItem>Item 3</DemoItem>
    </Grid>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive grid container that you can configure using the controls panel.',
      },
    },
  },
};
