import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

// badges 
// https://storybook.js.org/addons/storybook-addon-tag-badges
// tags = 'new' | 'alpha, beta, rc, experimental' | 'deprecated' | 'outdated' | 'danger' | 'code-only' | 'version:*, v:*'

const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs', 'new'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'destructive', 'success', 'accent'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'icon'],
    },
    isLoading: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'medium',
    children: 'Secondary Button',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    size: 'medium',
    children: 'Destructive Action',
  },
  tags: ['deprecated'],
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    isLoading: true,
    children: 'Loading...',
  },
};
