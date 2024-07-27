import type { Meta, StoryObj } from '@storybook/react';
import { Flex } from '@wisihe/ui-react';

const meta: Meta<typeof Flex> = {
  component: Flex,
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof Flex>;

export const Primary: Story = {
  args: {
    children: 'Flex',
  },
  render: (args) => <Flex {...args} />,
};
