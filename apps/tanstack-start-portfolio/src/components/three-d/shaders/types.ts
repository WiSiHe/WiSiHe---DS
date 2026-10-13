export type ShaderScene = 'plasma' | 'gyroid' | 'wave';

export type ShaderPalette = 'neon' | 'cyber' | 'aurora' | 'gold';

export interface ShaderConfig {
  scene: ShaderScene;
  palette: ShaderPalette;
  displacement: number;
  frequency: number;
  speed: number;
  roughness: number;
  metalness: number;
  wireframe: boolean;
}

export const SHADER_PALETTES: Record<
  ShaderPalette,
  { name: string; primary: string; secondary: string; accent: string; bg: string }
> = {
  neon: {
    name: 'Cosmic Neon',
    primary: '#00f0ff',
    secondary: '#ff007f',
    accent: '#7928ca',
    bg: '#04050d',
  },
  cyber: {
    name: 'Cyber Emerald',
    primary: '#10b981',
    secondary: '#06b6d4',
    accent: '#3b82f6',
    bg: '#010c0a',
  },
  aurora: {
    name: 'Violet Aurora',
    primary: '#c084fc',
    secondary: '#38bdf8',
    accent: '#f43f5e',
    bg: '#080312',
  },
  gold: {
    name: 'Obsidian Gold',
    primary: '#fbbf24',
    secondary: '#f97316',
    accent: '#ef4444',
    bg: '#0c0702',
  },
};

export const DEFAULT_SHADER_CONFIG: ShaderConfig = {
  scene: 'plasma',
  palette: 'neon',
  displacement: 0.8,
  frequency: 1.4,
  speed: 0.9,
  roughness: 0.2,
  metalness: 0.8,
  wireframe: false,
};

export const TSL_CODE_SNIPPETS: Record<
  ShaderScene,
  { title: string; description: string; code: string }
> = {
  plasma: {
    title: 'MaterialX Fractal Noise Vertex Displacement',
    description:
      'Displaces sphere mesh vertices dynamically along local surface normals via 3D MaterialX noise.',
    code: `import * as THREE from 'three/webgpu';
import { positionLocal, normalLocal, time, uniform, float, mx_fractal_noise_vec3, mix, color, dot, normalView, vec3 } from 'three/tsl';

// 1. Setup Material
const material = new THREE.MeshPhysicalNodeMaterial();

// 2. Vertex Displacement (TSL)
const noiseP = positionLocal.mul(uniform(1.4)).add(time.mul(uniform(0.9)));
const noiseVec = mx_fractal_noise_vec3(noiseP);
material.positionNode = positionLocal.add(normalLocal.mul(noiseVec.x.mul(uniform(0.8))));

// 3. Dynamic Fresnel Iridescence
const rim = float(1.0).sub(dot(normalView, vec3(0, 0, 1))).clamp(0.0, 1.0);
material.colorNode = mix(color('#00f0ff'), color('#ff007f'), rim);
material.roughnessNode = float(0.2);
material.metalnessNode = float(0.85);`,
  },
  gyroid: {
    title: 'Procedural Gyroid Minimal Surface Morphing',
    description:
      'Evaluates the 3D trigonometric gyroid formula to morph geometry with liquid metallic reflections.',
    code: `import * as THREE from 'three/webgpu';
import { positionLocal, normalLocal, time, uniform, float, sin, cos, mix, color } from 'three/tsl';

const material = new THREE.MeshPhysicalNodeMaterial();

// 3D Trigonometric Gyroid Function
const p = positionLocal.mul(uniform(1.8)).add(time.mul(uniform(0.7)));
const g1 = sin(p.x).mul(cos(p.y));
const g2 = sin(p.y).mul(cos(p.z));
const g3 = sin(p.z).mul(cos(p.x));
const gyroid = g1.add(g2).add(g3);

// Displace vertices along normals
material.positionNode = positionLocal.add(normalLocal.mul(gyroid.mul(uniform(0.5))));
material.colorNode = mix(color('#fbbf24'), color('#f97316'), gyroid.mul(0.5).add(0.5));
material.metalnessNode = float(0.95);
material.roughnessNode = float(0.15);`,
  },
  wave: {
    title: 'Cybernetic Radial Wave Field',
    description:
      'Propagates harmonic wave fronts across a geometric grid matrix with animated ripple dispersion.',
    code: `import * as THREE from 'three/webgpu';
import { positionLocal, normalLocal, time, uniform, float, length, sin, cos, mix, color } from 'three/tsl';

const material = new THREE.MeshPhysicalNodeMaterial();

// Radial wave calculation
const dist = length(positionLocal.xz);
const wave = sin(dist.mul(uniform(2.0)).sub(time.mul(uniform(2.5)))).mul(uniform(0.6));

material.positionNode = positionLocal.add(normalLocal.mul(wave));
material.colorNode = mix(color('#10b981'), color('#06b6d4'), wave.add(0.5));
material.roughnessNode = float(0.25);`,
  },
};
