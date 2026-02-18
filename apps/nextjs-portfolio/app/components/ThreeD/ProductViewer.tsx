'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, MeshReflectorMaterial, useCursor, Float, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import * as THREE from 'three';


const ProductViewer = () => {
  const [activeColor, setActiveColor] = useState('#3b82f6'); // Default Blue

  const colors = [
    { name: 'Core Black', hex: '#1a1a1a' },
    { name: 'Off White', hex: '#f5f5f0' },
    { name: 'Vans Red', hex: '#ba2121' },
    { name: 'Navy Blue', hex: '#1e2d4d' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 bg-surface-elevated border border-border rounded-[2.5rem] p-8 shadow-2xl">
      {/* 3D Canvas Area */}
      <div className="flex-1 min-h-[400px] lg:min-h-[500px] relative bg-surface border border-border rounded-3xl overflow-hidden cursor-move">
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
          
          <Suspense fallback={null}>
            <Stage environment="city" intensity={0.5} shadows="contact">
              {/* VansShoe component removed */}
            </Stage>
          </Suspense>

          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} enableZoom={true} />
        </Canvas>

        {/* Overlay Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
          <span className="px-3 py-1 bg-accent text-accent-contrast rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
            3D Interactive
          </span>
          <span className="px-3 py-1 bg-surface border border-border rounded-full text-[10px] font-bold uppercase tracking-widest text-foreground-subtle shadow-sm">
            Real-time RT
          </span>
        </div>
      </div>

      {/* Product Content Area */}
      <div className="lg:w-80 flex flex-col justify-center">
        <div className="mb-8">
          <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">Vans <span className="text-accent">Old Skool</span></h3>
          <p className="text-foreground/60 leading-relaxed text-sm">
            The classic skate shoe that's stayed legendary for decades. Now fully customizable in real-time. Pick your finish and see the craftsmanship in high-fidelity 3D.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-3 block">Configure Finish</span>
            <div className="flex gap-3">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setActiveColor(c.hex)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    activeColor === c.hex ? 'border-accent scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  aria-label={`Select ${c.name} color`}
                />
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-border-subtle">
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="text-xs font-bold text-foreground/40 block">Price</span>
                <span className="text-2xl font-black">$75.00</span>
              </div>
              <span className="text-foreground/40 text-[10px] font-bold italic">Ready to ship</span>
            </div>
            <button className="w-full py-4 bg-foreground text-background font-bold rounded-2xl hover:bg-accent hover:text-accent-contrast transition-all shadow-xl uppercase tracking-widest text-xs">
              Customize & Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewer;
