import type { Meta, StoryObj } from '@storybook/vue3-vite';
import BadgeShowcase from './BadgeShowcase.vue';

const meta = {
  title: 'Components/Badge',
  component: BadgeShowcase,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof BadgeShowcase>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
