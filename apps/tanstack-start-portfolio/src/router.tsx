// src/router.tsx
import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    // Preload a route's chunks and data when a link is hovered/focused; pages are edge-cached so this is cheap.
    defaultPreload: 'intent',
  });

  return router;
}
