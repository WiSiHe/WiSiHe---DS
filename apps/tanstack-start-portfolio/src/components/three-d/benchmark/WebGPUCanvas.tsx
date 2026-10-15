'use client';

import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { type ComponentRef, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  abs,
  billboarding,
  cameraPosition,
  clamp,
  color,
  cos,
  Fn,
  float,
  instanceIndex,
  length,
  max,
  mix,
  normalize,
  sin,
  smoothstep,
  storage,
  uniform,
  uv,
  vec2,
  vec3,
} from 'three/tsl';
import { MeshBasicNodeMaterial, type Node, StorageBufferAttribute } from 'three/webgpu';
import { getResolvedTheme, useThemeStore } from '../../../lib/store';
import {
  BASE_ORB_RADIUS,
  generateOrbBase,
  makeLightMotePoints,
  makeStarfieldPoints,
} from './orbGeometry';
import type { BenchmarkConfig } from './types';
import { getThemedPalette } from './types';

interface WebGPUCanvasProps {
  config: BenchmarkConfig;
  onFrame: (drawCalls: number, triangles: number, backend: string) => void;
  onWebGPUFallback?: () => void;
  resetKey?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Background depth layer — a bright starfield in dark mode, soft floating
// light motes in light mode (stars don't read against a daylight sky).
// ─────────────────────────────────────────────────────────────────────────────
function BackgroundDepthField({ isDark }: { isDark: boolean }) {
  const points = useMemo(
    () => (isDark ? makeStarfieldPoints(10000) : makeLightMotePoints(700)),
    [isDark],
  );
  return <primitive object={points} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Particle Orb — a glowing sphere of particles, animated entirely on the GPU
// via a WebGPU compute shader. Each particle rigidly rotates and pulses, then
// on top of that: gently repels from the mouse (spring-back via a decaying
// strength uniform), and rides an expanding ring of displacement on click.
// Depth cueing (near = brighter, far = dimmer) reinforces the spherical read.
// ─────────────────────────────────────────────────────────────────────────────
const BURST_SLOTS = 4;

function ParticleOrb({
  config,
  onFrame,
  isDark,
}: {
  config: BenchmarkConfig;
  onFrame: (drawCalls: number, triangles: number, backend: string) => void;
  isDark: boolean;
}) {
  const { gl, camera, pointer } = useThree();
  const palette = getThemedPalette(isDark);

  // biome-ignore lint/correctness/useExhaustiveDependencies: uniforms are created once and mutated in place every frame (useFrame); rebuilding them would recreate the compute node and material
  const uniforms = useMemo(
    () => ({
      uTime: uniform(0),
      uSpeed: uniform(config.speed),
      uScale: uniform(config.orbRadius / 14),
      uCameraDist: uniform(16),
      uMouseSmooth: uniform(new THREE.Vector3(0, 0, 1000)),
      uMouseStrength: uniform(0),
      uHoverRadius: uniform(1.6),
      // A small fixed pool of click bursts so repeated clicks stack instead
      // of resetting one shared ripple — each slot animates independently.
      burstPoints: Array.from({ length: BURST_SLOTS }, () =>
        uniform(new THREE.Vector3(0, 0, 1000)),
      ),
      burstProgress: Array.from({ length: BURST_SLOTS }, () => uniform(0)),
      burstActive: Array.from({ length: BURST_SLOTS }, () => uniform(0)),
    }),
    [],
  );

  const { computeNode, particleMesh } = useMemo(() => {
    const count = config.count;
    const { base, temp } = generateOrbBase(count);

    const baseStorage = storage(new StorageBufferAttribute(base, 4), 'vec4', count);
    const tempStorage = storage(new StorageBufferAttribute(temp, 1), 'float', count);
    const posStorage = storage(
      new StorageBufferAttribute(new Float32Array(count * 3), 3),
      'vec3',
      count,
    );

    const computeOrb = Fn(() => {
      const b = baseStorage.element(instanceIndex);
      const pos = posStorage.element(instanceIndex);

      const t = uniforms.uTime.mul(uniforms.uSpeed);
      const angle = t.mul(float(0.25));
      const rx = b.x.mul(cos(angle)).sub(b.z.mul(sin(angle)));
      const rz = b.x.mul(sin(angle)).add(b.z.mul(cos(angle)));
      const pulse = float(1.0).add(
        sin(t.mul(float(1.4)).add(b.w.mul(float(6.283)))).mul(float(0.05)),
      );

      const basePos = vec3(rx, b.y, rz).mul(pulse).mul(uniforms.uScale).mul(float(BASE_ORB_RADIUS));

      // Hover: gentle repel from the mouse's projected point; "spring back" is
      // just uMouseStrength decaying to 0 once the pointer moves away/leaves.
      const toMouse = basePos.sub(uniforms.uMouseSmooth);
      const mouseDist = length(toMouse);
      const hoverFalloff = clamp(
        float(1.0).sub(mouseDist.div(uniforms.uHoverRadius)),
        float(0.0),
        float(1.0),
      );
      const hoverPush = normalize(toMouse.add(float(1e-4)))
        .mul(hoverFalloff.mul(hoverFalloff))
        .mul(uniforms.uMouseStrength)
        .mul(float(0.8));

      // Click bursts: each active slot rides its own expanding ring of
      // displacement that fades as it grows; contributions from multiple
      // slots simply add, so stacking clicks compounds instead of resetting.
      let burstPush: Node<'vec3'> = vec3(0.0, 0.0, 0.0);
      for (let i = 0; i < BURST_SLOTS; i++) {
        const burstPoint = uniforms.burstPoints[i];
        const burstProgress = uniforms.burstProgress[i];
        const burstActive = uniforms.burstActive[i];
        if (!burstPoint || !burstProgress || !burstActive) continue;
        const toClick = basePos.sub(burstPoint);
        const clickDist = length(toClick);
        const ringRadius = burstProgress.mul(uniforms.uScale.mul(float(9.0)));
        const ringWidth = uniforms.uScale.mul(float(1.6));
        const ringMask = clamp(
          float(1.0).sub(abs(clickDist.sub(ringRadius)).div(ringWidth)),
          float(0.0),
          float(1.0),
        );
        const burstFade = float(1.0).sub(burstProgress);
        burstPush = burstPush.add(
          normalize(toClick.add(float(1e-4)))
            .mul(ringMask)
            .mul(burstFade)
            .mul(burstActive)
            .mul(float(0.9)),
        );
      }

      pos.assign(basePos.add(hoverPush).add(burstPush));
    });

    const computeNode = computeOrb().compute(count);

    const material = new MeshBasicNodeMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const finalPos = posStorage.element(instanceIndex);
    // vertical:true makes this a full spherical billboard (always fully
    // facing the camera) instead of the default cylindrical one, which only
    // cancels horizontal rotation and looks wrong/stretched as the camera
    // orbits vertically.
    material.vertexNode = billboarding({ position: finalPos, vertical: true });

    const tempValue = tempStorage.element(instanceIndex);
    const cCool = color(new THREE.Color(palette.secondary));
    const cMid = color(new THREE.Color(palette.primary));
    const cHot = color(new THREE.Color(palette.hot));
    const s1 = mix(cCool, cMid, clamp(tempValue.mul(float(2.0)), float(0.0), float(1.0)));
    const finalColor = mix(
      s1,
      cHot,
      clamp(tempValue.sub(float(0.5)).mul(float(2.0)), float(0.0), float(1.0)),
    );

    // Depth cueing: particles nearer the camera read brighter, far side dimmer.
    const distToCam = length(finalPos.sub(cameraPosition));
    const orbExtent = uniforms.uScale.mul(float(BASE_ORB_RADIUS));
    const depthNear = uniforms.uCameraDist.sub(orbExtent);
    const depthFar = uniforms.uCameraDist.add(orbExtent);
    const depthT = clamp(
      distToCam.sub(depthNear).div(max(depthFar.sub(depthNear), float(0.001))),
      float(0.0),
      float(1.0),
    );
    const depthFade = mix(float(1.3), float(0.55), depthT);

    // Click-burst brightness rings, evaluated against the settled position —
    // same additive-slots approach as the displacement above.
    let burstGlow: Node<'float'> = float(0.0);
    for (let i = 0; i < BURST_SLOTS; i++) {
      const burstPoint = uniforms.burstPoints[i];
      const burstProgress = uniforms.burstProgress[i];
      const burstActive = uniforms.burstActive[i];
      if (!burstPoint || !burstProgress || !burstActive) continue;
      const toClickC = finalPos.sub(burstPoint);
      const ringRadiusC = burstProgress.mul(uniforms.uScale.mul(float(9.0)));
      const ringWidthC = uniforms.uScale.mul(float(1.6));
      const ringMaskC = clamp(
        float(1.0).sub(abs(length(toClickC).sub(ringRadiusC)).div(ringWidthC)),
        float(0.0),
        float(1.0),
      );
      burstGlow = burstGlow.add(ringMaskC.mul(float(1.0).sub(burstProgress)).mul(burstActive));
    }

    const centred = uv().sub(vec2(0.5, 0.5));
    const d = length(centred);
    const circleMask = smoothstep(float(0.5), float(0.4), d);
    const glow = float(0.07)
      .div(max(float(0.03), d))
      .mul(clamp(float(1.0).sub(d.mul(float(2.0))), float(0.0), float(1.0)));

    material.colorNode = finalColor.mul(depthFade).mul(float(1.0).add(burstGlow.mul(float(1.0))));
    material.opacityNode = circleMask.mul(glow).mul(float(0.5));

    const quadSize = config.particleSize * 0.05 * Math.sqrt(50_000 / count);
    const geometry = new THREE.PlaneGeometry(quadSize, quadSize);
    const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
    instancedMesh.frustumCulled = false;

    return { computeNode, particleMesh: instancedMesh };
  }, [config.count, config.particleSize, palette, uniforms]);

  // Interaction refs
  const _raw = useRef(new THREE.Vector3());
  const _dir = useRef(new THREE.Vector3());
  const _forward = useRef(new THREE.Vector3());
  const _target = useRef(new THREE.Vector3());
  const _smooth = useRef(new THREE.Vector3(0, 0, 1000));
  const burstSlots = useRef(
    Array.from({ length: BURST_SLOTS }, () => ({ active: false, progress: 0.0 })),
  );
  const nextBurstSlot = useRef(0);

  // Project the pointer onto a camera-facing plane through the orb's center —
  // gives a stable 3D point to measure particle distance against, without
  // needing to raycast against the (non-solid) particle cloud itself.
  const projectPointer = (ndcX: number, ndcY: number, out: THREE.Vector3) => {
    _raw.current.set(ndcX, ndcY, 0.5).unproject(camera);
    _dir.current.subVectors(_raw.current, camera.position).normalize();
    camera.getWorldDirection(_forward.current);
    const denom = _dir.current.dot(_forward.current);
    if (Math.abs(denom) < 1e-6) return false;
    const t = -camera.position.dot(_forward.current) / denom;
    out.copy(camera.position).addScaledVector(_dir.current, t);
    return true;
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: the listener only needs to be (re)bound when the canvas element changes; projectPointer/pointer/uniforms are stable or read live, and re-binding on every change would drop clicks
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      // Round-robin through the slot pool so repeated clicks stack as
      // independent, overlapping ripples instead of restarting one ripple.
      const slot = nextBurstSlot.current;
      nextBurstSlot.current = (slot + 1) % BURST_SLOTS;
      const burst = burstSlots.current[slot];
      const burstPoint = uniforms.burstPoints[slot];
      const burstActive = uniforms.burstActive[slot];
      if (
        burst &&
        burstPoint &&
        burstActive &&
        projectPointer(pointer.x, pointer.y, burstPoint.value)
      ) {
        burst.progress = 0.001;
        burst.active = true;
        burstActive.value = 1;
      }
    };

    const dom = gl.domElement;
    dom.addEventListener('pointerdown', handlePointerDown);
    return () => dom.removeEventListener('pointerdown', handlePointerDown);
  }, [gl]);

  useFrame((_state, delta) => {
    const dt = Math.min(delta, 0.04);
    const time = _state.clock.getElapsedTime();

    uniforms.uTime.value = time;
    uniforms.uSpeed.value = config.speed;
    uniforms.uScale.value = config.orbRadius / 14;
    uniforms.uCameraDist.value = camera.position.length();

    const isActive = Math.abs(pointer.x) > 0.001 || Math.abs(pointer.y) > 0.001;
    if (isActive && projectPointer(pointer.x, pointer.y, _target.current)) {
      const alpha = Math.min(1.0, dt * 8.0);
      _smooth.current.lerp(_target.current, alpha);
      uniforms.uMouseSmooth.value.copy(_smooth.current);
    }
    const targetStrength = isActive ? 1.0 : 0.0;
    uniforms.uMouseStrength.value +=
      (targetStrength - uniforms.uMouseStrength.value) * Math.min(1.0, dt * 4.0);

    for (let i = 0; i < BURST_SLOTS; i++) {
      const slot = burstSlots.current[i];
      const burstActive = uniforms.burstActive[i];
      const burstProgress = uniforms.burstProgress[i];
      if (!slot?.active || !burstActive || !burstProgress) continue;
      slot.progress += dt * 1.1;
      if (slot.progress >= 1.0) {
        slot.progress = 0;
        slot.active = false;
        burstActive.value = 0;
      }
      burstProgress.value = slot.progress;
    }

    (gl as unknown as { compute: (node: unknown) => void }).compute(computeNode);

    onFrame(2, config.count * 2, 'WebGPU Compute (TSL Storage Buffers)');
  });

  return <primitive object={particleMesh} />;
}

export function WebGPUCanvas({ config, onFrame, onWebGPUFallback, resetKey }: WebGPUCanvasProps) {
  const [hasWebGPU, setHasWebGPU] = useState<boolean | null>(null);
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = !mounted || getResolvedTheme(theme) !== 'light';
  const palette = getThemedPalette(isDark);
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);

  useEffect(() => {
    async function checkSupport() {
      if (typeof navigator !== 'undefined' && 'gpu' in navigator) {
        try {
          const adapter = await (
            navigator as Navigator & { gpu: { requestAdapter: () => Promise<unknown> } }
          ).gpu.requestAdapter();
          if (adapter) {
            setHasWebGPU(true);
          } else {
            setHasWebGPU(false);
            onWebGPUFallback?.();
          }
        } catch {
          setHasWebGPU(false);
          onWebGPUFallback?.();
        }
      } else {
        setHasWebGPU(false);
        onWebGPUFallback?.();
      }
    }
    checkSupport();
  }, [onWebGPUFallback]);

  useEffect(() => {
    if (resetKey && controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.object.position.set(0, 4, 16);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [resetKey]);

  if (hasWebGPU === false) {
    return (
      <div className='flex h-full w-full flex-col items-center justify-center p-6 text-center text-foreground'>
        <div className='max-w-md rounded-2xl border border-border/80 bg-surface/90 p-8 shadow-xl backdrop-blur-xl'>
          <h2 className='font-serif text-2xl font-bold text-foreground'>WebGPU Not Supported</h2>
          <p className='mt-3 text-sm leading-relaxed text-muted-foreground'>
            Your current browser or GPU device doesn&apos;t support WebGPU or lacks hardware
            acceleration. Try Chrome 113+, Edge, or Firefox Nightly on macOS/Windows.
          </p>
          <div className='mt-6'>
            <a
              href='/three-d/webgl'
              className='inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow transition hover:opacity-90'
            >
              Switch to WebGL 2.0 Benchmark
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='relative h-full w-full overflow-hidden' style={{ backgroundColor: palette.bg }}>
      <Canvas
        camera={{ position: [0, 4, 16], fov: 35, near: 0.1, far: 900 }}
        gl={async props => {
          const { WebGPURenderer } = await import('three/webgpu');
          const renderer = new WebGPURenderer(
            props as unknown as ConstructorParameters<typeof WebGPURenderer>[0],
          );
          await renderer.init();
          return renderer;
        }}
      >
        <fogExp2 attach='fog' args={[palette.bg, 0.003]} />
        <ambientLight intensity={0.4} />
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          maxDistance={40}
          minDistance={3}
          target={[0, 0, 0]}
          autoRotate
          autoRotateSpeed={0.3}
        />
        <ParticleOrb
          key={`${config.count}-${resetKey}`}
          config={config}
          onFrame={onFrame}
          isDark={isDark}
        />
        <BackgroundDepthField isDark={isDark} />
      </Canvas>
    </div>
  );
}
