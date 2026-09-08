/**
 * AI RESCUEFLOW SHADOW — Location Service
 * Offline deterministic reverse-geocoding engine.
 * Resolves GPS coordinates, vehicle heading, and timestamps into localized road and city information.
 * NO external APIs are used.
 * 
 * DISCLAIMER: SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED
 */

const KNOWN_CITIES = [
  { name: 'San Francisco', lat: 37.7749, lon: -122.4194, radiusKm: 15 },
  { name: 'Daly City', lat: 37.6879, lon: -122.4702, radiusKm: 10 },
  { name: 'Oakland', lat: 37.8044, lon: -122.2712, radiusKm: 15 },
  { name: 'Berkeley', lat: 37.8715, lon: -122.2730, radiusKm: 10 },
  { name: 'Palo Alto', lat: 37.4419, lon: -122.1430, radiusKm: 12 },
  { name: 'San Jose', lat: 37.3382, lon: -121.8863, radiusKm: 20 }
];

const KNOWN_ROADS = [
  { name: 'Market Street & 4th Ave', city: 'San Francisco', lat: 37.7858, lon: -122.4065, orientation: 45 },
  { name: 'Mission Street & 16th Intersection', city: 'San Francisco', lat: 37.7650, lon: -122.4197, orientation: 0 },
  { name: 'Van Ness Avenue & Geary Blvd', city: 'San Francisco', lat: 37.7850, lon: -122.4215, orientation: 0 },
  { name: 'Highway 101 Urban Corridor', city: 'San Francisco', lat: 37.7600, lon: -122.4050, orientation: 170 },
  { name: 'The Embarcadero & Ferry Plaza', city: 'San Francisco', lat: 37.7955, lon: -122.3937, orientation: 135 },
  { name: 'Grand Avenue & Broadway', city: 'Oakland', lat: 37.8100, lon: -122.2650, orientation: 90 },
  { name: 'Interstate 880 West Corridor', city: 'Oakland', lat: 37.7950, lon: -122.2750, orientation: 140 },
  { name: 'Santa Clara Street & 1st Ave', city: 'San Jose', lat: 37.3355, lon: -121.8905, orientation: 90 },
  { name: 'University Avenue & El Camino Real', city: 'Palo Alto', lat: 37.4430, lon: -122.1620, orientation: 45 }
];

function haversineDistKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getHeadingCardinal(heading) {
  if (heading == null || isNaN(heading)) return 'Unknown';
  const norm = ((Number(heading) % 360) + 360) % 360;
  if (norm >= 337.5 || norm < 22.5) return 'Northbound';
  if (norm >= 22.5 && norm < 67.5) return 'Northeast-bound';
  if (norm >= 67.5 && norm < 112.5) return 'Eastbound';
  if (norm >= 112.5 && norm < 157.5) return 'Southeast-bound';
  if (norm >= 157.5 && norm < 202.5) return 'Southbound';
  if (norm >= 202.5 && norm < 247.5) return 'Southwest-bound';
  if (norm >= 247.5 && norm < 292.5) return 'Westbound';
  return 'Northwest-bound';
}

/**
 * Resolves location details from coordinates, timestamp, and heading.
 * Supports both object parameter { latitude, longitude, timestamp, vehicleHeading }
 * and positional parameters (latitude, longitude, timestamp, vehicleHeading).
 */
export function resolveLocation(arg1, arg2, arg3, arg4) {
  let lat, lon, timestamp, vehicleHeading;

  if (typeof arg1 === 'object' && arg1 !== null) {
    lat = Number(arg1.latitude ?? arg1.lat ?? 37.7749);
    lon = Number(arg1.longitude ?? arg1.lon ?? -122.4194);
    timestamp = arg1.timestamp || new Date().toISOString();
    vehicleHeading = arg1['vehicle heading'] ?? arg1.vehicleHeading ?? arg1.heading ?? 0;
  } else {
    lat = Number(arg1 ?? 37.7749);
    lon = Number(arg2 ?? -122.4194);
    timestamp = arg3 || new Date().toISOString();
    vehicleHeading = arg4 ?? 0;
  }

  // 1. Identify nearest city
  let nearestCity = KNOWN_CITIES[0].name;
  let minCityDist = Infinity;
  for (const city of KNOWN_CITIES) {
    const d = haversineDistKm(lat, lon, city.lat, city.lon);
    if (d < minCityDist) {
      minCityDist = d;
      nearestCity = city.name;
    }
  }

  // 2. Identify nearest road segment
  let nearestRoad = KNOWN_ROADS[0].name;
  let minRoadDist = Infinity;
  for (const road of KNOWN_ROADS) {
    const d = haversineDistKm(lat, lon, road.lat, road.lon);
    if (d < minRoadDist) {
      minRoadDist = d;
      nearestRoad = road.name;
    }
  }

  // If point is far from curated road nodes, generate a localized grid road identifier
  let roadName = nearestRoad;
  let confidence = 0.95;

  if (minRoadDist > 1.5) {
    const latOffset = Math.round((lat - 37.77) * 1000) % 50;
    const lonOffset = Math.round((lon - -122.41) * 1000) % 50;
    const gridStreet = Math.abs(latOffset) + 1;
    const gridAvenue = Math.abs(lonOffset) + 1;
    roadName = `${nearestCity} Transit Corridor (Avenue ${gridAvenue} / Street ${gridStreet})`;
    confidence = Math.max(0.75, Number((0.95 - (minRoadDist - 1.5) * 0.02).toFixed(2)));
  } else {
    const cardinal = getHeadingCardinal(vehicleHeading);
    if (cardinal !== 'Unknown') {
      roadName = `${nearestRoad} (${cardinal})`;
    }
    confidence = Number((0.98 - Math.min(0.05, minRoadDist * 0.02)).toFixed(2));
  }

  const gpsString = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;

  return {
    GPS: gpsString,
    'nearest city': nearestCity,
    nearestCity, // camelCase alias
    'road name': roadName,
    roadName, // camelCase alias
    confidence,
    coordinates: {
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lon.toFixed(6))
    },
    timestamp: typeof timestamp === 'string' ? timestamp : new Date(timestamp).toISOString(),
    vehicleHeading: Number(vehicleHeading) || 0
  };
}

export default {
  resolveLocation
};
