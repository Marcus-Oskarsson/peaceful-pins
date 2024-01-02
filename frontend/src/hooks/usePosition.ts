// https://github.com/trekhleb/use-position/blob/master/src/usePosition.js
import { useEffect, useState } from 'react';

export function usePosition() {
  const [position, setPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onChange({ coords }: GeolocationPosition) {
    setPosition({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
  }

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
  }, []);

  return { ...position, error };
}
