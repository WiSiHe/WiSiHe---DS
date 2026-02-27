import type { Meta, StoryObj } from '@storybook/react';
import { IconAlertTriangle, IconShoppingCart, IconStack2, IconVideo } from '@tabler/icons-react';
import { PaintingCard } from './PaintingCard';

// picsum.photos works from any origin (no referrer policy) — id 1103 is a colourful abstract
const DEMO_IMG = 'https://www.wisihe.no/images/cute.jpg';

const DemoImage = ({ src = DEMO_IMG }: { src?: string }) => (
  <img src={src} alt='Demo painting' className='object-cover w-full h-full absolute inset-0' />
);

const meta: Meta<typeof PaintingCard> = {
  title: 'Molecules/PaintingCard',
  component: PaintingCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    Story => (
      <div className='w-64'>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PaintingCard>;

export const Default: Story = {
  args: {
    title: "Duckie's Kingdom",
    href: '/paintings/duckies-kingdom',
    image: <DemoImage />,
    tags: ['Fantasy', 'Conceptart'],
  },
};

export const WithBadges: Story = {
  args: {
    title: 'Available Painting',
    href: '/paintings/available-painting',
    image: <DemoImage />,
    tags: ['Store', 'Landscape'],
    badges: [
      { key: 'store', icon: <IconShoppingCart className='w-4 h-4' />, label: 'Available for sale' },
      { key: 'video', icon: <IconVideo className='w-4 h-4' />, label: 'Has video' },
      { key: 'multi', icon: <IconStack2 className='w-4 h-4' />, label: 'Multiple images' },
    ],
  },
};

export const NSFW_Blurred: Story = {
  name: 'NSFW (Blurred)',
  args: {
    title: 'Mature Content',
    href: '/paintings/mature-content',
    image: <DemoImage />,
    tags: ['NSFW'],
    isNsfw: true,
    isNsfwVisible: false,
    badges: [
      { key: 'nsfw', icon: <IconAlertTriangle className='w-4 h-4' />, label: 'NSFW content' },
    ],
  },
};

export const NSFW_Visible: Story = {
  name: 'NSFW (Unblurred)',
  args: {
    title: 'Mature Content',
    href: '/paintings/mature-content',
    image: <DemoImage />,
    tags: ['NSFW'],
    isNsfw: true,
    isNsfwVisible: true,
    badges: [
      { key: 'nsfw', icon: <IconAlertTriangle className='w-4 h-4' />, label: 'NSFW content' },
    ],
  },
};

export const NoImage: Story = {
  args: {
    title: 'Loading State',
    href: '/paintings/loading',
    tags: ['Nature'],
  },
};
