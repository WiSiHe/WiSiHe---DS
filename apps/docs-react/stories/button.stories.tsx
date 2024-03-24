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
  render: (props) => <Button {...props}>Hello</Button>,
  name: 'Button',
  args: {
    children: 'Hello',
    type: 'button',
    style: {
      color: 'blue',
      border: '1px solid gray',
      padding: 10,
      borderRadius: 10,
    },
  },
};
