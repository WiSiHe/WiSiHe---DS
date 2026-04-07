'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { BEER_CAN_GEOMETRY, COLORS, MATERIAL_PROPERTIES } from '../constants';

export function IntroScene() {
  const canGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(
      BEER_CAN_GEOMETRY.radiusTop,
      BEER_CAN_GEOMETRY.radiusBottom,
      BEER_CAN_GEOMETRY.height,
      BEER_CAN_GEOMETRY.radialSegments,
    );
  }, []);

  return (
    <mesh geometry={canGeometry}>
      <meshStandardMaterial
        color={COLORS.gold}
        metalness={MATERIAL_PROPERTIES.metallic.metalness}
        roughness={MATERIAL_PROPERTIES.metallic.roughness}
      />
    </mesh>
  );
}
