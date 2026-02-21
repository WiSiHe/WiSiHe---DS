import type { Meta, StoryObj } from '@storybook/web-components-vite';

type BadgeArgs = {
  label: string;
  variant: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  size: 'sm' | 'md' | 'lg';
};

const meta = {
  title: 'Components/Badge',
  tags: ['autodocs'],
  args: {
    label: 'Default',
    variant: 'default',
    size: 'md',
  },
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['default', 'secondary', 'success', 'warning', 'danger', 'outline'],
    },
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
    },
  },
  render: (args: BadgeArgs) => {
    const element = document.createElement('wisihe-badge');
    element.textContent = args.label;
    element.setAttribute('variant', args.variant);
    element.setAttribute('size', args.size);
    return element;
  },
} satisfies Meta<BadgeArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Success: Story = {
  args: {
    label: 'Success',
    variant: 'success',
  },
};
