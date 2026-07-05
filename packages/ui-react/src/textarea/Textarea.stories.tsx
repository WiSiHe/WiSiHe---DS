import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta = {
  title: 'Design System/Atoms/Textarea',
  component: Textarea,
  tags: ['autodocs', 'new'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A multi-line text input that mirrors the `Input` API. `label` is always required for accessibility (use `hideLabel` to visually hide it while keeping it available to screen readers). `description` appears above the field; `errorMessage` appears below with `role="alert"` for live announcement.',
      },
    },
  },
  argTypes: {
    disabled: { control: 'boolean' },
    hideLabel: { control: 'boolean' },
    rows: { control: 'number' },
    description: { control: 'text' },
    errorMessage: { control: 'text' },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { docs: { description: { story: 'Basic textarea with a visible label.' } } },
  args: { label: 'Message', placeholder: 'Write your message...' },
};

export const WithDescription: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`description` renders above the field to set user expectations before they start typing.',
      },
    },
  },
  args: {
    label: 'Bio',
    description: 'A short description about yourself. Max 200 characters.',
    placeholder: 'Tell us about yourself...',
  },
};

export const WithError: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'When `errorMessage` is set, the border turns red, the background gets a subtle tint, and the error text is announced via `role="alert"`.',
      },
    },
  },
  args: {
    label: 'Bio',
    errorMessage: 'Bio must be at least 20 characters.',
    value: 'Too short.',
    readOnly: true,
  },
};

export const HiddenLabel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`hideLabel` renders the label as `sr-only` — invisible but still readable by screen readers. Useful when the surrounding context makes the label redundant.',
      },
    },
  },
  args: { label: 'Notes', hideLabel: true, placeholder: 'Add notes...' },
};

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'Disabled state — not interactive, reduced opacity.' } },
  },
  args: { label: 'Disabled', disabled: true, placeholder: 'Disabled textarea' },
};
