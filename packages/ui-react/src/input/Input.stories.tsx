import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { IconSearch, IconMail } from '@tabler/icons-react';

const meta = {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs', 'new'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'search'],
    },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text here...',
    type: 'text',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const WithIcons: Story = {
  args: {
    placeholder: 'Search...',
    type: 'search',
    leftIcon: <IconSearch className="w-5 h-5" />,
    rightIcon: <IconMail className="w-5 h-5" />,
  },
};
