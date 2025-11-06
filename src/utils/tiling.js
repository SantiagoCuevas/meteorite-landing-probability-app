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

export function tileBounds(latTile, lonTile) {
  const south = latTile;
  const west = lonTile;
  const north = latTile + 1;
  const east = lonTile + 1;
  return [south, west, north, east];
}

export function tileKey(latTile, lonTile) {
  return `${latTile},${lonTile}`;
}

export function aggregateTiles(cleanData) {
  const counts = new Map();

  for (const entry of cleanData) {
    const { latTile, lonTile } = latLongCoordToTile(
      entry.reclat,
      entry.reclong
    );
    const key = tileKey(latTile, lonTile);
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  const out = [];
  for (const [key, count] of counts.entries()) {
    const [latTileStr, lonTileStr] = key.split(",");
    out.push({
      latTile: Number(latTileStr),
      lonTile: Number(lonTileStr),
      count,
    });
  }
  return out;
}

export function normalizeCounts(tileArray) {
  if (tileArray.length === 0) return tileArray;
  const max = Math.max(...tileArray.map((t) => t.count));
  if (max <= 0) return tileArray.map((t) => ({ ...t, rate: 0 }));
  return tileArray.map((t) => ({ ...t, rate: t.count / max }));
}
