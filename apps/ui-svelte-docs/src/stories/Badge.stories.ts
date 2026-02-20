import type { Meta, StoryObj } from '@storybook/svelte-vite';
import BadgeShowcase from './BadgeShowcase.svelte';

const meta = {
  title: 'Components/Badge',
  component: BadgeShowcase,
  tags: ['autodocs'],
} satisfies Meta<typeof BadgeShowcase>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
