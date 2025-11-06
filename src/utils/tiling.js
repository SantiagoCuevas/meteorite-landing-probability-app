const clampLatitude = (lat) => Math.min(Math.max(lat, -90), 90);
const clampLongitude = (lon) => Math.min(Math.max(lon, -180), 180);

export function latLongCoordToTile(lat, lon) {
  const latitude = clampLatitude(Number(lat));
  const longitude = clampLongitude(Number(lon));

  const safeLat = latitude === 90 ? 89.999999 : latitude;
  const safeLon = longitude === 180 ? 179.999999 : longitude;

  const latTile = Math.floor(safeLat);
  const lonTile = Math.floor(safeLon);
  return { latTile, lonTile };
}
