import { createFileRoute } from '@tanstack/react-router';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { FaChevronDown, FaGithub, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { SkillsSection } from '../components/marketing/SkillsSection';
import { pageVariants, springJuicy } from '../lib/motion';

export const Route = createFileRoute('/about')({
  component: AboutPage,
});

const journeyData = [
  {
    year: 'The Beginning',
    title: 'The Spark',
    content:
      'My journey started with a simple curiousity about how things work. What began as tinkering with HTML/CSS soon turned into a deep passion for building logic that creates visual impact.',
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000',
  },
  {
    year: 'Evolution',
    title: 'Logic meets Art',
    content:
      "I realized that code isn't just about functionality—it's a medium for expression. I started bridging my love for traditional painting with digital possibilities, exploring how development can be as expressive as a brushstroke.",
    image:
      'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=1000',
  },
  {
    year: 'Current Era',
    title: 'Bridging Worlds',
    content:
      "Today, I specialize in creating immersive web experiences where performance, storytelling, and digital art collide. I'm constantly pushing the boundaries of what's possible in the browser.",
    image:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000',
  },
];

function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <motion.div
      ref={containerRef}
      variants={pageVariants}
      initial='initial'
      animate='animate'
      exit='exit'
      className='bg-background overflow-x-hidden'
    >
      {/* Hero Section */}
      <section className='relative h-screen flex flex-col items-center justify-center p-4 overflow-hidden'>
        <div className='absolute inset-0 z-0 opacity-5 bg-accent/20' />

        <div className='z-10 text-center max-w-5xl'>
          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className='text-6xl md:text-9xl font-black mb-6 leading-none uppercase tracking-tighter'
          >
            Story of <br /> <span className='text-accent italic'>WiSiHe</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className='text-xl md:text-2xl text-foreground/60 font-medium uppercase tracking-[0.3em] mb-12'
          >
            Henrik Sissener
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className='flex justify-center gap-8'
          >
            {[
              { icon: <FaGithub />, href: 'https://github.com/wisihe' },
              { icon: <FaLinkedin />, href: 'https://linkedin.com/in/henrik-sissener' },
              { icon: <FaInstagram />, href: 'https://instagram.com/wisihe' },
              { icon: <FaTwitter />, href: 'https://twitter.com/wisihe' },
            ].map((social, i) => (
              <motion.a
                key={social.href}
                href={social.href}
                target='_blank'
                whileHover={{ y: -5, color: 'var(--color-accent)' }}
                className='text-3xl text-foreground/40 transition-colors'
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className='absolute bottom-10 left-1/2 -translate-x-1/2 text-accent/50 text-2xl'
        >
          <FaChevronDown />
        </motion.div>
      </section>

      {/* Journey Sections */}
      {journeyData.map((item, idx) => (
        <JourneySection key={item.title} item={item} index={idx} />
      ))}

      {/* Skills Section */}
      <div className='bg-surface/30 border-y border-border/50'>
        <SkillsSection />
      </div>

      {/* CTA Section */}
      <section className='py-40 px-4 text-center'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className='max-w-4xl mx-auto space-y-12'
        >
          <h2 className='text-4xl md:text-7xl font-black uppercase leading-tight'>
            Lets create the <span className='text-accent italic'>Future</span> together.
          </h2>
          <motion.a
            href='/contact'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='inline-block px-12 py-5 bg-accent text-accent-contrast font-black rounded-full text-xl uppercase tracking-widest shadow-xl hover:shadow-accent/40 transition-all'
          >
            Start a Conversation
          </motion.a>
        </motion.div>
      </section>
    </motion.div>
  );
}

function JourneySection({ item, index }: { item: (typeof journeyData)[0]; index: number }) {
  const ref = useRef(null);

  return (
    <section
      ref={ref}
      className='min-h-screen py-32 px-4 md:px-8 flex items-center bg-surface/5 even:bg-background overflow-hidden'
    >
      <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center'>
        <motion.div
          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`space-y-8 ${index % 2 !== 0 ? 'lg:order-2' : ''}`}
        >
          <span className='text-accent font-bold tracking-[0.4em] uppercase block text-sm'>
            {item.year}
          </span>
          <h2 className='text-5xl md:text-7xl font-black uppercase text-foreground leading-none italic tracking-tighter'>
            {item.title}
          </h2>
          <p className='text-xl md:text-2xl text-foreground/60 leading-relaxed font-light text-pretty'>
            {item.content}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: index % 2 === 0 ? 5 : -5 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`relative ${index % 2 !== 0 ? 'lg:order-1' : ''}`}
        >
          <div className='absolute -inset-4 rounded-[3rem] border border-accent/20 border-dashed' />
          <div className='relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-border/50 shadow-2xl'>
            <img src={item.image} alt={item.title} className='w-full h-full object-cover' />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
