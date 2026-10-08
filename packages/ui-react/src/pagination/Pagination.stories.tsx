import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Design System/Molecules/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

function PaginationDemo({ nbPages = 12 }: { nbPages?: number }) {
  const [page, setPage] = useState(0);

  return <Pagination page={page} nbPages={nbPages} onPageChange={setPage} />;
}

export const Default: Story = {
  render: () => <PaginationDemo />,
};

export const ManyPages: Story = {
  name: 'Many pages',
  render: () => <PaginationDemo nbPages={42} />,
};

export const Disabled: Story = {
  render: () => <Pagination page={2} nbPages={8} onPageChange={() => {}} disabled />,
};
