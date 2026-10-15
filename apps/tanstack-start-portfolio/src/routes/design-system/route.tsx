import { createFileRoute, Outlet } from '@tanstack/react-router';
import { DesignSystemShell } from '../../components/design-system/DesignSystemShell';

export const Route = createFileRoute('/design-system')({
  component: DesignSystemRouteLayout,
});

function DesignSystemRouteLayout() {
  return (
    <DesignSystemShell>
      <Outlet />
    </DesignSystemShell>
  );
}
