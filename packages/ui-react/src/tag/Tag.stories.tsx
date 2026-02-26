import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Atoms/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['accent', 'surface', 'outline', 'danger', 'success', 'warning'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    shape: { control: 'select', options: ['square', 'pill'] },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: { children: 'Fantasy', variant: 'accent', size: 'md', shape: 'square' },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag variant="accent">Accent</Tag>
      <Tag variant="surface">Surface</Tag>
      <Tag variant="outline">Outline</Tag>
      <Tag variant="success">Success</Tag>
      <Tag variant="warning">Warning</Tag>
      <Tag variant="danger">Danger</Tag>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Tag size="sm">Small</Tag>
      <Tag size="md">Medium</Tag>
      <Tag size="lg">Large</Tag>
    </div>
  ),
};

export const AllShapes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Tag shape="square">Square</Tag>
      <Tag shape="pill">Pill</Tag>
    </div>
  ),
};

export const PaintingLabels: Story = {
  name: 'Real-world: Painting labels',
  render: () => (
    <div className="flex flex-wrap gap-1">
      {['Conceptart', 'Fantasy', 'Store', 'NSFW', 'Landscape', 'Portrait'].map((t) => (
        <Tag key={t}>{t}</Tag>
      ))}
    </div>
  ),
};
