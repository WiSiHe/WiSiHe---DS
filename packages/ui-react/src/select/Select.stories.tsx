import type { Meta, StoryObj } from '@storybook/react';
import { IconMusic, IconPhoto, IconVideo } from '@tabler/icons-react';
import * as React from 'react';
import { Select, type SelectOption } from './Select';

const meta = {
  title: 'Atoms/Select',
  component: Select,
  tags: ['autodocs', 'new'],
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'Choose an option',
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

export const Default: Story = {
  args: {
    value: null,
    onChange: () => {},
  },
  render: args => {
    const [value, setValue] = React.useState<SelectOption | null>(null);
    return (
      <div className='w-64'>
        <Select {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

const optionsWithIcons: SelectOption[] = [
  { label: 'Photos', value: 'opt1', icon: <IconPhoto className='size-4' /> },
  { label: 'Video', value: 'opt2', icon: <IconVideo className='size-4' /> },
  { label: 'Audio', value: 'opt3', icon: <IconMusic className='size-4' /> },
];

export const WithIcon: Story = {
  args: {
    value: null,
    onChange: () => {},
  },
  render: args => {
    const [value, setValue] = React.useState<SelectOption | null>(null);
    return (
      <div className='w-64'>
        <Select {...args} options={optionsWithIcons} value={value} onChange={setValue} />
      </div>
    );
  },
};

export const Preselected: Story = {
  args: {
    value: null,
    onChange: () => {},
  },
  render: args => {
    const [value, setValue] = React.useState<SelectOption | null>(
      args.options ? args.options[1] : null,
    );
    return (
      <div className='w-64'>
        <Select {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};
