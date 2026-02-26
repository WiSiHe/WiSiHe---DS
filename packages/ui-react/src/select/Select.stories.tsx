import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';
import { IconPhoto } from '@tabler/icons-react';
import * as React from 'react';

const meta = {
  title: 'Atoms/Select',
  component: Select,
  tags: ['autodocs', 'new'],
  parameters: {
    layout: 'centered',
  },
  args: {
    placeholder: 'Select an option',
    options: [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' },
      { label: 'Option 3', value: 'opt3' },
    ],
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

import type { SelectOption } from './Select';

export const Default: Story = {
  args: {
    value: null,
    onChange: () => {}
  },
  render: (args) => {
    const [value, setValue] = React.useState<SelectOption | null>(null);
    return <div className="w-64"><Select {...args} value={value} onChange={setValue} /></div>;
  }
};

export const WithIcon: Story = {
  args: {
    value: null,
    onChange: () => {}
  },
  render: (args) => {
    const [value, setValue] = React.useState<SelectOption | null>(null);
    return <div className="w-64"><Select {...args} value={value} onChange={setValue} icon={<IconPhoto className="w-5 h-5" />} /></div>;
  }
};

export const Preselected: Story = {
  args: {
    value: null,
    onChange: () => {}
  },
  render: (args) => {
    const [value, setValue] = React.useState<SelectOption | null>(args.options ? args.options[1] : null);
    return <div className="w-64"><Select {...args} value={value} onChange={setValue} /></div>;
  }
};
