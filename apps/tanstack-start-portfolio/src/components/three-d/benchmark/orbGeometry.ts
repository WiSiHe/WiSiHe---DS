import * as THREE from 'three';

export const BASE_ORB_RADIUS = 2.6;

const STAR_COLORS = ['#9bbfff', '#ffffff', '#ffffff', '#ffdca8', '#ff8a65'];
const MOTE_COLORS = ['#ffffff', '#dbe6ff', '#ffe3c2', '#ffd1ea'];

/**
 * Per-particle data for a glowing particle orb: a point picked uniformly on a
 * thin spherical shell (Marsaglia method), a phase for its pulse animation,
 * and a random "temperature" driving where it falls on the color gradient.
 * Shared by the WebGL and WebGPU canvases so both animate the exact same
 * base layout — only the update mechanism (vertex shader vs GPU compute)
 * differs between them.
 */
export function generateOrbBase(count: number) {
  const base = new Float32Array(count * 4); // [x, y, z, phase] on a unit shell
  const temp = new Float32Array(count); // 0..1 color gradient position

  for (let i = 0; i < count; i++) {
    let x = 0;
    let y = 0;
    let len2 = 1;
    do {
      x = Math.random() * 2 - 1;
      y = Math.random() * 2 - 1;
      len2 = x * x + y * y;
    } while (len2 >= 1);

    const factor = 2 * Math.sqrt(1 - len2);
    const shell = 0.85 + Math.random() * 0.3;

    const i4 = i * 4;
    base[i4] = x * factor * shell;
    base[i4 + 1] = y * factor * shell;
    base[i4 + 2] = (1 - 2 * len2) * shell;
    base[i4 + 3] = Math.random();

    temp[i] = Math.random();
  }

  return { base, temp };
}

export interface DepthFieldOptions {
  radius?: number;
  colors?: string[];
  size?: number;
  sizeAttenuation?: boolean;
  minBrightness?: number;
  maxBrightness?: number;
  opacity?: number;
}

/**
 * A distant field of points for background depth — positions + vertex
 * colors, no per-point shading. Used both for the dark-mode starfield and
 * the light-mode "light motes" layer, just with different palette/size/
 * brightness tuning (see makeDepthFieldPoints).
 */
export function generateDepthField(
  count: number,
  colors: string[],
  radius: number,
  minBrightness: number,
  maxBrightness: number,
) {
  const positions = new Float32Array(count * 3);
  const vertexColors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    const i3 = i * 3;
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    const pointColor = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
    const brightness = minBrightness + Math.random() * (maxBrightness - minBrightness);
    vertexColors[i3] = pointColor.r * brightness;
    vertexColors[i3 + 1] = pointColor.g * brightness;
    vertexColors[i3 + 2] = pointColor.b * brightness;
  }

  return { positions, colors: vertexColors };
}

export function makeDepthFieldPoints(count = 10000, options: DepthFieldOptions = {}): THREE.Points {
  const {
    radius = 170,
    colors = STAR_COLORS,
    size = 1.8,
    sizeAttenuation = false,
    minBrightness = 0.6,
    maxBrightness = 1.0,
    opacity = 1.0,
  } = options;

  const { positions, colors: vertexColors } = generateDepthField(
    count,
    colors,
    radius,
    minBrightness,
    maxBrightness,
  );
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(vertexColors, 3));

  const mat = new THREE.PointsMaterial({
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    sizeAttenuation,
    size,
    opacity,
  });

  return new THREE.Points(geo, mat);
}

/** Dark-mode background: a bright, dense starfield. */
export function makeStarfieldPoints(count = 10000): THREE.Points {
  return makeDepthFieldPoints(count, {
    radius: 170,
    colors: STAR_COLORS,
    size: 1.8,
    sizeAttenuation: false,
    minBrightness: 0.6,
    maxBrightness: 1.0,
  });
}

/** Light-mode background: sparse, soft floating light motes instead of stars. */
export function makeLightMotePoints(count = 700): THREE.Points {
  return makeDepthFieldPoints(count, {
    radius: 140,
    colors: MOTE_COLORS,
    size: 3.2,
    sizeAttenuation: true,
    minBrightness: 0.15,
    maxBrightness: 0.35,
    opacity: 0.55,
  });
}
