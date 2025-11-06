const clampLatitude = (lat) => Math.min(Math.max(lat, -90), 90);
const clampLongitude = (lon) => Math.min(Math.max(lon, -180), 180);
