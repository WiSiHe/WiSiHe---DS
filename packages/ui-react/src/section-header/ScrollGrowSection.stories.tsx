import type { Meta, StoryObj } from '@storybook/react';

import { ScrollGrowSection, SectionHeader } from './ScrollGrowSection';

const meta = {
  title: 'Design System/Molecules/SectionHeader',
  component: SectionHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    eyebrow: 'Featured work',
    title: 'Selected projects',
    description: 'A curated set of recent client and personal work.',
    align: 'center',
  },
};

export const LeftAligned: Story = {
  name: 'Left aligned',
  args: {
    eyebrow: 'About',
    title: 'Design & development',
    description: 'Building thoughtful digital products.',
    align: 'left',
  },
};

export const DisplayVariant: Story = {
  name: 'Display variant',
  args: {
    eyebrow: 'Shop',
    title: 'Prints',
    variant: 'display',
  },
};

export const WithScrollGrowSection: Story = {
  name: 'Inside ScrollGrowSection',
  render: () => (
    <div className='space-y-[80vh]'>
      <p className='text-sm text-foreground-muted'>Scroll down to reveal the section.</p>
      <ScrollGrowSection className='rounded-2xl border border-border bg-surface p-10'>
        <SectionHeader
          eyebrow='Motion'
          title='Scroll-triggered reveal'
          description='One-shot entrance animation on first scroll into view.'
        />
      </ScrollGrowSection>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};
