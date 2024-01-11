// https://github.com/trekhleb/use-position/blob/master/src/usePosition.js
import { useCallback, useEffect, useState } from 'react';

export function usePosition() {
  const [position, setPosition] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onChange = useCallback(({ coords }: GeolocationPosition) => {
    setPosition((currentPosition) => {
      const significantChange = 0.001; // ~100m

      if (currentPosition) {
        const latChange = Math.abs(currentPosition.latitude - coords.latitude);
        const lonChange = Math.abs(
          currentPosition.longitude - coords.longitude,
        );

        if (latChange > significantChange || lonChange > significantChange) {
          return {
            latitude: coords.latitude,
            longitude: coords.longitude,
            accuracy: coords.accuracy,
          };
        } else {
          return currentPosition;
        }
      } else {
        return {
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
        };
      }
    });
  }, []);

  function onError(error: GeolocationPositionError) {
    setError(error.message);
  }

  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      setError('Geolocation is not supported');
      return;
    }
    const watcher = geo.watchPosition(onChange, onError, {
      enableHighAccuracy: true,
      maximumAge: 1000 * 60,
      timeout: 10000,
    });
    return () => geo.clearWatch(watcher);
  }, [onChange]);

  return { ...position, error };
}
