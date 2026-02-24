'use client';

import { motion } from 'motion/react';
import { GridBackground } from './GridBackground';

export function SourcesSection() {
  const splineWorkshop = {
    title: 'Spline Workshop: Build an Interactive Rocketship',
    description:
      "Learn how to build an interactive rocketship and publish it online in less than 40 minutes. Perfect for people who don't necessarily want to learn Three.js.",
    url: 'https://thenorthalliance.notion.site/Spline-Workshop-1b2cf2f6604a8079876bd7b025269ed5',
  };

  const workshops = [
    {
      title: 'Three.js Journey',
      url: 'https://threejs-journey.com/',
      description: 'Comprehensive Three.js course by Bruno Simon',
      featured: true,
    },
    {
      title: 'Awwwards Conference',
      url: 'https://www.awwwards.com/conference',
      description: 'Premier web design and development conference',
    },
  ];

  const showcases = [
    {
      title: 'Bruno Simon',
      url: 'https://bruno-simon.com/',
      description: 'Interactive 3D portfolio by the creator of Three.js Journey',
      highlight: 'Creator of Three.js Journey',
    },
    {
      title: 'North Kingdom',
      url: 'https://www.northkingdom.com/',
      description: 'Creative agency for gaming - part of NoA Ignite',
      highlight: 'NoA Ignite',
    },
    {
      title: 'Immersive Garden',
      url: 'https://immersive-g.com/',
      description: 'Innovative digital experiences studio crafting unparalleled brand experiences',
      highlight: 'Digital Experiences',
    },
  ];

  const tools = [
    {
      title: 'React Three Fiber',
      url: 'https://docs.pmnd.rs/react-three-fiber',
      description: 'The React renderer for Three.js (The Engine)',
      category: 'Framework',
    },
    {
      title: 'Spline',
      url: 'https://spline.design/',
      description: 'Web-based 3D design tool (The Design Tool)',
      category: 'Design Tool',
    },
    {
      title: '@react-three/drei',
      url: 'https://github.com/pmndrs/drei',
      description: 'Useful helpers for R3F (The Toolbelt)',
      category: 'Library',
    },
    {
      title: 'Google Draco',
      url: 'https://google.github.io/draco/',
      description: '3D geometry compression (The Feather)',
      category: 'Optimization',
    },
    {
      title: 'Blender',
      url: 'https://www.blender.org/',
      description: 'Free open-source 3D creation suite',
      category: '3D Software',
    },
  ];

  const sources = [
    {
      title: 'Shopify - 3D Ecommerce Study',
      url: 'https://www.shopify.com/blog/3d-ecommerce',
      description: 'Source for the 94% conversion rate statistic',
    },
    {
      title: 'Cappasity - Engagement Metrics',
      url: 'https://cappasity.com/blog/3d-product-imaging-metrics/',
      description: 'Source for the 300% increase in dwell time',
    },
    {
      title: 'Threekit - ROI & Returns Report',
      url: 'https://www.threekit.com/guide-to-roi-in-3d-and-augmented-reality',
      description: 'Source for the 40% reduction in returns',
    },
    {
      title: 'Virsabi - VR/AR Business Cases',
      url: 'https://virsabi.com/increase-conversions-in-online-shops-with-94/',
      description: 'Additional data on immersive commerce',
    },
  ];

  return (
    <section className='w-full flex flex-col items-center py-20 md:py-28 lg:py-36 relative bg-background overflow-hidden'>
      <GridBackground />

      {/* Enhanced Decorative Background Elements */}
      <div className='absolute inset-0 opacity-[0.04] pointer-events-none z-0'>
        <div className='absolute top-0 right-0 w-[500px] h-[500px] bg-accent rounded-full blur-3xl animate-pulse' />
        <div
          className='absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent rounded-full blur-3xl animate-pulse'
          style={{ animationDelay: '1s' }}
        />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/30 rounded-full blur-3xl' />
      </div>

      <div className='relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16'>
        <div className='space-y-16 md:space-y-20'>
          {/* Enhanced Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='text-center space-y-6'
          >
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-2'>
              <div className='h-2 w-2 rounded-full bg-accent animate-pulse' />
              <span className='text-sm font-mono text-accent uppercase tracking-wider font-semibold'>
                Resources
              </span>
            </div>
            <h2 className='text-5xl md:text-6xl lg:text-7xl font-black text-foreground uppercase tracking-tight'>
              Sources & Resources
            </h2>
            <p className='text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed'>
              Everything you need to dive deeper into 3D on the web
            </p>
          </motion.div>

          {/* Spline Workshop - Enhanced Prominent Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className='relative bg-gradient-to-br from-surface-elevated to-surface border-4 border-accent/50 rounded-3xl p-8 md:p-12 shadow-2xl shadow-accent/20 overflow-hidden group'
          >
            {/* Gradient overlay on hover */}
            <div className='absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

            <div className='relative z-10'>
              <div className='flex items-start justify-between gap-6 mb-6'>
                <div className='flex-1'>
                  <div className='flex items-center gap-3 mb-4'>
                    <div className='h-3 w-3 rounded-full bg-accent animate-pulse' />
                    <span className='text-sm font-mono text-accent uppercase tracking-wider font-semibold'>
                      Featured Workshop
                    </span>
                  </div>
                  <h3 className='text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4 leading-tight'>
                    {splineWorkshop.title}
                  </h3>
                  <p className='text-lg md:text-xl text-foreground/70 mb-8 leading-relaxed max-w-3xl'>
                    {splineWorkshop.description}
                  </p>
                </div>
              </div>
              <motion.a
                href={splineWorkshop.url}
                target='_blank'
                rel='noopener noreferrer'
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className='inline-flex items-center gap-3 px-8 py-4 bg-accent text-accent-contrast rounded-xl font-bold text-lg hover:shadow-xl shadow-lg shadow-accent/30 transition-all group/btn'
              >
                <span>View Workshop</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={2.5}
                  stroke='currentColor'
                  className='w-5 h-5 transition-transform group-hover/btn:translate-x-1'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3'
                  />
                </svg>
              </motion.a>
            </div>
          </motion.div>

          {/* Inspiration & Showcases Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='space-y-6'
          >
            <div className='flex items-center gap-4'>
              <h3 className='text-2xl md:text-3xl lg:text-4xl font-black text-foreground uppercase tracking-tight'>
                Inspiration & Showcases
              </h3>
              <div className='flex-1 h-px bg-gradient-to-r from-border via-accent/20 to-transparent' />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {showcases.map((showcase, index) => (
                <motion.a
                  key={showcase.title}
                  href={showcase.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className='group relative p-6 md:p-8 bg-gradient-to-br from-surface-elevated to-surface border-2 border-border rounded-2xl hover:border-accent/50 transition-all overflow-hidden'
                >
                  {/* Hover gradient effect */}
                  <div className='absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

                  <div className='relative z-10'>
                    {showcase.highlight && (
                      <span className='inline-block px-3 py-1 mb-3 text-xs font-mono text-accent-text bg-accent-subtle border border-accent-border rounded-full'>
                        {showcase.highlight}
                      </span>
                    )}
                    <h4 className='text-xl md:text-2xl font-black text-foreground mb-3 group-hover:text-accent transition-colors'>
                      {showcase.title}
                    </h4>
                    <p className='text-sm md:text-base text-foreground/70 leading-relaxed'>
                      {showcase.description}
                    </p>
                    <div className='mt-4 flex items-center gap-2 text-accent opacity-0 group-hover:opacity-100 transition-opacity'>
                      <span className='text-sm font-semibold'>Visit site</span>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={2}
                        stroke='currentColor'
                        className='w-4 h-4'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3'
                        />
                      </svg>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Workshops Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='space-y-6'
          >
            <div className='flex items-center gap-4'>
              <h3 className='text-2xl md:text-3xl lg:text-4xl font-black text-foreground uppercase tracking-tight'>
                Workshops & Courses
              </h3>
              <div className='flex-1 h-px bg-gradient-to-r from-border via-accent/20 to-transparent' />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {workshops.map((workshop, index) => (
                <motion.a
                  key={workshop.title}
                  href={workshop.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group relative p-6 md:p-8 rounded-2xl border-2 transition-all overflow-hidden ${
                    workshop.featured
                      ? 'bg-gradient-to-br from-accent/10 via-surface-elevated to-surface border-accent/50 shadow-lg shadow-accent/10'
                      : 'bg-gradient-to-br from-surface-elevated to-surface border-border hover:border-accent/50'
                  }`}
                >
                  {/* Hover gradient effect */}
                  <div className='absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

                  <div className='relative z-10'>
                    {workshop.featured && (
                      <span className='inline-block px-3 py-1 mb-3 text-xs font-mono text-accent-text bg-accent-subtle rounded-full'>
                        Recommended
                      </span>
                    )}
                    <h4 className='text-xl md:text-2xl font-black text-foreground mb-3 group-hover:text-accent transition-colors'>
                      {workshop.title}
                    </h4>
                    {workshop.description && (
                      <p className='text-sm md:text-base text-foreground/70 leading-relaxed'>
                        {workshop.description}
                      </p>
                    )}
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Tools Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className='space-y-6'
          >
            <div className='flex items-center gap-4'>
              <h3 className='text-2xl md:text-3xl lg:text-4xl font-black text-foreground uppercase tracking-tight'>
                Tools & Libraries
              </h3>
              <div className='flex-1 h-px bg-gradient-to-r from-border via-accent/20 to-transparent' />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
              {tools.map((tool, index) => (
                <motion.a
                  key={tool.title}
                  href={tool.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className='group relative p-6 bg-gradient-to-br from-surface-elevated to-surface border-2 border-border rounded-xl hover:border-accent/50 transition-all overflow-hidden'
                >
                  {/* Hover gradient effect */}
                  <div className='absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

                  <div className='relative z-10'>
                    {tool.category && (
                      <span className='inline-block px-2 py-1 mb-3 text-xs font-mono text-foreground/50 bg-surface rounded'>
                        {tool.category}
                      </span>
                    )}
                    <h4 className='text-lg md:text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors'>
                      {tool.title}
                    </h4>
                    <p className='text-sm text-foreground/70 leading-relaxed'>{tool.description}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Sources Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className='space-y-6'
          >
            <div className='flex items-center gap-4'>
              <h3 className='text-2xl md:text-3xl lg:text-4xl font-black text-foreground uppercase tracking-tight'>
                Sources & References
              </h3>
              <div className='flex-1 h-px bg-gradient-to-r from-border via-accent/20 to-transparent' />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {sources.map((source, index) => (
                <motion.a
                  key={source.title}
                  href={source.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.05 }}
                  whileHover={{ x: 4, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className='group p-5 bg-gradient-to-br from-surface to-surface-elevated border border-border rounded-xl hover:border-accent/50 hover:bg-surface-elevated transition-all flex items-start gap-4'
                >
                  <div className='mt-0.5 shrink-0'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={2}
                      stroke='currentColor'
                      className='w-5 h-5 text-foreground/40 group-hover:text-accent transition-colors'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3'
                      />
                    </svg>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <span className='block text-foreground/90 group-hover:text-foreground font-semibold mb-1 transition-colors'>
                      {source.title}
                    </span>
                    <p className='text-xs text-foreground/60'>{source.description}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
