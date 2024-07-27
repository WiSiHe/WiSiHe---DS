import type { Meta, StoryObj } from '@storybook/react';
import { Button, Flex } from '@wisihe/ui-react';

const SVGComponent = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    type: {
      control: { type: 'radio' },
      options: ['button', 'submit', 'reset'],
    },
    variant: {
      control: { type: 'radio' },
      options: ['primary', 'secondary', 'tertiary', 'destructive', 'success'],
    },
    size: {
      control: { type: 'radio' },
      options: ['small', 'medium', 'large', 'icon'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const All: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div>
        <strong>Variant:</strong>
        <Flex>
          <Button {...args} variant="primary">
            Primary
          </Button>
          <Button {...args} variant="secondary">
            Secondary
          </Button>
          <Button {...args} variant="tertiary">
            Tertiary
          </Button>
          <Button {...args} variant="destructive">
            Destructive
          </Button>
          <Button {...args} variant="success">
            Success
          </Button>
        </Flex>
      </div>
      <div>
        <strong>Size:</strong>
        <Flex>
          <Button {...args} variant="primary" size="small">
            Small
          </Button>
          <Button {...args} variant="primary" size="medium">
            Medium
          </Button>
          <Button {...args} variant="primary" size="large">
            Large
          </Button>
          <Button {...args} variant="primary" size="icon">
            {SVGComponent()}
          </Button>
        </Flex>
      </div>
      <div>
        <strong>State:</strong>
        <Flex>
          <Button {...args} variant="primary" isDisabled>
            Disabled
          </Button>
          <Button {...args} variant="primary" isLoading>
            Loading
          </Button>
        </Flex>
      </div>
      <div>
        <strong>Icon:</strong>
        <Flex>
          <Button
            {...args}
            variant="primary"
            Icon={SVGComponent}
            iconPosition="left"
          >
            Left Icon
          </Button>
          <Button
            {...args}
            variant="primary"
            Icon={SVGComponent}
            iconPosition="right"
            size="icon"
          />
          <Button
            {...args}
            variant="primary"
            Icon={SVGComponent}
            iconPosition="right"
          >
            Right Icon
          </Button>
        </Flex>
      </div>
    </div>
  ),
  args: {
    type: 'button',
    size: 'medium',
  },
};

export const Primary: Story = {
  args: {
    type: 'button',
    variant: 'primary',
    size: 'medium',
    children: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    type: 'button',
    variant: 'secondary',
    size: 'medium',
    children: 'Button',
  },
};

export const Tertiary: Story = {
  args: {
    type: 'button',
    variant: 'tertiary',
    size: 'medium',
    children: 'Button',
  },
};

export const Destructive: Story = {
  args: {
    type: 'button',
    variant: 'destructive',
    size: 'medium',
    children: 'Button',
  },
};

export const Success: Story = {
  args: {
    type: 'button',
    variant: 'success',
    size: 'medium',
    children: 'Button',
  },
};

export const Small: Story = {
  args: {
    type: 'button',
    variant: 'primary',
    size: 'small',
    children: 'Button',
  },
};

export const Medium: Story = {
  args: {
    type: 'button',
    variant: 'primary',
    size: 'medium',
    children: 'Button',
  },
};

export const Large: Story = {
  args: {
    type: 'button',
    variant: 'primary',
    size: 'large',
    children: 'Button',
  },
};

export const Icon: Story = {
  args: {
    type: 'button',
    variant: 'primary',
    size: 'icon',
    children: SVGComponent(),
  },
};

export const Disabled: Story = {
  args: {
    type: 'button',
    variant: 'primary',
    size: 'medium',
    children: 'Button',
    isDisabled: true,
  },
};

export const Loading: Story = {
  args: {
    type: 'button',
    variant: 'primary',
    size: 'medium',
    children: 'Button',
    isLoading: true,
  },
};

export const LeftIcon: Story = {
  args: {
    type: 'button',
    variant: 'primary',
    size: 'medium',
    children: 'Button',
    Icon: SVGComponent,
    iconPosition: 'left',
  },
};

export const RightIcon: Story = {
  args: {
    type: 'button',
    variant: 'primary',
    size: 'medium',
    children: 'Button',
    Icon: SVGComponent,
    iconPosition: 'right',
  },
};
