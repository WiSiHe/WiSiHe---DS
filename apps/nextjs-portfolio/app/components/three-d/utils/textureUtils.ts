import * as THREE from 'three';

interface CheckerboardTextureOptions {
  size?: number;
  color1?: string;
  color2?: string;
  repeat?: [number, number];
}

/**
 * Creates a checkerboard pattern texture using a canvas
 */
export function createCheckerboardTexture({
  size = 32,
  color1 = '#8b5cf6',
  color2 = '#6d28d9',
  repeat = [2, 2],
}: CheckerboardTextureOptions = {}): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Create checkerboard pattern
  for (let x = 0; x < canvas.width; x += size) {
    for (let y = 0; y < canvas.height; y += size) {
      const isEven = (Math.floor(x / size) + Math.floor(y / size)) % 2 === 0;
      ctx.fillStyle = isEven ? color1 : color2;
      ctx.fillRect(x, y, size, size);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat[0], repeat[1]);

  return texture;
}
