import { type ReactNode, useEffect } from 'react';
import { AlButton, AlText } from '@autolokate/ui';

import { usePwaScan } from '../context/PwaScanContext.js';
import { logPhotoDiagnostic } from '../utils/pwa-photo-diagnostics.js';

type PwaPhotoRouteGuardProps = {
  routeId: string;
  children: ReactNode;
  captureError?: string | null;
  onDismissCaptureError?: () => void;
};

/** Runtime guard for photo routes — never render an empty/black fatal state silently. */
export function PwaPhotoRouteGuard({
  routeId,
  children,
  captureError,
  onDismissCaptureError,
}: PwaPhotoRouteGuardProps) {
  const { storageError, clearStorageError } = usePwaScan();

  useEffect(() => {
    logPhotoDiagnostic(routeId, 'route_mount');
  }, [routeId]);

  return (
    <>
      {storageError ? (
        <div className="pwa-scan-photo-alert" role="status">
          <AlText tone="muted">{storageError}</AlText>
          <button type="button" className="pwa-scan-photo-alert__dismiss" onClick={clearStorageError}>
            Dismiss
          </button>
        </div>
      ) : null}
      {captureError ? (
        <div className="pwa-scan-photo-alert pwa-scan-photo-alert--error" role="alert">
          <AlText tone="muted">{captureError}</AlText>
          {onDismissCaptureError ? (
            <AlButton variant="secondary" onClick={onDismissCaptureError}>
              Dismiss
            </AlButton>
          ) : null}
        </div>
      ) : null}
      {children}
    </>
  );
}
