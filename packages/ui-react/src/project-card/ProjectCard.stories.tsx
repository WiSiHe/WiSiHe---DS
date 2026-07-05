import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ProjectCardImageFrame,
  ProjectCardImageOverlay,
  ProjectCardTags,
  ProjectCardTitleBlock,
} from './ProjectCardParts';

const SAMPLE_IMAGE =
  'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=960&q=80';

const SAMPLE_TAGS = [
  { name: 'React' },
  { name: 'TypeScript' },
  { name: 'TailwindCSS' },
  { name: 'Sanity' },
  { name: 'Branding' },
];

function CardShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className ?? 'w-[360px] max-w-full'}>
      <article className='group flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-surface shadow-sm'>
        {children}
      </article>
    </div>
  );
}

const meta = {
  title: 'Cards/Project/ProjectCard',
  component: ProjectCardImageFrame,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Framework-agnostic project card building blocks: image frame (with optional Image slot + shared-layout morph), overlay, tags, and title block. App adapters supply `next/image` and Sanity-resolved labels.',
      },
    },
  },
  args: {
    imageSrc: null,
    alt: '',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProjectCardImageFrame>;

export default meta;

type Story = StoryObj<typeof meta>;

export const GridCard: Story = {
  render: () => (
    <CardShell>
      <ProjectCardImageFrame
        imageSrc={SAMPLE_IMAGE}
        alt='Sample project'
        sizes='360px'
        overlay={
          <ProjectCardImageOverlay
            typeLabel='Development'
            trailingLabel='2025'
            statusLabel={null}
          />
        }
      />
      <div className='flex flex-1 flex-col gap-3 p-5'>
        <ProjectCardTitleBlock
          name='Portfolio Design System'
          client='WiSiHe'
          titleClassName='text-lg md:text-xl'
        />
        <p className='line-clamp-2 text-sm leading-relaxed text-foreground-subtle'>
          A monorepo design system powering multiple portfolio frontends with shared,
          framework-agnostic React components.
        </p>
        <div className='mt-auto pt-1'>
          <ProjectCardTags tags={SAMPLE_TAGS} limit={3} />
        </div>
      </div>
    </CardShell>
  ),
};

export const WithStatusOverlay: Story = {
  render: () => (
    <CardShell>
      <ProjectCardImageFrame
        imageSrc={SAMPLE_IMAGE}
        alt='Sample project'
        sizes='360px'
        overlay={
          <ProjectCardImageOverlay
            typeLabel='Game Dev'
            trailingLabel='Since 2023'
            statusLabel='In progress'
          />
        }
      />
      <div className='flex flex-1 flex-col gap-3 p-5'>
        <ProjectCardTitleBlock name='Untitled Game' titleClassName='text-lg md:text-xl' />
        <ProjectCardTags tags={SAMPLE_TAGS} limit={4} />
      </div>
    </CardShell>
  ),
};

export const NoImage: Story = {
  render: () => (
    <CardShell>
      <ProjectCardImageFrame imageSrc={null} alt='' sizes='360px' />
      <div className='flex flex-1 flex-col gap-3 p-5'>
        <ProjectCardTitleBlock name='Draft Project' titleClassName='text-lg md:text-xl' />
      </div>
    </CardShell>
  ),
};
