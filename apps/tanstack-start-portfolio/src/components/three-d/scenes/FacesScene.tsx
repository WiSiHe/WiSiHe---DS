'use client';

import { Edges } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import { BEER_CAN_GEOMETRY, COLORS } from '../constants';
import { getCssVariableAsHex } from '../utils/colorUtils';

export function FacesScene() {
  const canGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(
      BEER_CAN_GEOMETRY.radiusTop,
      BEER_CAN_GEOMETRY.radiusBottom,
      BEER_CAN_GEOMETRY.height,
      BEER_CAN_GEOMETRY.radialSegments,
    );
  }, []);

  const edgesGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(canGeometry);
  }, [canGeometry]);

  const accentColor = getCssVariableAsHex('--color-accent', COLORS.teal);

  return (
    <mesh geometry={canGeometry}>
      <meshStandardMaterial
        color={accentColor}
        metalness={0.1}
        roughness={0.6}
        envMapIntensity={0.5}
      />
      <Edges
        geometry={edgesGeometry}
        color={accentColor}
        threshold={15}
        opacity={0.3}
        transparent
      />
    </mesh>
  );
}
