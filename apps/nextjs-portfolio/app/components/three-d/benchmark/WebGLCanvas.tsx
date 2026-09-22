'use client';

import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/app/providers';
import {
  BASE_ORB_RADIUS,
  generateOrbBase,
  makeLightMotePoints,
  makeStarfieldPoints,
} from './orbGeometry';
import type { BenchmarkConfig } from './types';
import { getThemedPalette } from './types';

interface WebGLCanvasProps {
  config: BenchmarkConfig;
  onFrame: (drawCalls: number, triangles: number, backend: string) => void;
  resetKey?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Particle Orb — same concept, same rotate/pulse/hover-repel/click-burst/
// depth-fade math and the same billboarded-quad-per-particle geometry as the
// WebGPU version, so the two are a fair comparison. The one real difference
// is where the per-particle position gets computed: WebGPU does it once per
// particle in a dedicated compute pass and just reads the cached result back
// here; WebGL has no compute shader, so this vertex shader recomputes it
// redundantly on every one of a quad's 4 corners — that redundant work is
// exactly what a compute shader buys you back at scale.
// ─────────────────────────────────────────────────────────────────────────────
const BURST_SLOTS = 4;
const orbVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uScale;
  uniform float uCameraDist;
  uniform vec3 uCool;
  uniform vec3 uMid;
  uniform vec3 uHot;
  uniform vec3 uMouseSmooth;
  uniform float uMouseStrength;
  uniform float uHoverRadius;
  // A small fixed pool of click bursts so repeated clicks stack instead of
  // resetting one shared ripple — each slot animates independently.
  uniform vec3 uBurstPoints[${BURST_SLOTS}];
  uniform float uBurstProgress[${BURST_SLOTS}];
  uniform float uBurstActive[${BURST_SLOTS}];

  attribute vec4 aBase; // per-instance [x, y, z, phase]
  attribute float aTemp; // per-instance

  varying vec3 vColor;
  varying vec2 vUv;

  void main() {
    vUv = uv; // PlaneGeometry's built-in per-vertex UV (quad corner, 0..1)

    float t = uTime * uSpeed;
    float angle = t * 0.25;
    float rx = aBase.x * cos(angle) - aBase.z * sin(angle);
    float rz = aBase.x * sin(angle) + aBase.z * cos(angle);
    float pulse = 1.0 + sin(t * 1.4 + aBase.w * 6.283) * 0.05;

    vec3 basePos = vec3(rx, aBase.y, rz) * pulse * uScale * ${BASE_ORB_RADIUS.toFixed(1)};

    // Hover: gentle repel from the mouse's projected point; spring-back is
    // just uMouseStrength decaying to 0 once the pointer moves away/leaves.
    vec3 toMouse = basePos - uMouseSmooth;
    float mouseDist = length(toMouse);
    float hoverFalloff = clamp(1.0 - mouseDist / uHoverRadius, 0.0, 1.0);
    vec3 hoverPush = normalize(toMouse + 1e-4) * (hoverFalloff * hoverFalloff) * uMouseStrength * 0.8;

    // Click bursts: each active slot rides its own expanding ring of
    // displacement that fades as it grows; contributions simply add, so
    // stacking clicks compounds instead of resetting.
    vec3 burstPush = vec3(0.0);
    for (int i = 0; i < ${BURST_SLOTS}; i++) {
      vec3 toClick = basePos - uBurstPoints[i];
      float clickDist = length(toClick);
      float ringRadius = uBurstProgress[i] * uScale * 9.0;
      float ringWidth = uScale * 1.6;
      float ringMask = clamp(1.0 - abs(clickDist - ringRadius) / ringWidth, 0.0, 1.0);
      float burstFade = 1.0 - uBurstProgress[i];
      burstPush += normalize(toClick + 1e-4) * ringMask * burstFade * uBurstActive[i] * 0.9;
    }

    vec3 center = basePos + hoverPush + burstPush;

    // View-space billboard: transform only the particle's center through the
    // model-view matrix, then add the quad's local corner offset directly in
    // view space so the quad always faces the camera — the same math
    // WebGPU's billboarding() TSL helper reduces to once its geometry-scale
    // terms cancel out for an untransformed instanced mesh.
    vec4 mvCenter = viewMatrix * vec4(center, 1.0);
    mvCenter.xy += position.xy;
    gl_Position = projectionMatrix * mvCenter;

    float dist = length(mvCenter.xyz);

    // Depth cueing: near the camera reads brighter, far side dimmer.
    float orbExtent = uScale * ${BASE_ORB_RADIUS.toFixed(1)};
    float depthNear = uCameraDist - orbExtent;
    float depthFar = uCameraDist + orbExtent;
    float depthT = clamp((dist - depthNear) / max(depthFar - depthNear, 0.001), 0.0, 1.0);
    float depthFade = mix(1.3, 0.55, depthT);

    // Click-burst brightness rings, evaluated against the settled position —
    // same additive-slots approach as the displacement above.
    float burstGlow = 0.0;
    for (int i = 0; i < ${BURST_SLOTS}; i++) {
      vec3 toClickC = center - uBurstPoints[i];
      float ringRadiusC = uBurstProgress[i] * uScale * 9.0;
      float ringWidthC = uScale * 1.6;
      float ringMaskC = clamp(1.0 - abs(length(toClickC) - ringRadiusC) / ringWidthC, 0.0, 1.0);
      burstGlow += ringMaskC * (1.0 - uBurstProgress[i]) * uBurstActive[i];
    }

    vec3 a = mix(uCool, uMid, clamp(aTemp * 2.0, 0.0, 1.0));
    float brightness = depthFade + burstGlow;
    vColor = mix(a, uHot, clamp((aTemp - 0.5) * 2.0, 0.0, 1.0)) * brightness;
  }
`;

const orbFragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying vec2 vUv;

  // Match WebGPU's automatic linear -> sRGB output encoding. A raw
  // THREE.ShaderMaterial bypasses that pipeline and writes gl_FragColor
  // straight through, which is why the WebGL orb used to look noticeably
  // dimmer/duller than the WebGPU one for the exact same color math.
  vec3 linearToSRGB(vec3 c) {
    vec3 lo = c * 12.92;
    vec3 hi = 1.055 * pow(max(c, 0.0), vec3(1.0 / 2.4)) - 0.055;
    return mix(lo, hi, step(vec3(0.0031308), c));
  }

  void main() {
    vec2 c = vUv - 0.5;
    float d = length(c);
    // Soft-edged circular mask (smoothstep, no discard) — matches WebGPU's
    // circleMask exactly instead of a hard-edged discard cutoff.
    float circleMask = smoothstep(0.5, 0.4, d);

    float glow = (0.07 / max(0.03, d)) * clamp(1.0 - d * 2.0, 0.0, 1.0);
    // Color stays at full brightness here and glow only drives alpha, matching
    // WebGPU's colorNode/opacityNode split — premultiplying color by glow too
    // would square the falloff under additive blending and crush the bright
    // core relative to the WebGPU version.
    gl_FragColor = vec4(linearToSRGB(vColor), circleMask * glow * 0.5);
  }
`;

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

  const geometry = useMemo(() => {
    const { base, temp } = generateOrbBase(config.count);
    const quadSize = config.particleSize * 0.05 * Math.sqrt(50_000 / config.count);
    // Identical geometry/instancing to the WebGPU orb: a real world-space
    // quad per particle (so it perspective-scales correctly with no manual
    // point-size attenuation needed), instanced across the particle count.
    const geo = new THREE.PlaneGeometry(quadSize, quadSize);
    geo.setAttribute('aBase', new THREE.InstancedBufferAttribute(base, 4));
    geo.setAttribute('aTemp', new THREE.InstancedBufferAttribute(temp, 1));
    return geo;
  }, [config.count, config.particleSize]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: config.speed },
      uScale: { value: config.orbRadius / 14 },
      uCameraDist: { value: 16 },
      uCool: { value: new THREE.Color(palette.secondary) },
      uMid: { value: new THREE.Color(palette.primary) },
      uHot: { value: new THREE.Color(palette.hot) },
      uMouseSmooth: { value: new THREE.Vector3(0, 0, 1000) },
      uMouseStrength: { value: 0 },
      uHoverRadius: { value: 1.6 },
      uBurstPoints: {
        value: Array.from({ length: BURST_SLOTS }, () => new THREE.Vector3(0, 0, 1000)),
      },
      uBurstProgress: { value: new Array(BURST_SLOTS).fill(0) },
      uBurstActive: { value: new Array(BURST_SLOTS).fill(0) },
    }),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Palette can change live (theme toggle) without rebuilding the geometry —
  // just push the new colors into the existing uniforms.
  useEffect(() => {
    uniforms.uCool.value.set(palette.secondary);
    uniforms.uMid.value.set(palette.primary);
    uniforms.uHot.value.set(palette.hot);
  }, [palette, uniforms]);

  const instancedMesh = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      vertexShader: orbVertexShader,
      fragmentShader: orbFragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.InstancedMesh(geometry, material, config.count);
    mesh.frustumCulled = false;
    return mesh;
  }, [geometry, uniforms, config.count]);

  // Interaction refs — same camera-facing-plane projection trick as WebGPU.
  const _raw = useRef(new THREE.Vector3());
  const _dir = useRef(new THREE.Vector3());
  const _forward = useRef(new THREE.Vector3());
  const _target = useRef(new THREE.Vector3());
  const _smooth = useRef(new THREE.Vector3(0, 0, 1000));
  const burstSlots = useRef(
    Array.from({ length: BURST_SLOTS }, () => ({ active: false, progress: 0.0 })),
  );
  const nextBurstSlot = useRef(0);

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

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      // Round-robin through the slot pool so repeated clicks stack as
      // independent, overlapping ripples instead of restarting one ripple.
      const slot = nextBurstSlot.current;
      nextBurstSlot.current = (slot + 1) % BURST_SLOTS;
      if (projectPointer(pointer.x, pointer.y, uniforms.uBurstPoints.value[slot]!)) {
        burstSlots.current[slot]!.progress = 0.001;
        burstSlots.current[slot]!.active = true;
        uniforms.uBurstActive.value[slot] = 1;
      }
    };

    const dom = gl.domElement;
    dom.addEventListener('pointerdown', handlePointerDown);
    return () => dom.removeEventListener('pointerdown', handlePointerDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.04);

    uniforms.uTime.value = state.clock.getElapsedTime();
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
      const slot = burstSlots.current[i]!;
      if (!slot.active) continue;
      slot.progress += dt * 1.1;
      if (slot.progress >= 1.0) {
        slot.progress = 0;
        slot.active = false;
        uniforms.uBurstActive.value[i] = 0;
      }
      uniforms.uBurstProgress.value[i] = slot.progress;
    }

    onFrame(2, config.count * 2, 'WebGL 2.0 (Vertex Shader, Instanced Quads)');
  });

  return <primitive object={instancedMesh} />;
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

export function WebGLCanvas({ config, onFrame, resetKey }: WebGLCanvasProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = !mounted || resolvedTheme !== 'light';
  const palette = getThemedPalette(isDark);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (resetKey && controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.object.position.set(0, 4, 16);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [resetKey]);

  return (
    <div className='relative h-full w-full overflow-hidden' style={{ backgroundColor: palette.bg }}>
      <Canvas
        camera={{ position: [0, 4, 16], fov: 35, near: 0.1, far: 900 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          outputColorSpace: 'srgb',
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
          zoomSpeed={0.4}
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
