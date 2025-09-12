import { Metadata } from 'next';
import { Suspense } from 'react';
import ScrollToTopButton from '../components/ScrollToTop/ScrollToTop';

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

// Interactive Gallery Section
const InteractiveGallerySection = () => (
  <section className="py-20 px-4 bg-surface">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Interactive Works</h2>
        <p className="text-text-secondary max-w-2xl mx-auto">
          A curated selection of my interactive 3D artwork, immersive experiences, and digital
          sculptures.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Interactive Art Cards */}
        {[1, 2, 3, 4, 5, 6].map(item => (
          <div
            key={item}
            className="group relative bg-surface-elevated rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="aspect-square bg-gradient-to-br from-accent/20 to-accent-warm/20 flex items-center justify-center">
              <div className="text-4xl">🎨</div>
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-2">Interactive Artwork {item}</h3>
              <p className="text-text-secondary text-sm mb-4">
                Interactive 3D experience showcasing creative design and technical innovation.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full">
                  3D Modeling
                </span>
                <span className="px-3 py-1 bg-accent-warm/10 text-accent-warm text-xs rounded-full">
                  Interactive
                </span>
              </div>
            </div>
          </div>
        ))}
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
          <InteractiveGallerySection />
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
