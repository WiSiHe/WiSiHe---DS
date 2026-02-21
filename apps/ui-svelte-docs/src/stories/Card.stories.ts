import type { Meta, StoryObj } from '@storybook/svelte-vite';
import CardShowcase from './CardShowcase.svelte';

const meta = {
  title: 'Components/Card',
  component: CardShowcase,
  tags: ['autodocs'],
} satisfies Meta<typeof CardShowcase>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
