import { Metadata } from 'next';
import { Suspense } from 'react';
import ScrollToTopButton from '../components/ScrollToTop/ScrollToTop';
import InteractiveGlobe from '../components/InteractiveGlobe';
import Empty3DExample from '../components/Empty3DExample';

export const metadata: Metadata = {
  title: 'Interactive Art & 3D Experiences',
  description:
    'Explore my collection of interactive 3D artwork, immersive experiences, and digital sculptures. Discover engaging visual stories and creative interactive designs.',
  alternates: {
    canonical: 'https://www.wisihe.no/interactive',
  },
  openGraph: {
    title: 'Interactive Art & 3D Experiences',
    description:
      'Explore my collection of interactive 3D artwork, immersive experiences, and digital sculptures. Discover engaging visual stories and creative interactive designs.',
    url: 'https://www.wisihe.no/interactive',
    siteName: 'WiSiHe',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://www.wisihe.no/images/hell.jpg',
        width: 1200,
        height: 630,
        alt: "Interactive art gallery showcasing WiSiHe's creative 3D designs and immersive experiences",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interactive Art & 3D Experiences',
    description:
      'Explore my collection of interactive 3D artwork, immersive experiences, and digital sculptures. Discover engaging visual stories and creative interactive designs.',
    images: ['https://www.wisihe.no/images/hell.jpg'],
  },
};

// Loading skeleton component
const InteractiveSkeleton = () => (
  <div className="flex items-center justify-center w-full h-96 bg-surface-elevated animate-pulse rounded-2xl">
    <div className="text-center">
      <div className="w-16 h-16 bg-surface rounded-full mx-auto mb-4 animate-pulse" />
      <div className="h-4 bg-surface rounded w-32 mx-auto mb-2" />
      <div className="h-3 bg-surface rounded w-24 mx-auto" />
    </div>
  </div>
);

// Interactive Hero Section Component
const InteractiveHeroSection = () => (
  <div className="relative flex flex-col items-center justify-center min-h-[60vh] w-full px-4 py-20 bg-gradient-to-br from-accent/10 via-surface to-accent-warm/5">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-accent via-accent-warm to-accent-cool bg-clip-text text-transparent">
        Interactive Art & 3D Experiences
      </h1>
      <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
        Step into a world of three-dimensional creativity where digital art meets interactive
        storytelling. Explore immersive visual experiences and discover the intersection of
        technology and artistic expression.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <div className="px-6 py-3 bg-accent text-on-primary rounded-full font-medium hover:bg-accent-dark transition-colors">
          Explore Gallery
        </div>
        <div className="px-6 py-3 border border-border text-text-primary rounded-full font-medium hover:bg-surface-elevated transition-colors">
          View Projects
        </div>
      </div>
    </div>

    {/* Decorative 3D elements */}
    <div className="absolute top-20 left-10 w-20 h-20 bg-accent/20 rounded-full blur-xl animate-pulse" />
    <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent-warm/20 rounded-full blur-xl animate-pulse delay-1000" />
    <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent-cool/20 rounded-full blur-lg animate-pulse delay-500" />
  </div>
);

// Interactive Globe Section
const InteractiveGlobeSection = () => (
  <section className="py-20 px-4 bg-surface flex flex-col gap-8">
    <div className="max-w-prose">
      <h2 className="text-3xl md:text-4xl font-bold">Interactive Earth Globe</h2>
      <p className="text-text-secondary">
        Explore our beautiful planet with an interactive 3D Earth globe. Click on cities around the
        world to zoom in and discover connections between locations.
      </p>
    </div>

    <InteractiveGlobe className="w-full h-full" />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Earth Globe Feature */}
      <div className="group relative overflow-hidden bg-gradient-to-br from-surface-elevated to-surface rounded-2xl p-8 border border-border/50 hover:border-accent/30 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <span className="text-3xl group-hover:animate-pulse">🌍</span>
          </div>
          <h3 className="font-bold text-lg mb-3 text-text-primary group-hover:text-accent transition-colors duration-300">
            Earth Globe
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            Realistic Earth representation with NASA textures, atmospheric glow, and dynamic
            lighting effects
          </p>
        </div>
      </div>

      {/* Interactive Controls Feature */}
      <div className="group relative overflow-hidden bg-gradient-to-br from-surface-elevated to-surface rounded-2xl p-8 border border-border/50 hover:border-accent-warm/30 transition-all duration-300 hover:shadow-xl hover:shadow-accent-warm/10 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-warm/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-accent-warm/20 to-accent-warm/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <span className="text-3xl group-hover:animate-bounce">🎮</span>
          </div>
          <h3 className="font-bold text-lg mb-3 text-text-primary group-hover:text-accent-warm transition-colors duration-300">
            Interactive Controls
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            Smooth orbit controls with auto-rotation, responsive zoom, and camera animations
          </p>
        </div>
      </div>

      {/* Global Cities Feature */}
      <div className="group relative overflow-hidden bg-gradient-to-br from-surface-elevated to-surface rounded-2xl p-8 border border-border/50 hover:border-accent-cool/30 transition-all duration-300 hover:shadow-xl hover:shadow-accent-cool/10 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-cool/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-accent-cool/20 to-accent-cool/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <span className="text-3xl group-hover:animate-pulse">🌐</span>
          </div>
          <h3 className="font-bold text-lg mb-3 text-text-primary group-hover:text-accent-cool transition-colors duration-300">
            Global Cities
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            Interactive city markers with animated connections, hover effects, and detailed
            information
          </p>
        </div>
      </div>
    </div>
  </section>
);

// Interactive Features Section
const InteractiveFeaturesSection = () => (
  <section className="py-20 px-4 bg-gradient-to-b from-surface to-surface-elevated">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Interactive Features</h2>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Experience 3D art through interactive elements and immersive technologies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-accent text-xl">🎮</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Interactive Controls</h3>
              <p className="text-text-secondary">
                Navigate and explore 3D scenes with intuitive mouse and touch controls.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-accent-warm/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-accent-warm text-xl">🔍</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">360° Viewing</h3>
              <p className="text-text-secondary">
                Rotate and zoom around 3D models to see every detail from every angle.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-accent-cool/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-accent-cool text-xl">✨</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Dynamic Lighting</h3>
              <p className="text-text-secondary">
                Experience realistic lighting and shadows that bring 3D art to life.
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-square bg-gradient-to-br from-accent/10 via-accent-warm/10 to-accent-cool/10 rounded-2xl flex items-center justify-center">
            <div className="text-6xl animate-bounce">🎯</div>
          </div>
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent rounded-full animate-ping" />
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-accent-warm rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  </section>
);

// Empty 3D Example Section
const Empty3DExampleSection = () => (
  <section className="py-20 px-4 bg-surface-elevated flex flex-col gap-8">
    <Empty3DExample />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Animated Objects Feature */}
      <div className="group relative overflow-hidden bg-gradient-to-br from-surface to-surface-elevated rounded-2xl p-8 border border-border/50 hover:border-accent/30 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <span className="text-3xl group-hover:animate-pulse">🎲</span>
          </div>
          <h3 className="font-bold text-lg mb-3 text-text-primary group-hover:text-accent transition-colors duration-300">
            Animated Objects
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            Rotating cube and sphere with smooth animations and floating effects
          </p>
        </div>
      </div>

      {/* Particle System Feature */}
      <div className="group relative overflow-hidden bg-gradient-to-br from-surface to-surface-elevated rounded-2xl p-8 border border-border/50 hover:border-accent-warm/30 transition-all duration-300 hover:shadow-xl hover:shadow-accent-warm/10 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-warm/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-accent-warm/20 to-accent-warm/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <span className="text-3xl group-hover:animate-bounce">✨</span>
          </div>
          <h3 className="font-bold text-lg mb-3 text-text-primary group-hover:text-accent-warm transition-colors duration-300">
            Particle System
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            Floating particles in a circular pattern with smooth rotation animation
          </p>
        </div>
      </div>

      {/* Interactive Controls Feature */}
      <div className="group relative overflow-hidden bg-gradient-to-br from-surface to-surface-elevated rounded-2xl p-8 border border-border/50 hover:border-accent-cool/30 transition-all duration-300 hover:shadow-xl hover:shadow-accent-cool/10 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-cool/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-accent-cool/20 to-accent-cool/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <span className="text-3xl group-hover:animate-pulse">🎮</span>
          </div>
          <h3 className="font-bold text-lg mb-3 text-text-primary group-hover:text-accent-cool transition-colors duration-300">
            Interactive Controls
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            Full orbit controls with zoom, pan, and rotation for complete 3D navigation
          </p>
        </div>
      </div>
    </div>
  </section>
);

// Technology Stack Section
const TechnologyStackSection = () => (
  <section className="py-20 px-4 bg-surface">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">3D Technologies</h2>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Built with modern 3D technologies and web standards for optimal performance and
          compatibility.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { name: 'Three.js', icon: '📐', description: '3D Graphics Library' },
          { name: 'WebGL', icon: '🌐', description: 'Hardware Acceleration' },
          { name: 'Blender', icon: '🎨', description: '3D Modeling' },
          { name: 'React Three Fiber', icon: '⚛️', description: 'React Integration' },
        ].map((tech, index) => (
          <div key={index} className="text-center group">
            <div className="w-16 h-16 bg-surface-elevated rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/10 transition-colors">
              <span className="text-2xl">{tech.icon}</span>
            </div>
            <h3 className="font-semibold mb-1">{tech.name}</h3>
            <p className="text-text-secondary text-sm">{tech.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default function InteractivePage() {
  return (
    <>
      <div className="bg-background">
        <Suspense fallback={<InteractiveSkeleton />}>
          <InteractiveHeroSection />
        </Suspense>

        <Suspense fallback={<InteractiveSkeleton />}>
          <InteractiveGlobeSection />
        </Suspense>

        <Suspense fallback={<InteractiveSkeleton />}>
          <Empty3DExampleSection />
        </Suspense>

        <Suspense fallback={<InteractiveSkeleton />}>
          <InteractiveFeaturesSection />
        </Suspense>

        <Suspense fallback={<InteractiveSkeleton />}>
          <TechnologyStackSection />
        </Suspense>
      </div>
      <ScrollToTopButton />
    </>
  );
}
