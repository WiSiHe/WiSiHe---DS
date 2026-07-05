'use client';

import type { Meta, StoryObj } from '@storybook/react';
import { IconBrandYoutube, IconMask, IconStack2 } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import type { PaintingCardBadge } from './PaintingCard';
import { PaintingCardView, type PaintingCardViewProps } from './PaintingCardView';

const DEMO_IMAGE = 'https://www.wisihe.no/images/cute.jpg';
const NSFW_IMAGE = 'https://www.wisihe.no/images/cute.jpg';
const LOOP_MS = 3200;
const cardFrameClass = 'w-[min(100%,280px)]';

const gridBadges: PaintingCardBadge[] = [
  { key: 'fanart', icon: <IconMask stroke={2} aria-hidden />, label: 'Fan art' },
  { key: 'multi', icon: <IconStack2 stroke={2} aria-hidden />, label: 'Multiple images' },
  { key: 'video', icon: <IconBrandYoutube stroke={2} aria-hidden />, label: 'Has video' },
];

const gridArgs: PaintingCardViewProps = {
  title: "Duckie's Kingdom",
  href: '/paintings/duckies-kingdom',
  imageSrc: DEMO_IMAGE,
  imageAlt: "Duckie's Kingdom",
  format: 'portrait',
  aspectRatio: 3 / 4,
  paintedAt: '2024',
  badges: gridBadges,
  brushSeedKey: 'storybook-grid',
};

type PlaygroundProps = PaintingCardViewProps & {
  loopReveal?: boolean;
};

function PaintingCardPlayground({
  loopReveal = true,
  brushHovered,
  layout,
  ...viewProps
}: PlaygroundProps) {
  const [looped, setLooped] = useState(false);
  const useCaption = layout === 'carousel' && !(viewProps.isNsfw && !viewProps.isNsfwVisible);

  useEffect(() => {
    if (!loopReveal || useCaption) return undefined;
    const id = window.setInterval(() => setLooped(active => !active), LOOP_MS);
    return () => window.clearInterval(id);
  }, [loopReveal, useCaption]);

  const revealActive = loopReveal && !useCaption ? looped : brushHovered;

  return (
    <div>
      <PaintingCardView {...viewProps} layout={layout} brushHovered={revealActive} />
      {!useCaption ? (
        <p className='mt-3 text-center text-xs text-foreground-muted'>
          {loopReveal ? 'Looping brush reveal' : 'Hover to reveal metadata'}
        </p>
      ) : null}
    </div>
  );
}

function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className='border-b border-border/50 pb-3'>
      <h2 className='font-serif text-xl font-bold tracking-tight text-foreground'>{title}</h2>
      {description ? (
        <p className='mt-1 max-w-3xl text-sm leading-relaxed text-foreground-muted'>
          {description}
        </p>
      ) : null}
    </div>
  );
}

function ExampleTile({
  name,
  detail,
  hint,
  children,
}: {
  name: string;
  detail?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className='min-w-0'>
      <figcaption className='mb-3 rounded-lg border border-border/50 bg-surface px-3 py-2 shadow-sm'>
        <p className='font-mono text-xs font-bold text-foreground'>{name}</p>
        {detail ? (
          <p className='mt-0.5 font-mono text-[10px] font-medium text-foreground-muted'>{detail}</p>
        ) : null}
        {hint ? (
          <p className='mt-1 text-[11px] leading-snug text-foreground-subtle'>{hint}</p>
        ) : null}
      </figcaption>
      <div className='mx-auto w-[min(100%,280px)]'>{children}</div>
    </figure>
  );
}

function LoopingGridCard(props: PaintingCardViewProps) {
  const [looped, setLooped] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setLooped(active => !active), LOOP_MS);
    return () => window.clearInterval(id);
  }, []);

  return <PaintingCardView {...props} brushHovered={looped} />;
}

function ExamplesGallery() {
  return (
    <div className='min-h-screen bg-background px-4 py-8 md:px-8 md:py-12'>
      <div className='mx-auto flex max-w-[1200px] flex-col gap-12'>
        <header className='space-y-2'>
          <p className='font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent'>
            Cards / Painting
          </p>
          <h1 className='font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl'>
            Painting card modes
          </h1>
          <p className='max-w-2xl text-sm leading-relaxed text-foreground-muted'>
            Grid cards use brush reveal on hover with pinned attribute badges. SFW carousel slides
            show a title below the image. Blurred NSFW items show a top-left{' '}
            <strong className='font-medium text-foreground'>18+</strong> badge on the image only —
            title on brush hover (grid) or in the link label (carousel/mobile).
          </p>
        </header>

        <section className='space-y-5'>
          <SectionHeading
            title='Primary surfaces'
            description='How paintings render in the grid, mobile carousel, and when the NSFW filter is off.'
          />
          <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4'>
            <ExampleTile
              name='Grid'
              detail='layout: default · brushReveal'
              hint='Looping band wipe — title/year on hover. Badges pinned on image.'
            >
              <LoopingGridCard {...gridArgs} />
            </ExampleTile>

            <ExampleTile
              name='Carousel'
              detail='layout: carousel'
              hint='Title below image only — no year, no attribute badges.'
            >
              <PaintingCardView {...gridArgs} layout='carousel' brushSeedKey='storybook-carousel' />
            </ExampleTile>

            <ExampleTile
              name='NSFW · carousel'
              detail='layout: carousel · filter off'
              hint='Blurred image, 18+ top-left — no caption strip.'
            >
              <PaintingCardView
                {...gridArgs}
                title='Figure Study'
                imageSrc={NSFW_IMAGE}
                layout='carousel'
                isNsfw
                brushSeedKey='storybook-nsfw-carousel'
              />
            </ExampleTile>

            <ExampleTile
              name='NSFW · grid'
              detail='layout: default · filter off'
              hint='Blurred image, 18+ top-left, title on band hover.'
            >
              <LoopingGridCard
                {...gridArgs}
                title='Figure Study'
                imageSrc={NSFW_IMAGE}
                isNsfw
                brushSeedKey='storybook-nsfw-grid'
              />
            </ExampleTile>
          </div>
        </section>

        <section className='space-y-5'>
          <SectionHeading
            title='Filter on'
            description='When the NSFW tag filter is active, blurred cards behave like their normal layout.'
          />
          <div className='grid grid-cols-1 gap-8 sm:grid-cols-2'>
            <ExampleTile
              name='NSFW visible · grid'
              detail='isNsfwVisible'
              hint='Same as grid — no blur, full reveal.'
            >
              <LoopingGridCard
                {...gridArgs}
                title='Figure Study'
                isNsfw
                isNsfwVisible
                brushSeedKey='storybook-nsfw-visible'
              />
            </ExampleTile>
            <ExampleTile
              name='NSFW visible · carousel'
              detail='isNsfwVisible'
              hint='Same as carousel — title only.'
            >
              <PaintingCardView
                {...gridArgs}
                title='Figure Study'
                layout='carousel'
                isNsfw
                isNsfwVisible
                brushSeedKey='storybook-nsfw-visible-carousel'
              />
            </ExampleTile>
          </div>
        </section>
      </div>
    </div>
  );
}

const meta: Meta<typeof PaintingCardPlayground> = {
  title: 'Cards/Painting/PaintingCard',
  component: PaintingCardPlayground,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '**Grid** — brush reveal on hover + pinned badges. **SFW carousel** — title below image. **NSFW blurred** — image blur + **18+** top-left (no caption strip). **Filter on** — same as SFW layout. Brush details: **Effects/BrushReveal**. Compact search tiles: **PaintingThumbnail**.',
      },
    },
  },
  argTypes: {
    loopReveal: { control: 'boolean' },
    layout: { control: 'select', options: ['default', 'carousel'] },
    isNsfw: { control: 'boolean' },
    isNsfwVisible: { control: 'boolean' },
  },
  decorators: [
    (Story, context) => {
      if (context.parameters.fullBleed) return <Story />;
      return (
        <div className={cardFrameClass}>
          <Story />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof PaintingCardPlayground>;

export const Playground: Story = {
  args: {
    ...gridArgs,
    loopReveal: true,
  },
};

export const Examples: Story = {
  name: 'Examples',
  parameters: { layout: 'fullscreen', fullBleed: true },
  render: () => <ExamplesGallery />,
};
