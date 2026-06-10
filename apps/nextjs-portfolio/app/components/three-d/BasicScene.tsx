'use client';

import { Float, Sphere, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const OrbitingScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);

  const particlesCount = 180;
  const positions = useMemo(() => {
    const arr = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const r = 1.8 + Math.random() * 1.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame(state => {
    const t = state.clock.getElapsedTime();

    // Rotate inner core (snappy rotation)
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.4;
      coreRef.current.rotation.x = t * 0.25;
    }

    // Rotate outer rings at different speeds and angles
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.35;
      ring1Ref.current.rotation.y = t * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.25;
      ring2Ref.current.rotation.z = t * 0.3;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = -t * 0.2;
      ring3Ref.current.rotation.z = -t * 0.4;
    }

    // Orbit point lights for dynamic sweeping reflections
    if (light1Ref.current) {
      light1Ref.current.position.x = Math.sin(t * 0.8) * 3;
      light1Ref.current.position.z = Math.cos(t * 0.8) * 3;
      light1Ref.current.position.y = Math.sin(t * 0.4) * 1.5;
    }
    if (light2Ref.current) {
      light2Ref.current.position.x = -Math.sin(t * 0.6) * 3;
      light2Ref.current.position.z = -Math.cos(t * 0.6) * 3;
      light2Ref.current.position.y = Math.cos(t * 0.3) * 1.5;
    }

    // Mouse parallax tilt on the entire group
    if (groupRef.current) {
      const targetX = state.pointer.y * 0.45;
      const targetY = state.pointer.x * 0.45;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetX,
        0.08,
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetY,
        0.08,
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Dynamic point lights */}
      <pointLight ref={light1Ref} color='#00f3ff' intensity={4} distance={8} />
      <pointLight ref={light2Ref} color='#ff007c' intensity={4} distance={8} />
      <pointLight position={[0, 4, 0]} color='#ffaa00' intensity={2} />

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1.0}>
        {/* 1. Glowing Inner Holographic Core (Octahedron) */}
        <mesh ref={coreRef}>
          <octahedronGeometry args={[0.42, 1]} />
          <meshStandardMaterial
            color='#ff007c'
            emissive='#ff0055'
            emissiveIntensity={3.0}
            wireframe
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* 2. Refractive Glass Sphere Outer Shell */}
        <Sphere args={[0.95, 64, 64]}>
          <meshPhysicalMaterial
            color='#ffffff'
            transmission={0.95}
            opacity={1.0}
            roughness={0.08}
            metalness={0.1}
            ior={1.65}
            thickness={1.8}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
            attenuationColor='#ffffff'
            attenuationDistance={1}
            transparent
          />
        </Sphere>

        {/* 3. Outer Gyroscope Ring 1 */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[1.4, 0.025, 16, 100]} />
          <meshStandardMaterial
            color='#00f3ff'
            emissive='#00a6ff'
            emissiveIntensity={1.5}
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* 4. Outer Gyroscope Ring 2 */}
        <mesh ref={ring2Ref}>
          <torusGeometry args={[1.5, 0.025, 16, 100]} />
          <meshStandardMaterial
            color='#ffaa00'
            emissive='#ff6600'
            emissiveIntensity={1.5}
            transparent
            opacity={0.5}
          />
        </mesh>

        {/* 5. Outer Gyroscope Ring 3 */}
        <mesh ref={ring3Ref}>
          <torusGeometry args={[1.6, 0.025, 16, 100]} />
          <meshStandardMaterial
            color='#7c3aed'
            emissive='#6366f1'
            emissiveIntensity={1.5}
            transparent
            opacity={0.5}
          />
        </mesh>

        {/* 6. Orbital Dust Cloud */}
        <points>
          <bufferGeometry>
            <bufferAttribute attach='attributes-position' args={[positions, 3]} />
          </bufferGeometry>
          <pointsMaterial color='#00f3ff' size={0.045} sizeAttenuation transparent opacity={0.8} />
        </points>
      </Float>
    </group>
  );
};

const BasicScene = () => {
  return (
    <div className='w-full h-full min-h-[400px] relative bg-black/50 rounded-3xl overflow-hidden shadow-2xl border border-border/10'>
      <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[-5, -5, -5]} intensity={0.7} />

        <Stars radius={90} depth={40} count={2500} factor={3} saturation={0.6} fade speed={1.2} />
        <OrbitingScene />
      </Canvas>
    </div>
  );
};

export default BasicScene;
