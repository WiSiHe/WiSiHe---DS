import type { PortableTextBlock } from 'next-sanity';
import CustomPortableText from '@/app/components/cms/PortableText/PortableText';

type ProjectCaseStudyProps = {
  content: PortableTextBlock[];
};

export default function ProjectCaseStudy({ content }: ProjectCaseStudyProps) {
  if (!content.length) return null;

  return (
    <section
      className='border-t border-border/60 bg-surface-subtle/20 py-14 lg:py-20'
      aria-label='Project case study'
    >
      <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
        <CustomPortableText variant='article' value={content} />
      </div>
    </section>
  );
}
