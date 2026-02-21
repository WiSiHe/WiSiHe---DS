import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ButtonShowcase from './ButtonShowcase.vue';

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
