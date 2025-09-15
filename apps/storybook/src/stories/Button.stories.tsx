import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@wisihe/ui-react';

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

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants, sizes, and states.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'destructive', 'success', 'accent'],
      description: 'The visual style variant of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 'icon'],
      description: 'The size of the button',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Whether the button is in a loading state',
    },
    isDisabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled',
    },
    iconPosition: {
      control: { type: 'select' },
      options: ['left', 'right'],
      description: 'Position of the icon relative to the text',
    },
    children: {
      control: { type: 'text' },
      description: 'The button text content',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="success">Success</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button variants using design tokens.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
      <Button size="icon" Icon={PlusIcon} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different button sizes including icon-only button.',
      },
    },
  },
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button Icon={PlusIcon} iconPosition="left">
        Add Item
      </Button>
      <Button Icon={ArrowRightIcon} iconPosition="right">
        Continue
      </Button>
      <Button Icon={PlusIcon} size="icon" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons with icons in different positions.',
      },
    },
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button>Normal</Button>
      <Button isLoading>Loading</Button>
      <Button isDisabled>Disabled</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different button states: normal, loading, and disabled.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    children: 'Click me',
    variant: 'primary',
    size: 'medium',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive button that you can configure using the controls panel.',
      },
    },
  },
};

export const LoadingStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary" isLoading>
        Primary Loading
      </Button>
      <Button variant="secondary" isLoading>
        Secondary Loading
      </Button>
      <Button variant="accent" isLoading>
        Accent Loading
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Loading states for different button variants.',
      },
    },
  },
};

export const DisabledStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary" isDisabled>
        Primary Disabled
      </Button>
      <Button variant="secondary" isDisabled>
        Secondary Disabled
      </Button>
      <Button variant="accent" isDisabled>
        Accent Disabled
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled states for different button variants.',
      },
    },
  },
};
