import { useCallback, useState } from 'react';

import { reverseGeocodeLocation } from '../utils/reverse-geocode.js';

export type GeoResult = {
  lat: number;
  lng: number;
  name: string | null;
};

export function useGeolocationCapture() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<'denied' | 'unavailable' | null>(null);

  const requestLocation = useCallback((): Promise<GeoResult | null> => {
    setLoading(true);
    setError(null);

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError('unavailable');
        setLoading(false);
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          void (async () => {
            const point = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            const name = await reverseGeocodeLocation(point);
            setLoading(false);
            resolve({ ...point, name });
          })();
        },
        (geoError) => {
          setLoading(false);
          setError(geoError.code === geoError.PERMISSION_DENIED ? 'denied' : 'unavailable');
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
      );
    });
  }, []);

  return { requestLocation, loading, error };
}

export async function requestMediaPermissions(): Promise<boolean> {
  if (!navigator.mediaDevices?.getUserMedia) {
    return false;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach((track) => {
      track.stop();
    });
    return true;
  } catch {
    return false;
  }
}
