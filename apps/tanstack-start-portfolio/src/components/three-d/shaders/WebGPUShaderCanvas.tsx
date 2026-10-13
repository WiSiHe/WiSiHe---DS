'use client';

import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  color,
  cos,
  dot,
  float,
  length,
  mix,
  mx_fractal_noise_vec3,
  normalLocal,
  normalView,
  positionLocal,
  sin,
  uniform,
  vec3,
} from 'three/tsl';
import * as THREE from 'three/webgpu';
import type { ShaderConfig } from './types';
import { SHADER_PALETTES } from './types';

interface WebGPUShaderCanvasProps {
  config: ShaderConfig;
}

// Scene 1: Celestial Plasma Orb with MaterialX Noise Displacement
function PlasmaOrb({ config }: { config: ShaderConfig }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const palette = SHADER_PALETTES[config.palette];

  // biome-ignore lint/correctness/useExhaustiveDependencies: uniforms are created once; the effect below keeps frequency/displacement in sync without recreating them
  const uniforms = useMemo(() => {
    return {
      uTime: uniform(0),
      uFreq: uniform(config.frequency),
      uDisp: uniform(config.displacement),
    };
  }, []);

  useEffect(() => {
    uniforms.uFreq.value = config.frequency;
    uniforms.uDisp.value = config.displacement;
  }, [config.frequency, config.displacement, uniforms]);

  const material = useMemo(() => {
    const mat = new THREE.MeshPhysicalNodeMaterial({
      roughness: config.roughness,
      metalness: config.metalness,
      wireframe: config.wireframe,
      clearcoat: 0.3,
    });

    // MaterialX fractal noise vertex displacement
    const noiseCoord = positionLocal.mul(uniforms.uFreq).add(uniforms.uTime);
    const noiseVec = mx_fractal_noise_vec3(noiseCoord);
    mat.positionNode = positionLocal.add(normalLocal.mul(noiseVec.x.mul(uniforms.uDisp)));

    // Dynamic Fresnel rim iridescence
    const rim = float(1.0)
      .sub(dot(normalView, vec3(0, 0, 1)))
      .clamp(float(0.0), float(1.0));
    const cPrimary = color(palette.primary);
    const cSecondary = color(palette.secondary);
    const cAccent = color(palette.accent);
    const baseColor = mix(cPrimary, cSecondary, noiseVec.y.mul(0.5).add(0.5));
    mat.colorNode = mix(baseColor, cAccent, rim.pow(float(2.0)));

    return mat;
  }, [config.roughness, config.metalness, config.wireframe, palette, uniforms]);

  useFrame((_state, delta) => {
    uniforms.uTime.value += delta * config.speed;
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15 * config.speed;
      meshRef.current.rotation.x += delta * 0.08 * config.speed;
    }
  });

  return (
    <mesh ref={meshRef} material={material}>
      <sphereGeometry args={[2.2, 128, 128]} />
    </mesh>
  );
}

// Scene 2: Liquid Mercury Gyroid Morphing Surface
function LiquidGyroid({ config }: { config: ShaderConfig }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const palette = SHADER_PALETTES[config.palette];

  // biome-ignore lint/correctness/useExhaustiveDependencies: uniforms are created once; the effect below keeps frequency/displacement in sync without recreating them
  const uniforms = useMemo(() => {
    return {
      uTime: uniform(0),
      uFreq: uniform(config.frequency),
      uDisp: uniform(config.displacement),
    };
  }, []);

  useEffect(() => {
    uniforms.uFreq.value = config.frequency;
    uniforms.uDisp.value = config.displacement;
  }, [config.frequency, config.displacement, uniforms]);

  const material = useMemo(() => {
    const mat = new THREE.MeshPhysicalNodeMaterial({
      roughness: Math.max(config.roughness, 0.05),
      metalness: Math.max(config.metalness, 0.8),
      wireframe: config.wireframe,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    });

    // 3D Trigonometric Gyroid function
    const p = positionLocal.mul(uniforms.uFreq).add(uniforms.uTime);
    const g1 = sin(p.x).mul(cos(p.y));
    const g2 = sin(p.y).mul(cos(p.z));
    const g3 = sin(p.z).mul(cos(p.x));
    const gyroid = g1.add(g2).add(g3);

    // Displace vertices along normal
    mat.positionNode = positionLocal.add(normalLocal.mul(gyroid.mul(uniforms.uDisp.mul(0.4))));

    // Metallic color gradient based on gyroid isosurface value
    const cPrimary = color(palette.primary);
    const cSecondary = color(palette.secondary);
    mat.colorNode = mix(cPrimary, cSecondary, gyroid.mul(0.4).add(0.5));

    return mat;
  }, [config.roughness, config.metalness, config.wireframe, palette, uniforms]);

  useFrame((_state, delta) => {
    uniforms.uTime.value += delta * config.speed;
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2 * config.speed;
      meshRef.current.rotation.z += delta * 0.1 * config.speed;
    }
  });

  return (
    <mesh ref={meshRef} material={material}>
      <torusKnotGeometry args={[1.7, 0.55, 200, 48]} />
    </mesh>
  );
}

// Scene 3: Cybernetic Radial Wave Matrix
function CyberWave({ config }: { config: ShaderConfig }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const palette = SHADER_PALETTES[config.palette];

  // biome-ignore lint/correctness/useExhaustiveDependencies: uniforms are created once; the effect below keeps frequency/displacement in sync without recreating them
  const uniforms = useMemo(() => {
    return {
      uTime: uniform(0),
      uFreq: uniform(config.frequency),
      uDisp: uniform(config.displacement),
    };
  }, []);

  useEffect(() => {
    uniforms.uFreq.value = config.frequency;
    uniforms.uDisp.value = config.displacement;
  }, [config.frequency, config.displacement, uniforms]);

  const material = useMemo(() => {
    const mat = new THREE.MeshPhysicalNodeMaterial({
      roughness: config.roughness,
      metalness: config.metalness,
      wireframe: config.wireframe,
    });

    // Radial wave harmonic calculation
    const dist = length(positionLocal.xz);
    const wave = sin(dist.mul(uniforms.uFreq.mul(1.8)).sub(uniforms.uTime.mul(2.5))).mul(
      uniforms.uDisp.mul(0.6),
    );

    mat.positionNode = positionLocal.add(normalLocal.mul(wave));

    const cPrimary = color(palette.primary);
    const cSecondary = color(palette.secondary);
    const cAccent = color(palette.accent);
    mat.colorNode = mix(cPrimary, cSecondary, wave.mul(0.5).add(0.5));
    mat.emissiveNode = cAccent.mul(wave.clamp(float(0.0), float(1.0)).mul(0.3));

    return mat;
  }, [config.roughness, config.metalness, config.wireframe, palette, uniforms]);

  useFrame((_state, delta) => {
    uniforms.uTime.value += delta * config.speed;
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * 0.05 * config.speed;
    }
  });

  return (
    <mesh ref={meshRef} material={material} rotation={[-Math.PI / 3, 0, 0]}>
      <planeGeometry args={[10, 10, 96, 96]} />
    </mesh>
  );
}

export function WebGPUShaderCanvas({ config }: WebGPUShaderCanvasProps) {
  const palette = SHADER_PALETTES[config.palette];

  return (
    <div className='relative h-full w-full overflow-hidden' style={{ backgroundColor: palette.bg }}>
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45, near: 0.1, far: 100 }}
        gl={async props => {
          const { WebGPURenderer } = await import('three/webgpu');
          const renderer = new WebGPURenderer({
            canvas: props.canvas as HTMLCanvasElement,
            antialias: true,
            powerPreference: 'high-performance',
          });
          await renderer.init();
          return renderer;
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 8]} intensity={1.5} color='#ffffff' />
        <pointLight position={[-10, -5, -5]} intensity={1.2} color={palette.secondary} />
        <pointLight position={[5, -10, 5]} intensity={0.8} color={palette.primary} />

        <OrbitControls enableDamping dampingFactor={0.05} maxDistance={25} minDistance={3.5} />

        {config.scene === 'plasma' && <PlasmaOrb config={config} />}
        {config.scene === 'gyroid' && <LiquidGyroid config={config} />}
        {config.scene === 'wave' && <CyberWave config={config} />}
      </Canvas>
    </div>
  );
}
