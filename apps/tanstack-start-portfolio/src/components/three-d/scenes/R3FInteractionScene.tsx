'use client';

import { forwardRef, useState } from 'react';
import type * as THREE from 'three';

export const R3FInteractionScene = forwardRef<THREE.Mesh>((_props, ref) => {
  // Standard React state for interaction
  // These trigger a re-render when changed
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: react-three-fiber <mesh> is a 3D scene object, not a DOM element
    <mesh
      ref={ref}
      // Scale changes based on active state
      scale={active ? 1.5 : 1}
      // Event listeners work just like DOM elements (onClick, onPointerOver)
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      // Change cursor to pointer to indicate interactivity
      onPointerEnter={() => {
        if (typeof document !== 'undefined') {
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerLeave={() => {
        if (typeof document !== 'undefined') {
          document.body.style.cursor = 'auto';
        }
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      {/* Color changes based on hover state */}
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
});

R3FInteractionScene.displayName = 'R3FInteractionScene';
