import type { Metadata } from 'next';
import { ThreeDeprecationGuard } from '../components/three-d/ThreeDeprecationGuard';

export const metadata: Metadata = {
  title: '3D Graphics Lab: WebGPU vs WebGL Benchmark | WiSiHe',
  description:
    'Interactive 3D laboratory benchmarking next-generation Three.js WebGPU compute shaders against legacy WebGL rendering. Real-time stress testing with up to 1,000,000 particles.',
  keywords: [
    'WebGPU',
    'WebGL',
    'Three.js',
    'Three.js WebGPU',
    'React Three Fiber',
    'Compute Shaders',
    'TSL',
    'Three Shading Language',
    'WGSL',
    '3D Graphics Benchmark',
    'Frontend Performance',
  ],
  authors: [{ name: 'Henrik Wilhelm Sissener' }],
  creator: 'Henrik Wilhelm Sissener',
  publisher: 'WiSiHe',
  alternates: {
    canonical: 'https://www.wisihe.no/three-d',
  },
  openGraph: {
    title: '3D Graphics Lab: WebGPU vs WebGL Benchmark | WiSiHe',
    description:
      'Compare modern Three.js WebGPU compute pipelines against traditional WebGL rendering with real-time performance telemetry and interactive particle simulation.',
    type: 'website',
    url: 'https://www.wisihe.no/three-d',
    siteName: 'WiSiHe',
    locale: 'en_US',
    images: [
      {
        url: 'https://www.wisihe.no/images/hell.jpg',
        width: 1200,
        height: 630,
        alt: '3D Graphics Lab: WebGPU vs WebGL Benchmark',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '3D Graphics Lab: WebGPU vs WebGL Benchmark | WiSiHe',
    description:
      'Benchmark modern Three.js WebGPU compute pipelines against traditional WebGL rendering.',
    creator: '@wisihe',
    site: '@wisihe',
    images: ['https://www.wisihe.no/images/hell.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ThreeDLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThreeDeprecationGuard />
      {children}
    </>
  );
}
