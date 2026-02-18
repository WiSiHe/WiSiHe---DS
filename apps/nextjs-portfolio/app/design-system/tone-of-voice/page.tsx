'use client';

import { motion } from 'motion/react';
import { FaCheck, FaTimes } from 'react-icons/fa';

const principles = [
  {
    title: 'Clarity over Cleverness',
    description: 'We prioritize understanding. Our language should be accessible to everyone, regardless of their technical background.',
    do: 'Use plain language and direct statements.',
    dont: 'Use metaphors or jargon that might confuse the user.',
  },
  {
    title: 'Confident, not Arrogant',
    description: 'We trust our work to speak for itself. We state facts without needing to embellish them with superlatives.',
    do: '“This framework improves performance by 20%.”',
    dont: '“This is the most revolutionary, world-class framework ever built.”',
  },
  {
    title: 'Warm but Professional',
    description: 'We are human, but we are also efficient. We avoid being robotic, but we also respect the user’s time.',
    do: '“Please check your connection and try again.”',
    dont: '“Whoops! Looks like the internet gremlins ate your data!”',
  },
];

const examples = [
  {
    label: 'Success Message',
    good: 'Profile updated.',
    bad: 'Your profile has been successfully revamped to perfection!',
  },
  {
    label: 'Error Message',
    good: 'Could not save changes. Please try again.',
    bad: 'Oh no! Something went wrong on our end. We are so sorry!',
  },
  {
    label: 'Feature Description',
    good: 'Dark mode reduces eye strain in low-light environments.',
    bad: 'Experience the stunning, immersive beauty of our game-changing Dark Mode.',
  },
];

export default function ToneOfVoicePage() {
  return (
    <div className="min-h-screen bg-transparent py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-foreground mb-4">
            Tone of <span className="text-accent underline decoration-accent/20">Voice</span>
          </h1>
          <p className="text-lg text-foreground-subtle max-w-2xl leading-relaxed">
            We write as we design: honestly and efficiently. Our voice is Scandinavian at heart—direct, 
            functional, and free from unnecessary embellishment.
          </p>
        </motion.div>

        <section className="mb-20">
          <h2 className="text-2xl font-bold text-foreground mb-8 pb-2 border-b border-border">Core Principles</h2>
          <div className="grid grid-cols-1 gap-6">
            {principles.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface border border-border rounded-lg p-6 md:p-8"
              >
                <h3 className="text-xl font-bold text-foreground mb-3">{p.title}</h3>
                <p className="text-foreground-subtle mb-8 max-w-2xl leading-relaxed">
                  {p.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-3 items-start">
                    <div className="mt-1 flex-none bg-success/10 text-success rounded-full p-1">
                      <FaCheck size={10} />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted block mb-1">Do</span>
                      <p className="text-foreground">{p.do}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="mt-1 flex-none bg-danger/10 text-danger rounded-full p-1">
                      <FaTimes size={10} />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted block mb-1">Don't</span>
                      <p className="text-foreground-subtle line-through opacity-70">{p.dont}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-8 pb-2 border-b border-border">Practical Examples</h2>
          <div className="grid grid-cols-1 gap-4">
             {examples.map((ex, i) => (
                <div key={ex.label} className="bg-surface/50 border border-border/50 rounded-lg p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                   <div className="w-40 flex-none text-sm font-mono text-foreground-muted uppercase tracking-wider">
                     {ex.label}
                   </div>
                   <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-foreground flex items-center gap-2">
                         <FaCheck className="text-success w-3 h-3 flex-none" />
                         <span>{ex.good}</span>
                      </div>
                      <div className="text-foreground-subtle line-through opacity-60 flex items-center gap-2">
                         <FaTimes className="text-danger w-3 h-3 flex-none" />
                         <span>{ex.bad}</span>
                      </div>
                   </div>
                </div>
             ))}
          </div>
        </section>
      </div>
    </div>
  );
}
