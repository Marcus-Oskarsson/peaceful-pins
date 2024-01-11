import { usePosition } from '@hooks/usePosition';

function toRadians(degrees: number) {
  return degrees * Math.PI / 180;
}

export function useIndistance(postPosition: { latitude: number; longitude: number }) {
  const MAX_DISTANCE = 0.2; // 200m
  const { latitude, longitude, accuracy, error } = usePosition();
  if (error || !latitude || !longitude || !accuracy) return false;

  const earthRadiusKm = 6371;
  const dLat = toRadians(latitude - postPosition.latitude);
  const dLon = toRadians(longitude - postPosition.longitude);
  const lat1 = toRadians(latitude);
  const lat2 = toRadians(postPosition.latitude);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) *
    Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadiusKm * c;

  return distance <= MAX_DISTANCE + accuracy;
}