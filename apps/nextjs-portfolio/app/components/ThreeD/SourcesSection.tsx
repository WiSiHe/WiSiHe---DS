'use client';

import { motion } from 'motion/react';
import { GridBackground } from './GridBackground';

export function SourcesSection() {
  const splineWorkshop = {
    title: 'Spline Workshop: Build an Interactive Rocketship',
    description: 'Learn how to build an interactive rocketship and publish it online in less than 40 minutes. Perfect for people who don\'t necessarily want to learn Three.js.',
    url: 'https://thenorthalliance.notion.site/Spline-Workshop-1b2cf2f6604a8079876bd7b025269ed5',
  };

  const workshops = [
    {
      title: 'Awwwards Conference',
      url: 'https://www.awwwards.com/conference',
    },
    {
      title: 'Three.js Journey',
      url: 'https://threejs-journey.com/',
      description: 'Comprehensive Three.js course by Bruno Simon',
    },
  ];

  const tools = [
    {
      title: 'Blender',
      url: 'https://www.blender.org/',
      description: 'Free and open-source 3D creation suite',
    },
    {
      title: 'Spline',
      url: 'https://spline.design/',
      description: 'Web-based 3D design tool',
    },
    {
      title: 'Three.js',
      url: 'https://threejs.org/',
      description: 'JavaScript 3D library',
    },
    {
      title: 'React Three Fiber',
      url: 'https://docs.pmnd.rs/react-three-fiber',
      description: 'React renderer for Three.js',
    },
    {
      title: '@react-three/drei',
      url: 'https://github.com/pmndrs/drei',
      description: 'Useful helpers for React Three Fiber',
    },
  ];

  const sources = [
    {
      title: 'Shopify - 3D Ecommerce Blog',
      url: 'https://www.shopify.com/blog/3d-ecommerce',
    },
    {
      title: 'Threekit - ROI of 3D and AR',
      url: 'https://www.threekit.com/guide-to-roi-in-3d-and-augmented-reality',
    },
    {
      title: 'BigCommerce - 3D Visualization',
      url: 'https://www.bigcommerce.com/blog/3d-visualization/',
    },
    {
      title: 'Virsabi - Increase conversions with 94%',
      url: 'https://virsabi.com/increase-conversions-in-online-shops-with-94/',
    },
    {
      title: 'Bruno Simon Portfolio',
      url: 'https://bruno-simon.com/',
    },
    {
      title: 'IKEA Place - AR Furniture',
      url: 'https://www.ikea.com/us/en/customer-service/mobile-apps/ikea-place/',
    },
  ];

  return (
    <section className="snap-start h-screen w-full flex flex-col items-center justify-center pt-28 md:pt-32 lg:pt-36 relative overflow-hidden bg-background shrink-0">
      <GridBackground />

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 overflow-y-auto max-h-full">
        <div className="space-y-12 py-12">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground uppercase tracking-tight">
              Sources & Resources
            </h2>
            <p className="text-xl md:text-2xl text-foreground/60 max-w-3xl mx-auto">
              Everything you need to dive deeper into 3D on the web
            </p>
          </motion.div>

          {/* Spline Workshop - Prominent Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-surface-elevated border-4 border-accent/50 rounded-2xl p-8 md:p-12 shadow-2xl shadow-accent/20"
          >
            <div className="flex items-start justify-between gap-6 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-3 w-3 rounded-full bg-accent animate-pulse" />
                  <span className="text-sm font-mono text-accent uppercase tracking-wider font-semibold">
                    Featured Workshop
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-foreground mb-3">
                  {splineWorkshop.title}
                </h3>
                <p className="text-lg text-foreground/70 mb-6 leading-relaxed">
                  {splineWorkshop.description}
                </p>
              </div>
            </div>
            <motion.a
              href={splineWorkshop.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-accent-foreground rounded-xl font-bold text-lg hover:opacity-90 shadow-lg shadow-accent/30 transition-all"
            >
              <span>View Workshop</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </motion.a>
          </motion.div>

          {/* Workshops Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tight">
              Workshops & Courses
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workshops.map((workshop, index) => (
                <motion.a
                  key={workshop.title}
                  href={workshop.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 bg-surface-elevated border-2 border-border rounded-xl hover:border-accent/50 transition-all group"
                >
                  <h4 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {workshop.title}
                  </h4>
                  {workshop.description && (
                    <p className="text-sm text-foreground/60">{workshop.description}</p>
                  )}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Tools Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tight">
              Tools & Libraries
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((tool, index) => (
                <motion.a
                  key={tool.title}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-5 bg-surface-elevated border-2 border-border rounded-xl hover:border-accent/50 transition-all group"
                >
                  <h4 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {tool.title}
                  </h4>
                  <p className="text-sm text-foreground/60">{tool.description}</p>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Sources Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tight">
              Sources & References
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sources.map((source, index) => (
                <motion.a
                  key={source.title}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="p-4 bg-surface border border-border rounded-lg hover:border-accent/50 hover:bg-surface-elevated transition-all group flex items-center gap-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 text-foreground/40 group-hover:text-accent transition-colors shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                  <span className="text-foreground/80 group-hover:text-foreground transition-colors">
                    {source.title}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
