import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from '@wisihe/ui-react';

const meta: Meta<typeof Grid> = {
  component: Grid,
  argTypes: {},
  args: {
    children: 'Grid',
    columns: 12,
    gap: 4,
    align: 'center',
    justify: 'center',
  },
};

export default meta;

type Story = StoryObj<typeof Grid>;

export const Primary: Story = {
  args: {
    children: 'Grid',
    columns: 12,
  },
  render: (args) => (
    <Grid {...args}>
      <Grid.Col span={12}>
        <div className="text-center text-white bg-primary">Col span 12</div>
      </Grid.Col>
      <Grid.Col span={6}>
        <div className="text-center text-white bg-primary">Col span 6</div>
      </Grid.Col>
      <Grid.Col span={6}>
        <div className="text-center text-white bg-primary">Col span 6</div>
      </Grid.Col>
      <Grid.Col span={4}>
        <div className="text-center text-white bg-primary">Col span 4</div>
      </Grid.Col>
      <Grid.Col span={4}>
        <div className="text-center text-white bg-primary">Col span 4</div>
      </Grid.Col>
      <Grid.Col span={4}>
        <div className="text-center text-white bg-primary">Col span 4</div>
      </Grid.Col>
      <Grid.Col span={3}>
        <div className="text-center text-white bg-primary">Col span 3</div>
      </Grid.Col>
      <Grid.Col span={3}>
        <div className="text-center text-white bg-primary">Col span 3</div>
      </Grid.Col>
      <Grid.Col span={3}>
        <div className="text-center text-white bg-primary">Col span 3</div>
      </Grid.Col>
      <Grid.Col span={3}>
        <div className="text-center text-white bg-primary">Col span 3</div>
      </Grid.Col>
      <Grid.Col span={2}>
        <div className="text-center text-white bg-primary">Col span 2</div>
      </Grid.Col>
      <Grid.Col span={2}>
        <div className="text-center text-white bg-primary">Col span 2</div>
      </Grid.Col>
      <Grid.Col span={2}>
        <div className="text-center text-white bg-primary">Col span 2</div>
      </Grid.Col>
      <Grid.Col span={1}>
        <div className="text-center text-white bg-primary">Col 1</div>
      </Grid.Col>
      <Grid.Col span={1}>
        <div className="text-center text-white bg-primary">Col 1</div>
      </Grid.Col>
      <Grid.Col span={1}>
        <div className="text-center text-white bg-primary">Col 1</div>
      </Grid.Col>
      <Grid.Col span={1}>
        <div className="text-center text-white bg-primary">Col 1</div>
      </Grid.Col>
      <Grid.Col span={1}>
        <div className="text-center text-white bg-primary">Col 1</div>
      </Grid.Col>
      <Grid.Col span={1}>
        <div className="text-center text-white bg-primary">Col 1</div>
      </Grid.Col>
    </Grid>
  ),
};
