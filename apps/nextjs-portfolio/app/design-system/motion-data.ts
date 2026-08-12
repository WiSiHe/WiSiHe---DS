export const motionDurations = [
  { token: 'instant', ms: 0, use: 'Reduced-motion fallback' },
  { token: 'fast', ms: 200, use: 'Hovers, chips' },
  { token: 'base', ms: 500, use: 'Section reveals' },
  { token: 'expressive', ms: 700, use: 'Hero accents — sparingly' },
  { token: 'theme', ms: 360, use: 'Color cross-fade (globals.css)' },
] as const;

export const motionLibraries = [
  {
    name: 'motion/react',
    when: 'Enter/exit, layout, in-view reveals',
  },
  {
    name: 'GSAP + ScrollTrigger',
    when: 'Scroll scenes, brush paths',
  },
  {
    name: 'Locomotive + Lenis',
    when: 'Smooth scroll on marketing pages',
  },
  {
    name: 'CSS transitions',
    when: 'Theme, focus rings, simple hovers',
  },
] as const;

export const motionSnippet = `import { motion } from 'motion/react';
import { ScrollGrowSection } from '@wisihe/ui-react';
import { useSectionReveal } from '@/lib/motion/sectionReveal';

/** ScrollGrowSection: one-shot section entrance (fade + rise). */
function SectionReveal() {
  const { fadeUpInitial, fadeUpAnimate, viewport, transition } = useSectionReveal();

  return (
    <ScrollGrowSection className='border-t border-border/20 bg-background py-24'>
      <motion.div
        initial={fadeUpInitial}
        whileInView={fadeUpAnimate}
        viewport={viewport}
        transition={transition}
      />
    </ScrollGrowSection>
  );
}`;
