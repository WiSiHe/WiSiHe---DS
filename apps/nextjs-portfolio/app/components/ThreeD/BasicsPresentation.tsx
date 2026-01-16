'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Float, MeshDistortMaterial, Edges } from '@react-three/drei';
import { Suspense, useRef, useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cn } from '@wisihe/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const PresentationModel = ({ step, progress }: { step: number; progress: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  
  // Camera Animation on step change
  useGSAP(() => {
    // Different camera positions for different steps
    const positions: Record<number, [number, number, number]> = {
      0: [0, 0, 8],
      6: [2, 1, 5], // Vertex - look closer
      7: [-2, 2, 6], // Edge - perspective shift
      8: [0, 0, 7], // Face - centered
      9: [3, 2, 8], // Final - heroic angle
    };

    const targetPos = positions[step] || [0, 0, 8];
    
    gsap.to(camera.position, {
      x: targetPos[0],
      y: targetPos[1],
      z: targetPos[2],
      duration: 1.5,
      ease: "power2.inOut"
    });

    // Glitch effect on group
    if (groupRef.current) {
      gsap.fromTo(groupRef.current.scale, 
        { x: 0.8, y: 1.2, z: 0.8 }, 
        { x: 1, y: 1, z: 1, duration: 0.4, ease: "elastic.out(1, 0.3)" }
      );
    }
  }, [step]);

  // Create a complex mesh once to reuse for vertex/edge/face views
  const torusGeometry = useMemo(() => new THREE.TorusKnotGeometry(1, 0.3, 128, 32), []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      // Subtle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 0-5: History / Intro - Morphing Shapes */}
      {step < 6 && (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh>
            <torusKnotGeometry args={[1, 0.35, 128, 32]} />
            <MeshDistortMaterial 
              color={step % 2 === 0 ? "#ff00ff" : "#00ff00"} 
              speed={3} 
              distort={0.4} 
              wireframe={step > 1} 
              emissive={step % 2 === 0 ? "#ff00ff" : "#00ff00"}
              emissiveIntensity={0.5}
            />
          </mesh>
        </Float>
      )}

      {/* 6: Vertex - The Explosion of Points */}
      {step === 6 && (
        <group>
          <points geometry={torusGeometry}>
            <pointsMaterial color="#00ff00" size={0.05} sizeAttenuation={true} />
          </points>
          {/* Highlighted key vertices */}
          {[[-1.2, 0, 0], [1.2, 0, 0], [0, 1.2, 0], [0, -1.2, 0]].map((p, i) => (
             <mesh key={i} position={p as [number, number, number]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color="#ffffff" />
             </mesh>
          ))}
        </group>
      )}

      {/* 7: Edge - The Skeleton */}
      {step === 7 && (
        <mesh geometry={torusGeometry}>
          <meshBasicMaterial transparent opacity={0} />
          <Edges color="#00ff00" threshold={0} />
          {/* Inner glow effect */}
          <Edges color="#00ff00" threshold={0} scale={1.01} />
        </mesh>
      )}

      {/* 8: Face - The Surface */}
      {step === 8 && (
        <group>
          <mesh geometry={torusGeometry}>
            <meshStandardMaterial 
              color="#ff00ff" 
              transparent 
              opacity={0.8} 
              emissive="#ff00ff"
              emissiveIntensity={0.2}
              flatShading={true}
            />
          </mesh>
          <Edges color="#550055" threshold={0} />
        </group>
      )}

      {/* 9: Final Reveal - From Polygons to Products */}
      {step >= 9 && (
        <group scale={1.2}>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[1, 1.5, 0.5]} />
            <meshStandardMaterial color="#ffffff" />
            <Edges color="#000000" />
          </mesh>
          <mesh position={[0, -0.4, 0.3]} rotation={[1.2, 0, 0]}>
             <boxGeometry args={[1.1, 0.2, 0.8]} />
             <meshStandardMaterial color="#00ff00" />
          </mesh>
          {/* Floating HUD elements in 3D */}
          <Stars radius={10} depth={5} count={100} factor={2} saturation={0} />
        </group>
      )}

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} color="#00ff00" />
      <pointLight position={[-10, 5, -10]} intensity={2} color="#ff00ff" />
    </group>
  );
};

export default function BasicsPresentation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const slides = [
    { 
      title: "The Mission", 
      desc: "3D on the web is often seen as a black box of complexity. My mission: decode the matrix and make it accessible.",
      meta: "Protocol: Initialize",
      color: "text-[#00ff00]"
    },
    { 
      title: "Complexity Era", 
      desc: "Previously, 3D meant heavy plugins like Flash or VRML. The barrier was high, and the performance was low.",
      meta: "History: Legacy",
      color: "text-[#ff00ff]"
    },
    { 
      title: "The WebGL Spark", 
      desc: "Native 3D acceleration arrived in 2011. Suddenly, the GPU became available to every browser tab.",
      meta: "History: 2011",
      color: "text-[#00ff00]"
    },
    { 
      title: "Abstract Logic", 
      desc: "We started with simple shapes, but the math under the hood was intense. Libraries began to bridge the gap.",
      meta: "History: Evolution",
      color: "text-[#ff00ff]"
    },
    { 
      title: "The Three.js Boom", 
      desc: "Complexity was abstracted into scenes, cameras, and meshes. 3D development became intuitive.",
      meta: "History: 2015+",
      color: "text-[#00ff00]"
    },
    { 
      title: "Modern Reality", 
      desc: "Today, we blend design and code in real-time. 3D is no longer a luxury; it's a standard for digital storytellers.",
      meta: "History: Present",
      color: "text-[#ff00ff]"
    },
    { 
      title: "01_The Vertex", 
      desc: "The atom of the 3D world. A single point with [X, Y, Z] coordinates. Every masterpiece starts with one point.",
      meta: "Basis: Geometry",
      color: "text-[#00ff00]"
    },
    { 
      title: "02_The Edge", 
      desc: "The connection between two vertices. This is the skeleton—the invisible framework that holds the shape together.",
      meta: "Basis: Wireframe",
      color: "text-[#00ff00]"
    },
    { 
      title: "03_The Face", 
      desc: "The skin. Three or more vertices connected create a surface. This is where light, color, and textures live.",
      meta: "Basis: Surface",
      color: "text-[#ff00ff]"
    },
    { 
      title: "The Synthesis", 
      desc: "When thousands of these work in harmony, we get reality. From basic polygons to luxury e-commerce experiences.",
      meta: "Basis: Complete",
      color: "text-[#00ff00]"
    }
  ];

  useGSAP(() => {
    const sections = gsap.utils.toArray<HTMLElement>('.slide-trigger');
    
    sections.forEach((section, i: number) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          setCurrentStep(i);
          gsap.fromTo('.hud-step', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5 });
        },
        onEnterBack: () => {
          setCurrentStep(i);
          gsap.fromTo('.hud-step', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5 });
        },
        onUpdate: (self) => {
          if (currentStep === i) {
            setScrollProgress(self.progress);
          }
        }
      });
    });

    // Fade in slides on scroll
    sections.forEach((section) => {
      gsap.fromTo(section.querySelector('.slide-content'), 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 40%',
            scrub: true
          }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative min-h-[1000vh] bg-black text-[#00ff00] font-mono selection:bg-[#ff00ff] selection:text-white" style={{ isolation: 'isolate' }}>
      {/* Grid Background - using absolute and sticky parent to keep it local */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0" 
        style={{ 
          backgroundImage: 'linear-gradient(#00ff00 1px, transparent 1px), linear-gradient(90deg, #00ff00 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} 
      />

      {/* Scanline Effect - Absolute to keep it contained to this section */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

      {/* 3D Canvas - Pinned - z-index below header */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden z-20">
        <div className="w-full h-full">
          <Canvas camera={{ position: [0, 0, 8], fov: 35 }}>
            <Suspense fallback={null}>
              <PresentationModel step={currentStep} progress={scrollProgress} />
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
              <OrbitControls makeDefault enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Suspense>
          </Canvas>
        </div>
        
        {/* HUD Frame */}
        <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-between pointer-events-none border-[1px] border-[#00ff00]/20 m-4 md:m-8">
          <div className="flex justify-between items-start">
            <div className="bg-black/80 px-4 py-2 border border-[#00ff00]/40">
              <div className="text-[10px] opacity-70 uppercase tracking-[0.3em]">Module: Analysis</div>
              <div className="text-xl font-black tracking-tighter italic">3D_FUNDAMENTALS_V2.0</div>
            </div>
            <div className="bg-black/80 px-4 py-2 border border-[#ff00ff]/40 text-right">
              <div className="text-[10px] opacity-70 uppercase tracking-[0.3em] text-[#ff00ff]">Status: Optimized</div>
              <div className="text-xl font-black text-[#ff00ff] hud-step">STEP_0{currentStep + 1}</div>
            </div>
          </div>
          
          <div className="flex justify-between items-end">
            <div className="text-[10px] bg-black/80 p-4 border border-[#00ff00]/20">
              {['COMPILING...', 'LINKING...', 'READY'].map((t, i) => (
                <div key={i} className={cn(i === 2 && 'text-white', i !== 2 && 'opacity-40')}>{t}</div>
              ))}
            </div>
            <div className="text-[10px] opacity-40 text-right max-w-xs leading-tight">
              LATENCY: 12ms<br />
              BUFFER: 1024KB<br />
              ENCODING: BASE64
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Triggers - z-index above sticky 3D */}
      <div className="relative z-30">
        {slides.map((slide, i) => (
          <section key={i} className="slide-trigger h-screen flex flex-col justify-center px-4 md:px-24">
            <div className="slide-content max-w-xl bg-black/90 backdrop-blur-xl border border-[#00ff00]/20 p-8 md:p-12 shadow-[0_0_100px_rgba(0,255,0,0.05)] transform transition-all duration-700">
              <div className="flex items-center gap-4 mb-6">
                 <div
                   className={cn(
                     'w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-bold',
                     currentStep === i ? 'border-[#00ff00] text-[#00ff00]' : 'border-white/20 text-white/20'
                   )}
                 >
                    0{i+1}
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">
                    {slide.meta}
                 </span>
              </div>
              
              <h3 className={cn('text-4xl md:text-6xl font-black mb-8 uppercase italic leading-none transition-colors duration-500', slide.color)}>
                {slide.title}
              </h3>
              
              <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed mb-8 border-l-2 border-[#00ff00]/30 pl-6">
                {slide.desc}
              </p>
              
              <div className="flex gap-2">
                 {[0,1,2,3,4,5,6,7,8,9].map(dot => (
                   <div
                     key={dot}
                     className={cn(
                       'h-1 transition-all duration-300',
                       i === dot ? 'w-8 bg-[#00ff00]' : 'w-2 bg-white/10'
                     )}
                   />
                 ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
