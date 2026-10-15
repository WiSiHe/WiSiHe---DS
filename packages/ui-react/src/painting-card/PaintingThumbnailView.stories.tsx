import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaintingThumbnailView } from './PaintingThumbnailView';

const SAMPLE_IMAGE =
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=600&q=80';

const meta: Meta<typeof PaintingThumbnailView> = {
  title: 'Cards/Painting/PaintingThumbnail',
  component: PaintingThumbnailView,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Compact search tile — image + title. NSFW uses image blur. Not the main gallery card (`PaintingCardView`).',
      },
    },
  },
  decorators: [
    Story => (
      <div className='w-[200px] max-w-full'>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof PaintingThumbnailView>;

export const Playground: Story = {
  args: {
    title: 'Sunset Study',
    href: '#',
    imageSrc: SAMPLE_IMAGE,
    aspectClass: 'aspect-[3/4]',
  },
};
