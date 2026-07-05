import type { Meta, StoryObj } from '@storybook/react-vite';
import { PhotographyCardView } from './PhotographyCardView';

const LANDSCAPE =
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80';
const PORTRAIT =
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80';

const meta = {
  title: 'Cards/Photography/PhotographyCard',
  component: PhotographyCardView,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Framework-agnostic photography card with aspect-ratio frame, hover reveal, optional year badge, and title/place/caption block. App adapters supply `next/image` + a Link component and resolve Sanity data.',
      },
    },
  },
  decorators: [
    Story => (
      <div className='w-[360px] max-w-full'>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof PhotographyCardView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Morning Fjord',
    href: '#',
    imageSrc: LANDSCAPE,
    imageAlt: 'A misty fjord at sunrise',
    aspectRatio: 3 / 2,
    placeLabel: 'Geiranger · Norway',
    caption: 'Low fog rolling over the water just after sunrise.',
    yearLabel: '2025',
  },
};

export const Portrait: Story = {
  args: {
    ...Default.args,
    title: 'Pine Silhouette',
    imageSrc: PORTRAIT,
    aspectRatio: 2 / 3,
    placeLabel: 'Trondheim · Norway',
    caption: null,
  },
};

export const Large: Story = {
  args: {
    ...Default.args,
    size: 'large',
  },
  decorators: [
    Story => (
      <div className='w-[560px] max-w-full'>
        <Story />
      </div>
    ),
  ],
};

export const NoMeta: Story = {
  args: {
    title: 'Untitled',
    href: '#',
    imageSrc: LANDSCAPE,
    aspectRatio: 3 / 2,
  },
};
