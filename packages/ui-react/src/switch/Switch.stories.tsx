import type { Meta, StoryObj } from '@storybook/react';
import { Switch, SwitchField } from './Switch';

const meta = {
  title: 'Atoms/Switch',
  component: SwitchField,
  tags: ['autodocs', 'new'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An accessible toggle switch built on HeadlessUI. Use `Switch` for a bare toggle (icon buttons, toolbars), or `SwitchField` for a labelled field with an optional description. Clicking the label text in `SwitchField` toggles the switch.',
      },
    },
  },
  args: { label: 'Toggle' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    disabled: { control: 'boolean' },
    description: { control: 'text' },
  },
} satisfies Meta<typeof SwitchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Basic labelled switch in its default (off) state.' } },
  },
  args: { label: 'Enable notifications', defaultChecked: false },
};

export const Checked: Story = {
  parameters: {
    docs: { description: { story: 'Switch in its checked (on) state.' } },
  },
  args: { label: 'Dark mode', defaultChecked: true },
};

export const WithDescription: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Optional `description` prop renders helper text below the label. Both label and description are announced by screen readers.',
      },
    },
  },
  args: {
    label: 'Marketing emails',
    description: 'Receive emails about new products and promotions.',
    defaultChecked: false,
  },
};

export const Small: Story = {
  parameters: { docs: { description: { story: '`size="sm"` — compact toggle for dense UIs.' } } },
  args: { label: 'Compact', size: 'sm', defaultChecked: true },
};

export const Large: Story = {
  parameters: { docs: { description: { story: '`size="lg"` — larger toggle for touch-friendly UIs.' } } },
  args: { label: 'Large toggle', size: 'lg', defaultChecked: false },
};

export const BareToggle: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use the bare `Switch` component when the label is provided by the surrounding UI (e.g. in a table row or settings list). The `label` prop is used as `aria-label` for screen readers.',
      },
    },
  },
  args: { label: 'Toggle only' },
  render: ({ label }) => <Switch label={label} defaultChecked />,
};

export const Disabled: Story = {
  parameters: { docs: { description: { story: 'Disabled state — not interactive, reduced opacity.' } } },
  args: { label: 'Disabled toggle', disabled: true },
};
