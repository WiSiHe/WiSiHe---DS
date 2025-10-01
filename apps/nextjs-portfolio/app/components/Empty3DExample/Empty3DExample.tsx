'use client';

// ============================================================================
// IMPORTS - 3D Libraries
// ============================================================================

// React Three Fiber: React wrapper for Three.js
import { Canvas, useFrame } from '@react-three/fiber';
// Drei: Helper components for common 3D operations
import { Sphere } from '@react-three/drei';
// Standard React hooks
import { Suspense, useEffect, useRef, useState } from 'react';
// Three.js core classes
import { Mesh } from 'three';
import { cn } from '@wisihe/utils';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Empty3DExampleProps {
  className?: string;
}

// ============================================================================
// 3D COMPONENTS
// ============================================================================

// Cursor-following shape
const CursorFollower: React.FC = () => {
  const meshRef = useRef<Mesh>(null);

  // Track mouse movement using React Three Fiber's pointer tracking
  useFrame(state => {
    if (meshRef.current) {
      // Get normalized device coordinates (-1 to 1)
      const x = state.pointer.x * 8; // Scale to -8 to 8 range
      const y = state.pointer.y * 5; // Scale to -5 to 5 range (no inversion)

      // Add some Z movement based on mouse position for depth
      const z = Math.sin(state.pointer.x * Math.PI) * 0.5; // Oscillate Z based on X position

      // Direct positioning without interpolation for testing
      meshRef.current.position.x = x;
      meshRef.current.position.y = y;
      meshRef.current.position.z = z;

      // Add subtle rotation based on movement
      meshRef.current.rotation.x = state.pointer.y * 0.2;
      meshRef.current.rotation.y = state.pointer.x * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[2, 1, 0.5]} />
      <meshStandardMaterial
        color="#61dafb"
        metalness={0.3}
        roughness={0.4}
        emissive="#004080"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
};

const Empty3DExample: React.FC<Empty3DExampleProps> = ({ className = '' }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-surface-elevated rounded-2xl',
          className,
        )}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full mx-auto mb-4 animate-pulse" />
          <div className="h-4 bg-surface rounded w-32 mx-auto mb-2" />
          <div className="h-3 bg-surface rounded w-24 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'aspect-video ring relative bg-surface-elevated rounded-lg overflow-hidden',
        className,
      )}
    >
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} shadows>
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 5, 5]} intensity={0.5} color="#61dafb" />

        {/* Cursor Follower */}
        <Suspense
          fallback={
            <Sphere args={[0.5, 32, 32]}>
              <meshStandardMaterial color="#2c5aa0" />
            </Sphere>
          }
        >
          <CursorFollower />
        </Suspense>

        {/* Fixed 2D Camera - No Controls */}
      </Canvas>
    </div>
  );
};

export default Empty3DExample;
