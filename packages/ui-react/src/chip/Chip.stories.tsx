import type { Meta, StoryObj } from '@storybook/react';
import { IconTag } from '@tabler/icons-react';
import { Chip } from './Chip';

const meta: Meta<typeof Chip> = {
  title: 'Molecules/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variation: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'tertiary', 'highlight', 'success'],
    },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    interactive: { control: 'boolean' },
    outlined: { control: 'boolean' },
    selected: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  args: { label: 'Label', variation: 'default', size: 'medium' },
};

export const WithIcon: Story = {
  args: { label: 'Tagged', Icon: IconTag, variation: 'primary' },
};

export const Removable: Story = {
  args: { label: 'Removable', removable: true, onRemove: () => {} },
};

export const NonInteractive: Story = {
  args: { label: 'Read only', interactive: false, outlined: true },
};
