import type { Meta, StoryObj } from '@storybook/react';

import { GlassSurface } from './GlassSurface';

const meta = {
  title: 'Design System/Molecules/GlassSurface',
  component: GlassSurface,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'overlay', 'backdrop'],
    },
  },
} satisfies Meta<typeof GlassSurface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <div
      className='relative flex min-h-[320px] items-center justify-center bg-cover bg-center p-8'
      style={{
        backgroundImage:
          'linear-gradient(135deg, rgb(30 30 40 / 0.9), rgb(80 40 120 / 0.85)), url("https://picsum.photos/seed/glass/1200/800")',
      }}
    >
      <GlassSurface {...args} className='max-w-md rounded-2xl border p-6'>
        <p className='text-lg font-semibold'>Glass surface</p>
        <p className='mt-2 text-sm opacity-80'>
          Frosted panel over imagery — use backdrop variant when content sits over a hero image.
        </p>
      </GlassSurface>
    </div>
  ),
  args: {
    variant: 'backdrop',
  },
};

export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div
      className='grid min-h-[480px] grid-cols-1 gap-6 bg-cover bg-center p-8 md:grid-cols-3'
      style={{
        backgroundImage:
          'linear-gradient(135deg, rgb(20 20 30 / 0.85), rgb(60 30 90 / 0.8)), url("https://picsum.photos/seed/glass2/1400/900")',
      }}
    >
      {(['default', 'overlay', 'backdrop'] as const).map(variant => (
        <GlassSurface key={variant} variant={variant} className='rounded-2xl border p-5'>
          <p className='font-semibold capitalize'>{variant}</p>
          <p className='mt-2 text-sm opacity-80'>Preview of the {variant} glass treatment.</p>
        </GlassSurface>
      ))}
    </div>
  ),
};
