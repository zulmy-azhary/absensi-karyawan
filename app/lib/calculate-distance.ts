type CurrentPositionType = google.maps.LatLngLiteral;
type TargetPositionType = google.maps.LatLngLiteral;

export function calculateDistance(
  currentPosition: CurrentPositionType,
  targetPosition: TargetPositionType
): number {
  // Konversi derajat ke radian
  let lat1 = (currentPosition.lat * Math.PI) / 180;
  let lng1 = (currentPosition.lng * Math.PI) / 180;
  let lat2 = (targetPosition.lat * Math.PI) / 180;
  let lng2 = (targetPosition.lng * Math.PI) / 180;

  // Haversine Formula
  let distanceLat = Math.abs(lat2 - lat1);
  let distanceLng = Math.abs(lng2 - lng1);
  let a =
    Math.pow(Math.sin(distanceLat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(distanceLng / 2), 2);

  let calculate = 2 * Math.asin(Math.sqrt(a));

  // Radius bumi, 6371 KM
  let radius = 6371;
  let distanceKm = calculate * radius;

  return Math.round(distanceKm * 1000);
}
