import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'success', 'warning', 'destructive', 'muted'],
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    size: 'md',
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    size: 'md',
    color: 'secondary',
  },
};

export const Accent: Story = {
  args: {
    size: 'md',
    color: 'accent',
  },
};

export const Success: Story = {
  args: {
    size: 'md',
    color: 'success',
  },
};

export const Warning: Story = {
  args: {
    size: 'md',
    color: 'warning',
  },
};

export const Destructive: Story = {
  args: {
    size: 'md',
    color: 'destructive',
  },
};

export const Muted: Story = {
  args: {
    size: 'md',
    color: 'muted',
  },
};
