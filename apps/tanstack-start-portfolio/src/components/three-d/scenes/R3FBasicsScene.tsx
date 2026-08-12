'use client';

import { useFrame } from '@react-three/fiber';
import { forwardRef, useMemo, useRef, useState } from 'react';
import type * as THREE from 'three';

function Box({
  position,
  rotationSpeed,
  color,
}: {
  position: [number, number, number];
  rotationSpeed: number;
  color: string;
}) {
  const mesh = useRef<THREE.Mesh>(null!);
  const [active, setActive] = useState(false);

  useFrame(() => {
    // Slower rotation as requested
    mesh.current.rotation.x = mesh.current.rotation.y += rotationSpeed / 400;
  });

  return (
    <mesh
      position={position}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={e => {
        e.stopPropagation();
        setActive(!active);
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

interface R3FBasicsSceneProps {
  boxCount?: number;
}

export const R3FBasicsScene = forwardRef<THREE.Group, R3FBasicsSceneProps>(
  ({ boxCount = 1 }, ref) => {
    // Generate random stable properties for extra boxes
    const extraBoxes = useMemo(() => {
      const boxes: Array<{
        id: number;
        position: [number, number, number];
        color: string;
        speed: number;
      }> = [];
      const colors = ['#0e9aa7', '#7bc043', '#f59e0b', '#8b5cf6', '#ec4899'];

      // Always keep the first box at the center
      for (let i = 1; i < boxCount; i++) {
        boxes.push({
          id: i,
          position: [
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 2,
          ] as [number, number, number],
          color: colors[i % colors.length]!,
          speed: 2 + Math.random() * 3,
        });
      }
      return boxes;
    }, [boxCount]);

    return (
      <group ref={ref}>
        {/* Principal Box */}
        <Box position={[0, 0, 0]} rotationSpeed={1.5} color='#7f0000' />

        {/* Dynamic Boxes from state */}
        {extraBoxes.map(box => (
          <Box key={box.id} position={box.position} rotationSpeed={box.speed} color={box.color} />
        ))}
      </group>
    );
  },
);

R3FBasicsScene.displayName = 'R3FBasicsScene';
