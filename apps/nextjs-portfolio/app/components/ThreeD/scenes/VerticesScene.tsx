'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { BEER_CAN_GEOMETRY, COLORS } from '../constants';

export function VerticesScene() {
  const pointsGeometry = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(
      BEER_CAN_GEOMETRY.radiusTop,
      BEER_CAN_GEOMETRY.radiusBottom,
      BEER_CAN_GEOMETRY.height,
      BEER_CAN_GEOMETRY.radialSegments,
    );
    const positions = geometry.attributes.position.array;
    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.dispose();
    return bufferGeometry;
  }, []);

  return (
    <points geometry={pointsGeometry}>
      <pointsMaterial size={0.05} color={COLORS.green} sizeAttenuation />
    </points>
  );
}
