import { createFileRoute } from '@tanstack/react-router';
import { Button, Input, Textarea } from '@wisihe/ui-react';
import { motion } from 'motion/react';
import {
  FaEnvelope,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaTwitter,
} from 'react-icons/fa';
import { pageVariants, springJuicy } from '../lib/motion';

export const Route = createFileRoute('/contact')({
  component: ContactPage,
});

function ContactPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial='initial'
      animate='animate'
      exit='exit'
      className='container mx-auto px-4 pt-32 pb-20 min-h-screen'
    >
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-20 items-start'>
        <div className='max-w-xl'>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className='text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter uppercase'
          >
            Get in <span className='text-accent italic'>Touch</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className='text-xl text-foreground/70 mb-12 leading-relaxed text-pretty'
          >
            Have a project in mind or just want to chat about art and technology? I'm always open to
            new opportunities and creative collaborations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='space-y-8'
          >
            <div className='flex items-center gap-6 group'>
              <div className='w-14 h-14 bg-surface border border-border rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-accent-contrast transition-all duration-300 shadow-sm'>
                <FaEnvelope className='text-xl' />
              </div>
              <div>
                <p className='text-sm text-foreground/40 uppercase tracking-widest font-bold'>
                  Email
                </p>
                <a
                  href='mailto:hello@wisihe.com'
                  className='text-xl font-medium hover:text-accent transition-colors'
                >
                  hello@wisihe.com
                </a>
              </div>
            </div>

            <div className='flex items-center gap-6 group'>
              <div className='w-14 h-14 bg-surface border border-border rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-accent-contrast transition-all duration-300 shadow-sm'>
                <FaMapMarkerAlt className='text-xl' />
              </div>
              <div>
                <p className='text-sm text-foreground/40 uppercase tracking-widest font-bold'>
                  Location
                </p>
                <p className='text-xl font-medium'>Oslo, Norway</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className='mt-16'
          >
            <p className='text-sm text-foreground/40 uppercase tracking-widest font-bold mb-6'>
              Follow the journey
            </p>
            <div className='flex gap-4'>
              {[
                { icon: <FaGithub />, href: 'https://github.com/wisihe' },
                { icon: <FaLinkedin />, href: 'https://linkedin.com/in/henrik-sissener' },
                { icon: <FaInstagram />, href: 'https://instagram.com/wisihe' },
                { icon: <FaTwitter />, href: 'https://twitter.com/wisihe' },
              ].map(social => (
                <motion.a
                  key={social.href}
                  href={social.href}
                  target='_blank'
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className='w-12 h-12 bg-surface border border-border rounded-xl flex items-center justify-center text-foreground/60 hover:text-accent hover:border-accent/50 transition-all shadow-sm'
                >
                  <span className='text-xl'>{social.icon}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className='bg-surface border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden'
        >
          <div className='absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] -mr-32 -mt-32 rounded-full' />

          <form className='relative z-10 space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <label className='text-sm font-bold uppercase tracking-wider text-foreground/60 ml-1'>
                  Name
                </label>
                <Input
                  placeholder='Henrik Sissener'
                  className='bg-background/50 border-border/50 focus:border-accent transition-all h-14'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-bold uppercase tracking-wider text-foreground/60 ml-1'>
                  Email
                </label>
                <Input
                  type='email'
                  placeholder='your@email.com'
                  className='bg-background/50 border-border/50 focus:border-accent transition-all h-14'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-bold uppercase tracking-wider text-foreground/60 ml-1'>
                Subject
              </label>
              <Input
                placeholder='How can I help?'
                className='bg-background/50 border-border/50 focus:border-accent transition-all h-14'
              />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-bold uppercase tracking-wider text-foreground/60 ml-1'>
                Message
              </label>
              <Textarea
                placeholder='Tell me about your project...'
                rows={6}
                className='bg-background/50 border-border/50 focus:border-accent transition-all min-h-[150px] resize-none'
              />
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type='button'
                className='w-full h-16 bg-accent text-accent-contrast font-bold text-lg uppercase tracking-widest rounded-2xl shadow-lg hover:shadow-accent/40 transition-all'
              >
                Send Message
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
