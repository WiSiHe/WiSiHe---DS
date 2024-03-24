import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@wisihe/ui-react';

const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    type: {
      control: { type: 'radio' },
      options: ['button', 'submit', 'reset'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  name: 'Button',
  args: {
    type: 'button',
    variant: 'primary',
    size: 'medium',
    label: 'Beetton',
  },
};
