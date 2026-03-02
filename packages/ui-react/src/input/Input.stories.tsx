import type { Meta, StoryObj } from '@storybook/react';
import { IconMail, IconSearch } from '@tabler/icons-react';
import { Input } from './Input';

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
    hideLabel: { control: 'boolean' },
    placeholder: { control: 'text' },
    description: { control: 'text' },
    errorMessage: { control: 'text' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Name',
    placeholder: 'Enter your name...',
    type: 'text',
  },
};

export const HiddenLabel: Story = {
  args: {
    label: 'Search',
    hideLabel: true,
    placeholder: 'Search...',
    type: 'search',
    leftIcon: <IconSearch className='w-4 h-4' />,
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Username',
    placeholder: 'johndoe',
    description: 'This will be your public display name.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    type: 'email',
    value: 'not-an-email',
    errorMessage: 'Please enter a valid email address.',
    readOnly: true,
  },
};

export const WithDescriptionAndError: Story = {
  args: {
    label: 'Password',
    type: 'password',
    description: 'Must be at least 8 characters.',
    errorMessage: 'Password is too short.',
    value: 'abc',
    readOnly: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled field',
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const WithIcons: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    type: 'email',
    leftIcon: <IconMail className='w-4 h-4' />,
    rightIcon: <IconSearch className='w-4 h-4' />,
  },
};

export const Sizes: Story = {
  args: { label: 'Size' },
  render: () => (
    <div className='flex flex-col gap-4 w-72'>
      <Input label='Small' inputSize='sm' placeholder='Small input' />
      <Input label='Default' inputSize='default' placeholder='Default input' />
      <Input label='Large' inputSize='lg' placeholder='Large input' />
    </div>
  ),
};
