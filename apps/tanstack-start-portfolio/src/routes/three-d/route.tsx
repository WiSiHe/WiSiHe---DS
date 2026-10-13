import { createFileRoute, Outlet } from '@tanstack/react-router';
import { ThreeDeprecationGuard } from '../../components/three-d/ThreeDeprecationGuard';

export const Route = createFileRoute('/three-d')({
  component: ThreeDRouteLayout,
});

function ThreeDRouteLayout() {
  return (
    <>
      <ThreeDeprecationGuard />
      <Outlet />
    </>
  );
}
