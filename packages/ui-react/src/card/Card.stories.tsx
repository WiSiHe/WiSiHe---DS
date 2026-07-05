import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../button/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';

const meta = {
  title: 'Design System/Molecules/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined', 'filled'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <Card {...args} className='w-full max-w-sm'>
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Supporting description for the card content.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-foreground-subtle'>
          Card body with semantic surface tokens and consistent padding.
        </p>
      </CardContent>
      <CardFooter className='gap-2'>
        <Button size='small' variant='secondary'>
          Cancel
        </Button>
        <Button size='small'>Confirm</Button>
      </CardFooter>
    </Card>
  ),
  args: {
    variant: 'default',
    padding: 'md',
  },
};

export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div className='grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2'>
      {(['default', 'elevated', 'outlined', 'filled'] as const).map(variant => (
        <Card key={variant} variant={variant}>
          <CardHeader padding='md'>
            <CardTitle size='sm'>{variant}</CardTitle>
            <CardDescription>Variant preview</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
