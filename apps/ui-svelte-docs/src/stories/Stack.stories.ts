import type { Meta, StoryObj } from '@storybook/svelte-vite';
import StackShowcase from './StackShowcase.svelte';

const meta = {
  title: 'Layout/Stack',
  component: StackShowcase,
  tags: ['autodocs'],
} satisfies Meta<typeof StackShowcase>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
