'use client';

import type { Meta, StoryObj } from '@storybook/react';
import { IconMask, IconStack2 } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { BrushRevealFrame, type BrushRevealFrameProps } from './brush-reveal/BrushRevealFrame';
import type { BrushRevealBadge } from './brush-reveal/BrushRevealLayer';
import { BRUSH_STROKE_VARIANTS, type BrushStrokeVariant } from './brush-stroke/brushStrokeVariants';
import type { PaintingFormat } from './layout';

const DEMO_IMAGE = 'https://www.wisihe.no/images/cute.jpg';
const LOOP_MS = 3200;

const demoBadges: BrushRevealBadge[] = [
  {
    key: 'fanart',
    icon: <IconMask className='size-4' stroke={2} aria-hidden />,
    label: 'Fan art',
  },
  {
    key: 'multi',
    icon: <IconStack2 className='size-4' stroke={2} aria-hidden />,
    label: 'Multiple images',
  },
];

const FORMATS: { id: PaintingFormat; label: string; frameClass: string }[] = [
  {
    id: 'portrait',
    label: 'Portrait',
    frameClass: 'relative aspect-[3/4] w-full overflow-hidden rounded-xl',
  },
  {
    id: 'landscape',
    label: 'Landscape',
    frameClass: 'relative aspect-[4/3] w-full overflow-hidden rounded-xl',
  },
  {
    id: 'square',
    label: 'Square',
    frameClass: 'relative aspect-square w-full overflow-hidden rounded-xl',
  },
];

const cardFrame = 'w-[min(100%,320px)]';

function formatVariantMotionDetail(variant: BrushStrokeVariant): string {
  const { timing, pairLabel } = variant.band;
  const wipe =
    timing.wipe.axis === 'horizontal' ? 'L/R' : timing.wipe.from === 'top' ? '↓ top' : '↑ bottom';
  const stagger =
    timing.strokeStaggerSec > 0 ? ` · ${Math.round(timing.strokeStaggerSec * 1000)}ms stagger` : '';
  return `${pairLabel} · ${wipe} · ${timing.durationScale.toFixed(2)}× · ${timing.drawEase}${stagger}`;
}

type PlaygroundProps = BrushRevealFrameProps & {
  loopReveal?: boolean;
};

function BrushRevealPlayground({ loopReveal = true, hovered, ...frameProps }: PlaygroundProps) {
  const [looped, setLooped] = useState(false);

  useEffect(() => {
    if (!loopReveal) return undefined;
    const id = window.setInterval(() => setLooped(active => !active), LOOP_MS);
    return () => window.clearInterval(id);
  }, [loopReveal]);

  const revealActive = loopReveal ? looped : hovered;
  const variant = BRUSH_STROKE_VARIANTS[frameProps.strokeVariantIndex ?? 0];

  return (
    <div>
      <BrushRevealFrame
        {...frameProps}
        hovered={revealActive}
        imageSrc={frameProps.imageSrc ?? DEMO_IMAGE}
      />
      <div className='mt-3 space-y-1 text-center'>
        <p className='font-mono text-xs font-bold text-foreground'>
          grid band · {variant?.id ?? 'classic'}
        </p>
        <p className='font-mono text-[10px] text-foreground-muted'>
          preset: {variant?.band.pairLabel ?? '—'}
        </p>
        <p className='text-xs text-foreground-muted'>
          {loopReveal ? 'Looping reveal — toggle off in Controls for hover' : 'Hover to reveal'}
        </p>
      </div>
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

function KitchenSinkTile({
  name,
  detail,
  children,
}: {
  name: string;
  detail?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className='min-w-0'>
      <figcaption className='mb-2 rounded-lg border border-border/50 bg-surface px-3 py-2 shadow-sm'>
        <p className='truncate font-mono text-xs font-bold text-foreground' title={name}>
          {name}
        </p>
        {detail ? (
          <p className='mt-0.5 font-mono text-[10px] font-medium text-foreground-muted'>{detail}</p>
        ) : null}
      </figcaption>
      {children}
    </figure>
  );
}

function KitchenSinkGallery() {
  return (
    <div className='min-h-screen bg-background px-4 py-8 md:px-8 md:py-12'>
      <div className='mx-auto flex max-w-[1400px] flex-col gap-14'>
        <header className='space-y-2'>
          <p className='font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent'>
            Effects / Brush reveal
          </p>
          <h1 className='font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl'>
            Grid band
          </h1>
          <p className='max-w-2xl text-sm leading-relaxed text-foreground-muted'>
            Six curated path pairs with distinct motion: horizontal or vertical wipes, optional
            second-stroke stagger, and per-variant speed and easing. Hover any tile to compare.
          </p>
        </header>

        <section className='space-y-5'>
          <SectionHeading
            title={`Curated pairs (${BRUSH_STROKE_VARIANTS.length})`}
            description='Each preset differs in wipe axis, draw speed (0.75–1.35×), easing, and second-stroke stagger.'
          />
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3'>
            {BRUSH_STROKE_VARIANTS.map((variant, index) => (
              <KitchenSinkTile
                key={variant.id}
                name={variant.id}
                detail={formatVariantMotionDetail(variant)}
              >
                <BrushRevealFrame
                  paintingFormat='portrait'
                  strokeVariantIndex={index}
                  title="Duckie's Kingdom"
                  year='2024'
                  badges={demoBadges}
                />
              </KitchenSinkTile>
            ))}
          </div>
        </section>

        <section className='space-y-5'>
          <SectionHeading
            title='NSFW (hover band + blur)'
            description='Blurred artwork at rest; same band wipe on hover.'
          />
          <div className='grid grid-cols-2 gap-4 sm:max-w-md'>
            <KitchenSinkTile name='NSFW card' detail='blur + band hover'>
              <BrushRevealFrame
                strokeVariantIndex={2}
                title='Mature study'
                year='2023'
                isNsfwBlurred
              />
            </KitchenSinkTile>
          </div>
        </section>

        <section className='space-y-5'>
          <SectionHeading title='Formats' description='Wave preset across aspect ratios.' />
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
            {FORMATS.map(({ id, label, frameClass }) => (
              <KitchenSinkTile key={id} name={label} detail={`format: ${id}`}>
                <BrushRevealFrame
                  paintingFormat={id}
                  frameClass={frameClass}
                  strokeVariantIndex={5}
                  title=''
                  badges={demoBadges}
                />
              </KitchenSinkTile>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const strokeOptions = Object.fromEntries(
  BRUSH_STROKE_VARIANTS.map((variant, index) => [index, `${index}: ${variant.id}`]),
);

const meta: Meta<typeof BrushRevealPlayground> = {
  title: 'Effects/BrushReveal',
  component: BrushRevealPlayground,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Grid band brush reveal — six curated path pairs with per-variant wipe axis, speed, easing, and stroke stagger. Opt in per surface via `brushReveal`.',
      },
    },
  },
  argTypes: {
    paintingFormat: {
      control: 'select',
      options: FORMATS.map(f => f.id),
    },
    strokeVariantIndex: {
      control: { type: 'select' },
      options: BRUSH_STROKE_VARIANTS.map((_, index) => index),
      labels: strokeOptions,
    },
    loopReveal: { control: 'boolean' },
    brushReveal: { control: 'boolean' },
    isNsfwBlurred: { control: 'boolean' },
  },
  decorators: [
    (Story, context) => {
      if (context.parameters.fullBleed) return <Story />;
      return (
        <div className={cardFrame}>
          <Story />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof BrushRevealPlayground>;

export const Playground: Story = {
  args: {
    paintingFormat: 'portrait',
    strokeVariantIndex: 0,
    title: "Duckie's Kingdom",
    year: '2024',
    badges: demoBadges,
    loopReveal: true,
    brushReveal: true,
  },
};

export const KitchenSink: Story = {
  name: 'Kitchen sink',
  parameters: { layout: 'fullscreen', fullBleed: true },
  render: () => <KitchenSinkGallery />,
};
