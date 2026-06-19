import { useCallback, useState } from 'react';

import { usePwaScan, type PwaSessionPatch } from '../context/PwaScanContext.js';
import type { PwaParkMePhotos, PwaSosPhotos } from '../context/pwa-scan-types.js';
import { useCameraCapture } from './use-camera-capture.js';
import { logPhotoDiagnostic } from '../utils/pwa-photo-diagnostics.js';

type PhotoField = 'parkMePhotos' | 'sosPhotos';

export function usePwaPhotoCapture(routeId: string, field: PhotoField) {
  const { updateSession, storageError, clearStorageError } = usePwaScan();
  const { capturePhoto } = useCameraCapture(routeId);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [captureError, setCaptureError] = useState<string | null>(null);

  const clearCaptureError = useCallback(() => {
    setCaptureError(null);
  }, []);

  const captureToSlot = useCallback(
    async (slot: string) => {
      setActiveSlot(slot);
      setCaptureError(null);
      logPhotoDiagnostic(routeId, 'capture_start', { slot });

      try {
        const result = await capturePhoto();
        if (!result?.dataUrl) {
          return;
        }

        const patch: PwaSessionPatch = (prev) => {
          if (field === 'parkMePhotos') {
            return {
              parkMePhotos: {
                ...(prev.parkMePhotos as PwaParkMePhotos),
                [slot]: result.dataUrl,
              },
            };
          }
          return {
            sosPhotos: {
              ...(prev.sosPhotos as PwaSosPhotos),
              [slot]: result.dataUrl,
            },
          };
        };

        const saveResult = updateSession(patch);
        logPhotoDiagnostic(routeId, 'capture_saved', {
          slot,
          dataUrlChars: result.dataUrl.length,
          storageOk: saveResult.ok,
        });

        if (!saveResult.ok) {
          setCaptureError(saveResult.message);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Photo capture failed';
        setCaptureError(message);
        logPhotoDiagnostic(routeId, 'capture_threw', { message });
      } finally {
        setActiveSlot(null);
      }
    },
    [capturePhoto, field, routeId, updateSession],
  );

  return {
    activeSlot,
    captureError,
    storageError,
    clearCaptureError,
    clearStorageError,
    captureToSlot,
  };
}
