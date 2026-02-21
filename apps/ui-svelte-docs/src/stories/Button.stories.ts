import type { Meta, StoryObj } from '@storybook/svelte-vite';
import ButtonShowcase from './ButtonShowcase.svelte';

const meta = {
  title: 'Components/Button',
  component: ButtonShowcase,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ButtonShowcase>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
