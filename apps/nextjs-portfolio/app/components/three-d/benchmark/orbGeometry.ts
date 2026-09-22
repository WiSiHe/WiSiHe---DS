import * as THREE from 'three';

export const BASE_ORB_RADIUS = 2.6;

const STAR_PALETTE = ['#9bbfff', '#ffffff', '#ffffff', '#ffdca8', '#ff8a65'];

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

/** A simple distant star field: positions + vertex colors, no per-star shading. */
export function generateStarfield(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const radius = 380.0;

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    const i3 = i * 3;
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    const starColor = new THREE.Color(
      STAR_PALETTE[Math.floor(Math.random() * STAR_PALETTE.length)],
    );
    const brightness = 0.6 + Math.random() * 0.4;
    colors[i3] = starColor.r * brightness;
    colors[i3 + 1] = starColor.g * brightness;
    colors[i3 + 2] = starColor.b * brightness;
  }

  return { positions, colors };
}

export function makeStarfieldPoints(count = 10000): THREE.Points {
  const { positions, colors } = generateStarfield(count);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    sizeAttenuation: false,
  });

  return new THREE.Points(geo, mat);
}
