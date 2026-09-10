/**
 * OSRM Routing Service
 * Fetches real road driving coordinates and duration between two GPS points
 * using OpenStreetMap / OSRM API with automatic direct fallback.
 */

const routeCache = new Map();

/**
 * Fetch real driving route from start to end coordinates.
 * @param {[number, number]} start - [latitude, longitude]
 * @param {[number, number]} end - [latitude, longitude]
 * @returns {Promise<{coordinates: [number, number][], distanceKm: number, durationMinutes: number, isRoadNetwork: boolean}>}
 */
export async function getEvacuationRoute(start, end) {
  if (!start || !end || !start[0] || !start[1] || !end[0] || !end[1]) {
    return null;
  }

  const cacheKey = `${start[0].toFixed(4)},${start[1].toFixed(4)}_${end[0].toFixed(4)},${end[1].toFixed(4)}`;
  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey);
  }

  const startLat = start[0];
  const startLon = start[1];
  const endLat = end[0];
  const endLon = end[1];

  // Default fallback straight line
  const directDistanceKm = calculateHaversineKm(startLat, startLon, endLat, endLon);
  const fallbackResult = {
    coordinates: [start, end],
    distanceKm: parseFloat(directDistanceKm.toFixed(1)),
    durationMinutes: Math.max(5, Math.round((directDistanceKm / 35) * 60)), // ~35 km/h emergency speed
    isRoadNetwork: false,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 second timeout

    // OSRM expects coordinates in lon,lat order
    const url = `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`;
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      routeCache.set(cacheKey, fallbackResult);
      return fallbackResult;
    }

    const data = await response.json();
    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const primaryRoute = data.routes[0];
      // OSRM GeoJSON coordinates are [lon, lat], Leaflet needs [lat, lon]
      const leafletCoords = primaryRoute.geometry.coordinates.map(([lon, lat]) => [lat, lon]);
      const distanceKm = parseFloat((primaryRoute.distance / 1000).toFixed(1));
      const durationMinutes = Math.max(1, Math.round(primaryRoute.duration / 60));

      const result = {
        coordinates: leafletCoords,
        distanceKm,
        durationMinutes,
        isRoadNetwork: true,
      };

      routeCache.set(cacheKey, result);
      return result;
    }
  } catch {
    // Gracefully handle network timeouts or CORS issues
  }

  routeCache.set(cacheKey, fallbackResult);
  return fallbackResult;
}

function calculateHaversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
