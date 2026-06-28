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

export const motionSnippet = `const reduced = useReducedMotion();

<motion.section
  initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-80px' }}
  transition={reduced ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' }}
/>`;
