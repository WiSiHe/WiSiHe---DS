'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from '../ProgressLink';
import { FaCube, FaArrowRight } from 'react-icons/fa';

const ThreeDShowcase = () => {
  return (
    <div className="relative w-full overflow-hidden bg-surface-elevated py-24">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 blur-[120px] rounded-full -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 blur-[100px] rounded-full -ml-48 -mb-48" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Visual Side */}
          <div className="flex-1 relative group">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring" as const, stiffness: 100, damping: 15 }}
              className="relative aspect-square max-w-md mx-auto z-10"
            >
              <div className="absolute inset-0 bg-accent rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative h-full w-full rounded-3xl overflow-hidden border border-border/30 shadow-2xl">
                <Image
                  src="https://w.wallhaven.cc/full/yj/wallhaven-yjmmvx.jpg"
                  alt="3D Tokyo Scene"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 p-4 bg-surface rounded-2xl shadow-xl border border-border/30 z-20"
              >
                <FaCube className="text-accent text-3xl" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -left-6 p-4 bg-surface rounded-2xl shadow-xl border border-border/30 z-20"
              >
                <div className="text-xs font-bold text-foreground/50 uppercase tracking-tighter">Rendered in</div>
                <div className="text-sm font-bold text-accent">Blender 4.2</div>
              </motion.div>
            </motion.div>
          </div>

          {/* Content Side */}
          <div className="flex-1 flex flex-col items-start gap-8">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-accent font-bold tracking-widest uppercase text-sm">
                <span className="w-8 h-[2px] bg-accent" />
                New Dimension
              </div>
              <h2 className="text-4xl md:text-6xl font-black leading-tight">
                Exploring <br />
                <span className="text-accent">3D Environments</span>
              </h2>
              <p className="text-lg text-foreground/60 max-w-lg">
                I push the boundaries of digital art by creating immersive 3D worlds, high-fidelity models, and interactive real-time experiences.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href="/three-d"
                className="group relative flex items-center gap-4 px-8 py-4 bg-foreground text-background rounded-full font-bold overflow-hidden shadow-xl hover:shadow-accent/20 transition-all"
              >
                <span className="relative z-10">Explore 3D Work</span>
                <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-accent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDShowcase;
