'use client';

import { useMemo } from 'react';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';
import { BEER_CAN_GEOMETRY, COLORS, MATERIAL_PROPERTIES } from '../constants';
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
    const geometry = new THREE.CylinderGeometry(
      BEER_CAN_GEOMETRY.radiusTop,
      BEER_CAN_GEOMETRY.radiusBottom,
      BEER_CAN_GEOMETRY.height,
      BEER_CAN_GEOMETRY.radialSegments,
    );
    return new THREE.EdgesGeometry(geometry);
  }, []);

  return (
    <mesh geometry={canGeometry}>
      <meshStandardMaterial
        color={getCssVariableAsHex('--color-accent', COLORS.teal)}
        metalness={MATERIAL_PROPERTIES.metallic.metalness}
        roughness={MATERIAL_PROPERTIES.metallic.roughness}
      />
      <Edges geometry={edgesGeometry} color="#000000" threshold={0} />
    </mesh>
  );
}
