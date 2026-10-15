import { CloseIcon } from '@sanity/icons/Close';
import { DesktopIcon } from '@sanity/icons/Desktop';
import { LaunchIcon } from '@sanity/icons/Launch';
import { MobileDeviceIcon } from '@sanity/icons/MobileDevice';
import { SyncIcon } from '@sanity/icons/Sync';
import { TabletDeviceIcon } from '@sanity/icons/TabletDevice';
import { useRef, useState } from 'react';
import { readSanityAppProcessEnv } from '../../sanityEnv';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

interface PresentationPaneProps {
  previewPath: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function PresentationPane({
  previewPath,
  isCollapsed = false,
  onToggleCollapse,
}: PresentationPaneProps) {
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Compute live draft preview URL (nextjs-portfolio runs on port 1992)
  const defaultBase = 'http://localhost:1992';
  const configuredBase =
    readSanityAppProcessEnv('SANITY_APP_PREVIEW_URL') ??
    readSanityAppProcessEnv('SANITY_STUDIO_PREVIEW_URL') ??
    readSanityAppProcessEnv('NEXT_PUBLIC_SITE_URL') ??
    import.meta.env.VITE_PREVIEW_URL?.trim() ??
    defaultBase;

  const origin = configuredBase.replace(/\/$/, '');
  const targetPath = previewPath.startsWith('/') ? previewPath : `/${previewPath}`;

  // Route through Next.js Draft Mode enable endpoint
  const draftUrl = `${origin}/api/draft-mode/enable?redirect=${encodeURIComponent(targetPath)}`;

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (iframeRef.current) {
      iframeRef.current.src = draftUrl;
    }
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleOpenExternal = () => {
    window.open(draftUrl, '_blank', 'noopener,noreferrer');
  };

  if (isCollapsed) return null;

  return (
    <div className='presentation-pane'>
      <div className='presentation-toolbar'>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div className='live-badge'>
            <span className='live-pulse-dot' />
            <span>LIVE PREVIEW</span>
          </div>
          <span className='mono presentation-path-badge' title={targetPath}>
            {targetPath}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {/* Viewport switchers */}
          <div className='device-selectors'>
            <button
              type='button'
              className={`device-btn ${device === 'desktop' ? 'active' : ''}`}
              onClick={() => setDevice('desktop')}
              title='Desktop Fluid'
            >
              <DesktopIcon />
              <span>Full</span>
            </button>
            <button
              type='button'
              className={`device-btn ${device === 'tablet' ? 'active' : ''}`}
              onClick={() => setDevice('tablet')}
              title='Tablet (768px)'
            >
              <TabletDeviceIcon />
              <span>Tablet</span>
            </button>
            <button
              type='button'
              className={`device-btn ${device === 'mobile' ? 'active' : ''}`}
              onClick={() => setDevice('mobile')}
              title='Mobile (375px)'
            >
              <MobileDeviceIcon />
              <span>Mobile</span>
            </button>
          </div>

          <div className='toolbar-separator' />

          {/* Action buttons */}
          <button
            type='button'
            className='device-icon-btn'
            onClick={handleRefresh}
            title='Reload preview'
          >
            <SyncIcon className={isRefreshing ? 'rotating' : ''} />
          </button>

          <button
            type='button'
            className='device-icon-btn'
            onClick={handleOpenExternal}
            title='Open in new tab'
          >
            <LaunchIcon />
          </button>

          {onToggleCollapse && (
            <button
              type='button'
              className='device-icon-btn close'
              onClick={onToggleCollapse}
              title='Close preview'
            >
              <CloseIcon />
            </button>
          )}
        </div>
      </div>

      <div className='presentation-viewport'>
        <div className={`preview-iframe-wrapper ${device}`}>
          <iframe
            ref={iframeRef}
            src={draftUrl}
            title='Next.js Live Presentation'
            className='preview-iframe'
            allow='accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi; clipboard-read; clipboard-write;'
          />
        </div>
      </div>
    </div>
  );
}
