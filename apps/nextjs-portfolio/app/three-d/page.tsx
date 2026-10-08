import {
  type Icon,
  IconArrowRight,
  IconBolt,
  IconBook,
  IconBox,
  IconBrandThreejs,
  IconCpu,
  IconCube,
  IconDatabase,
  IconDeviceDesktopAnalytics,
  IconExternalLink,
  IconFlame,
  IconLayersLinked,
  IconPresentation,
  IconRocket,
  IconScale,
  IconSparkles,
} from '@tabler/icons-react';
import Breadcrumbs from '@/app/components/layout/Breadcrumbs/Breadcrumbs';
import { Link } from '@/app/components/layout/ProgressLink';
import ScrollToTopButton from '@/app/components/layout/ScrollToTop/ScrollToTop';

interface ToolItem {
  name: string;
  tag: string;
  url: string;
  description: string;
}

interface ToolCategory {
  title: string;
  icon: Icon;
  description: string;
  tools: ToolItem[];
}

const TOOL_CATEGORIES: ToolCategory[] = [
  {
    title: '3D Design & Modeling',
    icon: IconCube,
    description: 'Tools for visual design, spatial modeling, and interactive assets.',
    tools: [
      {
        name: 'Spline',
        tag: 'Browser-Based 3D',
        url: 'https://spline.design',
        description:
          'Collaborative web-first 3D design, real-time materials, physics, and direct React/web embed runtimes.',
      },
      {
        name: 'Blender',
        tag: 'Open-Source DCC',
        url: 'https://www.blender.org',
        description:
          'The industry standard for polygonal modeling, sculpting, UV unwrapping, texture baking, and glTF export pipelines.',
      },
    ],
  },
  {
    title: 'Web 3D Runtimes & Shaders',
    icon: IconBrandThreejs,
    description: 'Core rendering engines and component architectures for frontend web.',
    tools: [
      {
        name: 'Three.js & WebGPU',
        tag: 'Core Graphics Engine',
        url: 'https://threejs.org',
        description:
          'The foundation of web 3D graphics, featuring the next-gen WebGPURenderer and Three Shading Language (TSL).',
      },
      {
        name: 'React Three Fiber (R3F)',
        tag: 'React Renderer',
        url: 'https://docs.pmnd.rs/react-three-fiber',
        description:
          'Declarative, component-driven React renderer for Three.js with full reactive state and lifecycles.',
      },
      {
        name: '@react-three/drei',
        tag: 'Helper Toolbelt',
        url: 'https://github.com/pmndrs/drei',
        description:
          'Battle-tested utilities for R3F: camera controllers, HDR lighting, shader abstractions, and loaders.',
      },
    ],
  },
  {
    title: 'Asset Compression & Delivery',
    icon: IconBox,
    description: 'Compression tools and formats that minimize network transfer overhead.',
    tools: [
      {
        name: 'Google Draco & Meshopt',
        tag: 'Geometry Compression',
        url: 'https://google.github.io/draco',
        description:
          'Advanced vertex and index quantization algorithms that shrink 3D mesh payloads by up to 85%.',
      },
      {
        name: 'KTX2 & Basis Universal',
        tag: 'GPU Textures',
        url: 'https://www.khronos.org/ktx',
        description:
          'Supercompressed GPU texture containers that decode directly into VRAM without CPU unzipping.',
      },
      {
        name: 'glTF-Transform',
        tag: 'Pipeline Optimization',
        url: 'https://gltf-transform.dev',
        description:
          'Command-line pipeline tool to deduplicate materials, resample animations, quantize, and optimize 3D assets.',
      },
    ],
  },
  {
    title: 'Curricula & Mathematical Reference',
    icon: IconBook,
    description: 'Curated courses and mathematical foundations for shader craft.',
    tools: [
      {
        name: 'Three.js Journey (Bruno Simon)',
        tag: 'Interactive Course',
        url: 'https://threejs-journey.com',
        description:
          'The premier curriculum for mastering Three.js, custom shaders, physics, Blender workflows, and performance.',
      },
      {
        name: 'The Book of Shaders',
        tag: 'Fragment Shaders',
        url: 'https://thebookofshaders.com',
        description:
          'Essential step-by-step guide through the mathematical world of fragment shaders by Patricio Gonzalez Vivo.',
      },
      {
        name: 'Inigo Quilez Articles',
        tag: 'Math & SDF Reference',
        url: 'https://iquilezles.org',
        description:
          'Gold-standard mathematical references for Signed Distance Functions (SDFs), raymarching, and procedural noise.',
      },
    ],
  },
];

export default function ThreeDLabPage() {
  return (
    <div className='min-h-screen bg-background text-foreground transition-colors duration-300'>
      {/* Hero Header matching presentations & projects pages */}
      <header className='relative overflow-hidden border-b border-border/40 pt-28 pb-16 sm:pt-32'>
        <div className='pointer-events-none absolute inset-0 bg-accent/5' aria-hidden />
        <div
          className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.04)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_25%,transparent_100%)]'
          aria-hidden
        />

        <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-6'>
            <Breadcrumbs crumbs={[{ label: 'Home', href: '/' }, { label: '3D Graphics Lab' }]} />
          </div>

          <p className='font-mono text-xs font-semibold uppercase tracking-[0.28em] text-accent'>
            Laboratory & GPU Computing
          </p>

          <h1 className='mt-3 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl'>
            3D Graphics Lab
          </h1>

          <p className='mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-foreground-subtle text-pretty'>
            Real-time 3D web craft and graphics benchmarks. Comparing next-generation Three.js
            WebGPU compute pipelines against traditional WebGL rendering across high-throughput
            particle simulations, procedural shaders, and modern tooling.
          </p>

          {/* Technology Badges */}
          <div className='mt-6 flex flex-wrap items-center gap-2'>
            <span className='inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-surface px-3 py-1 text-xs font-mono font-medium text-foreground-muted shadow-xs'>
              <IconBrandThreejs className='size-3.5 text-accent' />
              Three.js r184
            </span>
            <span className='inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-mono font-semibold text-accent shadow-xs'>
              <IconSparkles className='size-3.5' />
              WebGPU WGSL Compute
            </span>
            <span className='inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-xs font-mono font-semibold text-warning shadow-xs'>
              <IconCpu className='size-3.5' />
              WebGL 2.0 (GLSL)
            </span>
            <span className='inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-surface px-3 py-1 text-xs font-mono font-medium text-foreground-muted shadow-xs'>
              Spline & Blender
            </span>
            <span className='inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-surface px-3 py-1 text-xs font-mono font-medium text-foreground-muted shadow-xs'>
              React Three Fiber v9
            </span>
            <span className='inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-surface px-3 py-1 text-xs font-mono font-medium text-foreground-muted shadow-xs'>
              TSL Node Materials
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16 space-y-16'>
        {/* Section 1: Dual Benchmark Suite */}
        <section aria-labelledby='benchmark-suite-heading' className='space-y-6'>
          <div className='max-w-2xl'>
            <p className='font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent'>
              Performance Benchmark Suite
            </p>
            <h2
              id='benchmark-suite-heading'
              className='mt-2 font-serif text-2xl sm:text-3xl font-bold text-foreground'
            >
              Interactive Fluid Orb Stress Test
            </h2>
            <p className='mt-2 text-sm leading-relaxed text-foreground-subtle text-pretty'>
              Stress-test your hardware with a real-time fluid particle simulation scaling up to
              1,000,000 particles. Observe the architectural performance gap between native GPU
              compute workgroups and traditional draw pipelines.
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* WebGPU Card (The New) */}
            <article className='group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/50 bg-surface p-7 sm:p-8 transition-all duration-300 hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/5 hover:-translate-y-1'>
              <div className='space-y-5'>
                {/* Visual Header Graphic */}
                <div className='relative h-32 w-full overflow-hidden rounded-xl border border-accent/20 bg-gradient-to-br from-accent/15 via-surface-raised to-surface p-4 flex flex-col justify-between'>
                  <div className='pointer-events-none absolute -right-6 -bottom-6 size-32 rounded-full bg-accent/10 blur-2xl' />
                  <div className='flex items-center justify-between'>
                    <span className='inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-2.5 py-1 text-[11px] font-mono font-semibold text-accent'>
                      <IconSparkles className='size-3.5' />
                      Next-Gen Compute
                    </span>
                    <span className='font-mono text-[11px] text-accent/70'>WGSL Pipelines</span>
                  </div>

                  <div className='flex items-baseline justify-between'>
                    <div>
                      <div className='font-mono text-2xl font-bold text-foreground'>1,000,000</div>
                      <div className='font-mono text-[10px] uppercase text-foreground-muted'>
                        Simulated Particles
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='font-mono text-xl font-bold text-success'>60 FPS</div>
                      <div className='font-mono text-[10px] uppercase text-foreground-muted'>
                        Sustained VRAM
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className='font-serif text-2xl font-bold text-foreground transition-colors group-hover:text-accent'>
                    Three.js WebGPU (The New)
                  </h3>
                  <p className='mt-2 text-sm leading-relaxed text-foreground-subtle text-pretty'>
                    Dispatches GPU compute workgroups in parallel using WGSL and Storage Buffers.
                    Positions, velocities, and fluid viscosity updates occur entirely within
                    high-speed VRAM with zero CPU-to-GPU PCIe memory transfers.
                  </p>
                </div>

                <ul className='space-y-2.5 pt-1 font-mono text-xs text-foreground-subtle'>
                  <li className='flex items-center gap-2.5'>
                    <IconBolt className='size-4 text-accent shrink-0' />
                    <span>Parallel GPU compute workgroups (64–128 threads/group)</span>
                  </li>
                  <li className='flex items-center gap-2.5'>
                    <IconDatabase className='size-4 text-accent shrink-0' />
                    <span>Storage Buffers in VRAM (0 bytes PCIe bus bandwidth)</span>
                  </li>
                  <li className='flex items-center gap-2.5'>
                    <IconDeviceDesktopAnalytics className='size-4 text-accent shrink-0' />
                    <span>Stateful fluid physics with true inertia & momentum</span>
                  </li>
                  <li className='flex items-center gap-2.5'>
                    <IconSparkles className='size-4 text-accent shrink-0' />
                    <span>Effortlessly scales to 1,000,000 particles at 60 FPS</span>
                  </li>
                </ul>
              </div>

              <div className='mt-8 pt-6 border-t border-border/40'>
                <Link
                  href='/three-d/webgpu'
                  className='inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent text-accent-foreground hover:opacity-90 px-5 py-3 text-sm font-semibold shadow-md transition-all active:scale-[0.98]'
                >
                  <span>Launch WebGPU Benchmark</span>
                  <IconArrowRight className='size-4' />
                </Link>
              </div>
            </article>

            {/* WebGL Card (The Old) */}
            <article className='group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/50 bg-surface p-7 sm:p-8 transition-all duration-300 hover:border-warning/50 hover:shadow-2xl hover:shadow-warning/5 hover:-translate-y-1'>
              <div className='space-y-5'>
                {/* Visual Header Graphic */}
                <div className='relative h-32 w-full overflow-hidden rounded-xl border border-warning/20 bg-gradient-to-br from-warning/15 via-surface-raised to-surface p-4 flex flex-col justify-between'>
                  <div className='pointer-events-none absolute -right-6 -bottom-6 size-32 rounded-full bg-warning/10 blur-2xl' />
                  <div className='flex items-center justify-between'>
                    <span className='inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning/15 px-2.5 py-1 text-[11px] font-mono font-semibold text-warning'>
                      <IconCpu className='size-3.5' />
                      Legacy Rasterization
                    </span>
                    <span className='font-mono text-[11px] text-warning/70'>OpenGL ES 3.0</span>
                  </div>

                  <div className='flex items-baseline justify-between'>
                    <div>
                      <div className='font-mono text-2xl font-bold text-foreground'>GLSL 2.0</div>
                      <div className='font-mono text-[10px] uppercase text-foreground-muted'>
                        Draw Pipeline
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='font-mono text-xl font-bold text-warning'>Universal</div>
                      <div className='font-mono text-[10px] uppercase text-foreground-muted'>
                        Global Compatibility
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className='font-serif text-2xl font-bold text-foreground transition-colors group-hover:text-warning'>
                    Three.js WebGL (The Old)
                  </h3>
                  <p className='mt-2 text-sm leading-relaxed text-foreground-subtle text-pretty'>
                    Traditional vertex and fragment rasterization pipeline. Because WebGL lacks
                    compute shaders, dynamic animations must rely on stateless closed-form vertex
                    shaders or single-threaded CPU loops.
                  </p>
                </div>

                <ul className='space-y-2.5 pt-1 font-mono text-xs text-foreground-subtle'>
                  <li className='flex items-center gap-2.5'>
                    <IconLayersLinked className='size-4 text-warning shrink-0' />
                    <span>Fixed-function vertex and fragment rasterizer</span>
                  </li>
                  <li className='flex items-center gap-2.5'>
                    <IconScale className='size-4 text-warning shrink-0' />
                    <span>Stateless vertex displacement without particle memory</span>
                  </li>
                  <li className='flex items-center gap-2.5'>
                    <IconCpu className='size-4 text-warning shrink-0' />
                    <span>Synchronous OpenGL state validation per draw call</span>
                  </li>
                  <li className='flex items-center gap-2.5'>
                    <IconSparkles className='size-4 text-warning shrink-0' />
                    <span>Universal 99.5% compatibility across all legacy browsers</span>
                  </li>
                </ul>
              </div>

              <div className='mt-8 pt-6 border-t border-border/40'>
                <Link
                  href='/three-d/webgl'
                  className='inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border/80 bg-surface hover:bg-surface-raised text-foreground hover:text-warning px-5 py-3 text-sm font-semibold transition-all active:scale-[0.98]'
                >
                  <span>Launch WebGL Benchmark</span>
                  <IconArrowRight className='size-4' />
                </Link>
              </div>
            </article>
          </div>
        </section>

        {/* Section 2: WebGPU Procedural Shader Laboratory */}
        <section
          aria-labelledby='shader-lab-heading'
          className='overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-surface to-surface-raised p-7 sm:p-9 shadow-sm transition-all hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5'
        >
          <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-8'>
            <div className='space-y-4 max-w-xl'>
              <div className='flex items-center gap-2'>
                <span className='inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-mono font-semibold text-accent'>
                  <IconSparkles className='size-3.5' />
                  <span>TSL Procedural Shaders</span>
                </span>
                <span className='font-mono text-xs text-foreground-muted'>
                  Interactive Geometries
                </span>
              </div>

              <div>
                <h2
                  id='shader-lab-heading'
                  className='font-serif text-2xl sm:text-3xl font-bold text-foreground'
                >
                  WebGPU Procedural Shader Laboratory
                </h2>
                <p className='mt-2 text-sm leading-relaxed text-foreground-subtle text-pretty'>
                  Explore real-time procedural geometry and mathematical materials built with Three
                  Shading Language (TSL). Featuring 3D MaterialX fractal noise vertex displacement,
                  morphing mathematical gyroids, and dynamic Fresnel iridescence.
                </p>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2'>
                <div className='rounded-xl border border-border/60 bg-surface p-3.5'>
                  <div className='flex items-center gap-1.5 text-accent'>
                    <IconFlame className='size-4' />
                    <p className='font-mono text-[11px] font-bold text-foreground'>Plasma Orb</p>
                  </div>
                  <p className='text-[11px] text-foreground-muted mt-1'>MaterialX 3D Noise</p>
                </div>
                <div className='rounded-xl border border-border/60 bg-surface p-3.5'>
                  <div className='flex items-center gap-1.5 text-accent'>
                    <IconSparkles className='size-4' />
                    <p className='font-mono text-[11px] font-bold text-foreground'>Liquid Gyroid</p>
                  </div>
                  <p className='text-[11px] text-foreground-muted mt-1'>Trigonometric Surface</p>
                </div>
                <div className='rounded-xl border border-border/60 bg-surface p-3.5'>
                  <div className='flex items-center gap-1.5 text-accent'>
                    <IconBolt className='size-4' />
                    <p className='font-mono text-[11px] font-bold text-foreground'>Cyber Wave</p>
                  </div>
                  <p className='text-[11px] text-foreground-muted mt-1'>Harmonic Matrix</p>
                </div>
              </div>
            </div>

            <div className='shrink-0 flex flex-col items-center lg:items-end gap-3'>
              <Link
                href='/three-d/shaders'
                className='inline-flex items-center gap-2 rounded-xl bg-accent text-accent-foreground hover:opacity-90 px-6 py-3.5 text-sm font-semibold shadow-md transition-all active:scale-[0.98]'
              >
                <span>Launch Shader Laboratory</span>
                <IconArrowRight className='size-4' />
              </Link>
              <span className='font-mono text-[11px] text-foreground-muted'>
                Includes live TSL Code Inspector
              </span>
            </div>
          </div>
        </section>

        {/* Section 3: Technical Architecture Breakdown Table */}
        <section
          aria-labelledby='architecture-breakdown-heading'
          className='overflow-hidden rounded-2xl border border-border/50 bg-surface p-6 sm:p-8 shadow-sm space-y-6'
        >
          <div className='flex items-start justify-between flex-wrap gap-4'>
            <div className='space-y-1.5'>
              <div className='flex items-center gap-2.5'>
                <IconDeviceDesktopAnalytics className='size-5 text-accent' />
                <h2
                  id='architecture-breakdown-heading'
                  className='font-serif text-2xl font-bold text-foreground'
                >
                  Architectural Breakdown: Old vs New
                </h2>
              </div>
              <p className='text-sm text-foreground-subtle leading-relaxed max-w-2xl'>
                Why WebGPU fundamentally redefines performance thresholds for 3D web applications
                compared to traditional WebGL.
              </p>
            </div>

            <div className='flex items-center gap-3'>
              <Link
                href='/three-d/webgpu'
                className='inline-flex items-center gap-1 text-xs font-mono text-accent hover:underline'
              >
                Launch WebGPU →
              </Link>
              <span className='text-border'>|</span>
              <Link
                href='/three-d/webgl'
                className='inline-flex items-center gap-1 text-xs font-mono text-warning hover:underline'
              >
                Launch WebGL →
              </Link>
            </div>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full text-left text-xs'>
              <thead>
                <tr className='border-b border-border/60 text-foreground-muted font-mono'>
                  <th className='py-3.5 px-4 font-semibold'>Dimension</th>
                  <th className='py-3.5 px-4 font-semibold text-accent'>WebGPU (WebGPURenderer)</th>
                  <th className='py-3.5 px-4 font-semibold text-warning'>
                    WebGL 2.0 (WebGLRenderer)
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border/40 font-mono'>
                <tr>
                  <td className='py-3.5 px-4 font-medium text-foreground'>Compute Architecture</td>
                  <td className='py-3.5 px-4 text-accent font-semibold'>
                    Native WGSL general-purpose compute workgroups
                  </td>
                  <td className='py-3.5 px-4 text-foreground-muted'>
                    Not supported (stateless vertex math or GPGPU hacks)
                  </td>
                </tr>
                <tr>
                  <td className='py-3.5 px-4 font-medium text-foreground'>Memory Bandwidth</td>
                  <td className='py-3.5 px-4 text-accent font-semibold'>
                    GPU Storage Buffers (0 bytes CPU-to-GPU PCIe transfer)
                  </td>
                  <td className='py-3.5 px-4 text-warning'>
                    Requires Float32Array PCIe upload per frame (needsUpdate)
                  </td>
                </tr>
                <tr>
                  <td className='py-3.5 px-4 font-medium text-foreground'>Physical Simulation</td>
                  <td className='py-3.5 px-4 text-accent font-semibold'>
                    Stateful integration in VRAM (persistent velocity & inertia)
                  </td>
                  <td className='py-3.5 px-4 text-foreground-muted'>
                    Stateless closed-form displacement (particles have no memory)
                  </td>
                </tr>
                <tr>
                  <td className='py-3.5 px-4 font-medium text-foreground'>Driver Overhead</td>
                  <td className='py-3.5 px-4 text-accent font-semibold'>
                    Pre-baked Pipeline State Objects (PSOs) & command encoders
                  </td>
                  <td className='py-3.5 px-4 text-warning'>
                    Synchronous OpenGL ES state validation in JS thread
                  </td>
                </tr>
                <tr>
                  <td className='py-3.5 px-4 font-medium text-foreground'>Throughput at 1M pts</td>
                  <td className='py-3.5 px-4 text-accent font-semibold'>
                    Sustained 60 FPS across massive GPU hardware concurrency
                  </td>
                  <td className='py-3.5 px-4 text-warning'>
                    Severe framerate drop-offs beyond 100K–250K particles
                  </td>
                </tr>
                <tr>
                  <td className='py-3.5 px-4 font-medium text-foreground'>Browser Ecosystem</td>
                  <td className='py-3.5 px-4 text-foreground-subtle'>
                    Chrome 113+, Safari 17.4+, Edge, Firefox Nightly
                  </td>
                  <td className='py-3.5 px-4 text-success font-semibold'>
                    Universal (99.5% of all global browsers)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: 3D Tools, Software & Ecosystem Resources */}
        <section aria-labelledby='tools-resources-heading' className='space-y-8'>
          <div className='max-w-2xl'>
            <p className='font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent'>
              Toolchain & Ecosystem
            </p>
            <h2
              id='tools-resources-heading'
              className='mt-2 font-serif text-2xl sm:text-3xl font-bold text-foreground'
            >
              3D Tools, Software & Engineering Resources
            </h2>
            <p className='mt-2 text-sm leading-relaxed text-foreground-subtle text-pretty'>
              The modern design tools, asset optimization pipelines, runtimes, and learning
              references powering high-craft 3D experiences on the web.
            </p>
          </div>

          {/* Spline & 3D Workshop Spotlight Banner */}
          <div className='overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/20 via-surface to-surface-raised p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6'>
            <div className='space-y-2.5 max-w-2xl'>
              <div className='flex items-center gap-2'>
                <span className='inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-0.5 text-xs font-mono font-semibold text-accent'>
                  <IconSparkles className='size-3.5' />
                  Interactive 3D Design
                </span>
                <span className='font-mono text-xs text-foreground-muted'>Design to Code</span>
              </div>
              <h3 className='font-serif text-xl sm:text-2xl font-bold text-foreground'>
                Spline — Collaborative 3D in the Browser
              </h3>
              <p className='text-sm text-foreground-subtle leading-relaxed'>
                Spline bridges the gap between design and production code with real-time browser
                modeling, physics simulations, and direct React/Three.js export runtimes. Check out
                Henrik&apos;s step-by-step workshop guide to build an interactive 3D rocketship in
                under 40 minutes.
              </p>
            </div>

            <div className='flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0'>
              <a
                href='https://thenorthalliance.notion.site/Spline-Workshop-1b2cf2f6604a8079876bd7b025269ed5'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 rounded-xl bg-accent text-accent-foreground hover:opacity-90 px-5 py-3 text-xs font-semibold shadow-md transition-all active:scale-[0.98]'
              >
                <IconRocket className='size-4' />
                <span>Spline Rocket Workshop</span>
                <IconExternalLink className='size-3.5 opacity-80' />
              </a>
              <a
                href='https://spline.design'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 rounded-xl border border-border/80 bg-surface hover:bg-surface-raised px-4 py-3 text-xs font-semibold text-foreground transition-all shadow-xs'
              >
                <span>Spline.design</span>
                <IconExternalLink className='size-3.5 opacity-60' />
              </a>
            </div>
          </div>

          {/* 4-Category Toolchain Matrix */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {TOOL_CATEGORIES.map(cat => {
              const CatIcon = cat.icon;
              return (
                <div
                  key={cat.title}
                  className='rounded-2xl border border-border/50 bg-surface p-6 sm:p-7 space-y-5 transition-all hover:border-accent/40'
                >
                  <div className='flex items-center justify-between border-b border-border/40 pb-4'>
                    <div className='flex items-center gap-2.5'>
                      <div className='flex size-8 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent'>
                        <CatIcon className='size-4' />
                      </div>
                      <div>
                        <h3 className='font-serif font-bold text-base text-foreground'>
                          {cat.title}
                        </h3>
                        <p className='text-[11px] text-foreground-muted'>{cat.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-3.5'>
                    {cat.tools.map(t => (
                      <a
                        key={t.name}
                        href={t.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='group block rounded-xl border border-border/40 bg-surface-raised/60 hover:bg-surface-raised hover:border-accent/30 p-3.5 transition-all'
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-2'>
                            <span className='font-mono text-xs font-bold text-foreground group-hover:text-accent transition-colors'>
                              {t.name}
                            </span>
                            <span className='rounded bg-surface px-2 py-0.5 font-mono text-[9px] font-medium text-foreground-muted border border-border/50'>
                              {t.tag}
                            </span>
                          </div>
                          <IconExternalLink className='size-3.5 text-foreground-muted group-hover:text-accent transition-colors opacity-70 group-hover:opacity-100' />
                        </div>
                        <p className='mt-1.5 text-xs text-foreground-subtle leading-relaxed'>
                          {t.description}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 5: Workshop Presentation Feature Card */}
        <section
          aria-labelledby='workshop-presentation-heading'
          className='overflow-hidden rounded-2xl border border-border/50 bg-surface p-7 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 transition-all hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5'
        >
          <div className='space-y-2 text-center sm:text-left'>
            <div className='inline-flex items-center gap-2 text-xs font-mono text-accent'>
              <IconRocket className='size-4' />
              <span>Interactive Workshop Slide Deck</span>
            </div>
            <h2
              id='workshop-presentation-heading'
              className='font-serif text-2xl font-bold text-foreground'
            >
              Houston, we&apos;re coding 3D! 🚀
            </h2>
            <p className='text-sm text-foreground-subtle max-w-xl leading-relaxed'>
              Explore the interactive presentation covering Three.js fundamentals, React Three Fiber
              composition, shader techniques, and web graphics craft.
            </p>
          </div>

          <Link
            href='/presentations/houston-we-re-coding-3d'
            className='shrink-0 inline-flex items-center gap-2 rounded-xl border border-border/80 bg-surface-raised hover:bg-accent hover:text-accent-foreground px-5 py-3 text-sm font-semibold text-foreground transition-all shadow-xs'
          >
            <IconPresentation className='size-4' />
            <span>Open Workshop Deck</span>
            <IconArrowRight className='size-4' />
          </Link>
        </section>
      </div>

      <ScrollToTopButton />
    </div>
  );
}
