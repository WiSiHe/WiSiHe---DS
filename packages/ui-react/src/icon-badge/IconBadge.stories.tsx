import type { Meta, StoryObj } from '@storybook/react';
import {
  IconAlertTriangle,
  IconCheck,
  IconShoppingCart,
  IconStack2,
  IconStar,
  IconVideo,
} from '@tabler/icons-react';
import { IconBadge } from './IconBadge';

const meta: Meta<typeof IconBadge> = {
  title: 'Design System/Atoms/IconBadge',
  component: IconBadge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['accent', 'surface', 'outline', 'success', 'danger', 'warning'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    shape: { control: 'select', options: ['square', 'circle'] },
    shadow: { control: 'select', options: ['none', 'sm', 'md'] },
  },
};

export default meta;
type Story = StoryObj<typeof IconBadge>;

export const Default: Story = {
  args: {
    icon: <IconShoppingCart />,
    label: 'Available for sale',
    variant: 'accent',
    size: 'md',
    shape: 'square',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      <IconBadge icon={<IconStar />} label='Accent' variant='accent' />
      <IconBadge icon={<IconStar />} label='Surface' variant='surface' />
      <IconBadge icon={<IconStar />} label='Outline' variant='outline' />
      <IconBadge icon={<IconCheck />} label='Success' variant='success' />
      <IconBadge icon={<IconAlertTriangle />} label='Warning' variant='warning' />
      <IconBadge icon={<IconAlertTriangle />} label='Danger' variant='danger' />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className='flex items-center gap-2'>
      <IconBadge icon={<IconShoppingCart />} label='Small' size='sm' />
      <IconBadge icon={<IconShoppingCart />} label='Medium' size='md' />
      <IconBadge icon={<IconShoppingCart />} label='Large' size='lg' />
    </div>
  ),
};

export const AllShapes: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <div className='flex flex-col items-center gap-1'>
        <IconBadge icon={<IconShoppingCart />} label='Square' shape='square' />
        <span className='text-xs text-foreground-muted'>square</span>
      </div>
      <div className='flex flex-col items-center gap-1'>
        <IconBadge icon={<IconShoppingCart />} label='Circle' shape='circle' />
        <span className='text-xs text-foreground-muted'>circle</span>
      </div>
    </div>
  ),
};

export const PaintingCardBadges: Story = {
  name: 'Real-world: Painting card badges',
  render: () => (
    <div className='flex flex-col gap-1'>
      <IconBadge icon={<IconShoppingCart />} label='Available for sale' shape='square' />
      <IconBadge icon={<IconStack2 />} label='Multiple images' shape='square' />
      <IconBadge icon={<IconVideo />} label='Has video' shape='square' />
      <IconBadge icon={<IconAlertTriangle />} label='NSFW content' shape='square' />
    </div>
  ),
};
