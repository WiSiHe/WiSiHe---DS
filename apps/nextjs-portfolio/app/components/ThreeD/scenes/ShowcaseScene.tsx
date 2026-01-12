'use client';

import { forwardRef } from 'react';
import * as THREE from 'three';
import { BeerCanScene } from './BeerCanScene';

interface ShowcaseSceneProps {
  texturePath: string;
}

export const ShowcaseScene = forwardRef<THREE.Group, ShowcaseSceneProps>(
  ({ texturePath }, ref) => {
    return <BeerCanScene ref={ref} texturePath={texturePath} />;
  },
);

ShowcaseScene.displayName = 'ShowcaseScene';
