'use client';

import { useMemo } from 'react';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';
import { BEER_CAN_GEOMETRY, COLORS } from '../constants';

export function EdgesScene() {
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
      <meshBasicMaterial transparent opacity={0} />
      <Edges color={COLORS.blue} threshold={0} />
    </mesh>
  );
}
