import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Card, Badge, Flex, Grid, Spinner } from '@wisihe/ui-react';

const meta: Meta = {
  title: 'Overview/Design System',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A comprehensive overview of the WiSiHe design system components built with Tailwind CSS and design tokens.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// Icon components for demonstration
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12,5 19,12 12,19"></polyline>
  </svg>
);

export const DesignSystemOverview: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-background p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-text-primary">WiSiHe Design System</h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            A comprehensive React component library built with Tailwind CSS and design tokens for
            consistent, accessible, and beautiful user interfaces.
          </p>
        </div>

        {/* Color Palette */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-text-primary">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-text-primary">Primary</h3>
              <div className="space-y-1">
                <div className="h-8 bg-primary-500 rounded"></div>
                <div className="h-6 bg-primary-300 rounded"></div>
                <div className="h-6 bg-primary-700 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-text-primary">Accent</h3>
              <div className="space-y-1">
                <div className="h-8 bg-accent-500 rounded"></div>
                <div className="h-6 bg-accent-300 rounded"></div>
                <div className="h-6 bg-accent-700 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-text-primary">Success</h3>
              <div className="space-y-1">
                <div className="h-8 bg-success-500 rounded"></div>
                <div className="h-6 bg-success-300 rounded"></div>
                <div className="h-6 bg-success-700 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-text-primary">Warning</h3>
              <div className="space-y-1">
                <div className="h-8 bg-warning-500 rounded"></div>
                <div className="h-6 bg-warning-300 rounded"></div>
                <div className="h-6 bg-warning-700 rounded"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-text-primary">Buttons</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">Variants</h3>
              <Flex gap={4} wrap="wrap">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="tertiary">Tertiary</Button>
                <Button variant="accent">Accent</Button>
                <Button variant="success">Success</Button>
                <Button variant="destructive">Destructive</Button>
              </Flex>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">Sizes</h3>
              <Flex gap={4} align="center">
                <Button size="small">Small</Button>
                <Button size="medium">Medium</Button>
                <Button size="large">Large</Button>
                <Button size="icon" Icon={PlusIcon} />
              </Flex>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">With Icons</h3>
              <Flex gap={4}>
                <Button Icon={PlusIcon} iconPosition="left">
                  Add Item
                </Button>
                <Button Icon={ArrowRightIcon} iconPosition="right">
                  Continue
                </Button>
              </Flex>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">States</h3>
              <Flex gap={4}>
                <Button>Normal</Button>
                <Button isLoading>Loading</Button>
                <Button isDisabled>Disabled</Button>
              </Flex>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-text-primary">Badges</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">Variants</h3>
              <Flex gap={2} wrap="wrap">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Error</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="accent">Accent</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="accent-warm">Warm</Badge>
                <Badge variant="accent-cool">Cool</Badge>
              </Flex>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">Sizes</h3>
              <Flex gap={4} align="center">
                <Badge size="sm">Small</Badge>
                <Badge size="md">Medium</Badge>
                <Badge size="lg">Large</Badge>
              </Flex>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-text-primary">Cards</h2>
          <Grid columns={3} gap={6}>
            <Card variant="default">
              <Card.Header>
                <Card.Title>Default Card</Card.Title>
                <Card.Description>Standard card with subtle border</Card.Description>
              </Card.Header>
              <Card.Content>
                <p>This is the default card variant with standard styling.</p>
              </Card.Content>
              <Card.Footer>
                <Button size="small">Action</Button>
              </Card.Footer>
            </Card>

            <Card variant="elevated">
              <Card.Header>
                <Card.Title>Elevated Card</Card.Title>
                <Card.Description>Card with shadow for depth</Card.Description>
              </Card.Header>
              <Card.Content>
                <p>This card has an elevated appearance with shadow.</p>
              </Card.Content>
              <Card.Footer>
                <Button size="small" variant="accent">
                  Action
                </Button>
              </Card.Footer>
            </Card>

            <Card variant="outlined">
              <Card.Header>
                <Card.Title>Outlined Card</Card.Title>
                <Card.Description>Transparent background with border</Card.Description>
              </Card.Header>
              <Card.Content>
                <p>This card has a transparent background.</p>
              </Card.Content>
              <Card.Footer>
                <Button size="small" variant="secondary">
                  Action
                </Button>
              </Card.Footer>
            </Card>
          </Grid>
        </section>

        {/* Layout Components */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-text-primary">Layout Components</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Flex Layout</h3>
              <Card>
                <Card.Content>
                  <Flex direction="row" justify="between" align="center" gap={4}>
                    <div className="bg-accent-100 text-accent-900 p-3 rounded">Item 1</div>
                    <div className="bg-accent-100 text-accent-900 p-3 rounded">Item 2</div>
                    <div className="bg-accent-100 text-accent-900 p-3 rounded">Item 3</div>
                  </Flex>
                </Card.Content>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Grid Layout</h3>
              <Card>
                <Card.Content>
                  <Grid columns={4} gap={4}>
                    <div className="bg-success-100 text-success-900 p-3 rounded text-center">1</div>
                    <div className="bg-success-100 text-success-900 p-3 rounded text-center">2</div>
                    <div className="bg-success-100 text-success-900 p-3 rounded text-center">3</div>
                    <div className="bg-success-100 text-success-900 p-3 rounded text-center">4</div>
                  </Grid>
                </Card.Content>
              </Card>
            </div>
          </div>
        </section>

        {/* Spinners */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-text-primary">Loading States</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">Spinner Sizes</h3>
              <Flex gap={8} align="center">
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
              </Flex>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">Spinner Colors</h3>
              <Flex gap={6} wrap="wrap">
                <div className="text-center">
                  <Spinner color="primary" />
                  <p className="text-sm text-text-secondary mt-2">Primary</p>
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
              </Flex>
            </div>
          </div>
        </section>

        {/* Real-world Example */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-text-primary">Real-world Example</h2>
          <Card variant="elevated" className="max-w-4xl">
            <Card.Header>
              <Flex justify="between" align="center">
                <div>
                  <Card.Title>Project Dashboard</Card.Title>
                  <Card.Description>
                    Overview of your current project status and metrics
                  </Card.Description>
                </div>
                <Badge variant="success">Active</Badge>
              </Flex>
            </Card.Header>
            <Card.Content>
              <div className="space-y-6">
                <Grid columns={4} gap={6}>
                  <Card variant="filled">
                    <Card.Content padding="sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent-600">1,234</div>
                        <div className="text-sm text-text-secondary">Total Users</div>
                        <Badge variant="success" size="sm" className="mt-2">
                          +12%
                        </Badge>
                      </div>
                    </Card.Content>
                  </Card>
                  <Card variant="filled">
                    <Card.Content padding="sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-success-600">$45,678</div>
                        <div className="text-sm text-text-secondary">Revenue</div>
                        <Badge variant="success" size="sm" className="mt-2">
                          +8%
                        </Badge>
                      </div>
                    </Card.Content>
                  </Card>
                  <Card variant="filled">
                    <Card.Content padding="sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-warning-600">567</div>
                        <div className="text-sm text-text-secondary">Orders</div>
                        <Badge variant="destructive" size="sm" className="mt-2">
                          -3%
                        </Badge>
                      </div>
                    </Card.Content>
                  </Card>
                  <Card variant="filled">
                    <Card.Content padding="sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent-warm-600">3.2%</div>
                        <div className="text-sm text-text-secondary">Conversion</div>
                        <Badge variant="success" size="sm" className="mt-2">
                          +0.5%
                        </Badge>
                      </div>
                    </Card.Content>
                  </Card>
                </Grid>

                <div className="border-t border-border-default pt-6">
                  <Flex justify="between" align="center" className="mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
                    <Button size="small" variant="tertiary">
                      View All
                    </Button>
                  </Flex>
                  <div className="space-y-3">
                    <Flex align="center" gap={3}>
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      <span className="text-sm text-text-primary">User John Doe logged in</span>
                      <Badge variant="outline" size="sm">
                        2 min ago
                      </Badge>
                    </Flex>
                    <Flex align="center" gap={3}>
                      <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                      <span className="text-sm text-text-primary">New order #1234 created</span>
                      <Badge variant="outline" size="sm">
                        5 min ago
                      </Badge>
                    </Flex>
                    <Flex align="center" gap={3}>
                      <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                      <span className="text-sm text-text-primary">Payment processing delayed</span>
                      <Badge variant="warning" size="sm">
                        10 min ago
                      </Badge>
                    </Flex>
                  </div>
                </div>
              </div>
            </Card.Content>
            <Card.Footer>
              <Flex gap={2} justify="end">
                <Button variant="secondary" size="small">
                  Cancel
                </Button>
                <Button variant="primary" size="small">
                  Save Changes
                </Button>
              </Flex>
            </Card.Footer>
          </Card>
        </section>

        {/* Footer */}
        <div className="text-center py-8 border-t border-border-default">
          <p className="text-text-secondary">
            Built with ❤️ using React, TypeScript, Tailwind CSS, and design tokens
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A comprehensive overview of all components in the WiSiHe design system.',
      },
    },
  },
};
