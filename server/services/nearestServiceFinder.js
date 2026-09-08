/**
 * AI RESCUEFLOW SHADOW — Nearest Service Finder
 * Computes Haversine distances to locate the nearest emergency facilities (hospital & police station).
 * Computes realistic emergency response ETAs based on distance and emergency transit dynamics.
 * 
 * DISCLAIMER: SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hospitalsPath = path.join(__dirname, '../data/hospitals.json');
const policeStationsPath = path.join(__dirname, '../data/policeStations.json');

function loadJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading ${filePath}:`, err);
    return [];
  }
}

/**
 * Computes Great-Circle Haversine distance between two coordinates in kilometers.
 */
export function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

/**
 * Calculates Estimated Time of Arrival (ETA) in minutes.
 * Assumes emergency response vehicle average urban speed of 48 km/h + 1.5 min dispatch delay.
 */
export function calculateETA(distanceKm, speedKmH = 48) {
  const transitMinutes = (distanceKm / speedKmH) * 60;
  const dispatchDelayMinutes = 1.5;
  const totalMinutes = Math.max(2, Math.round(transitMinutes + dispatchDelayMinutes));
  return totalMinutes;
}

/**
 * Finds the nearest hospital and police station from a coordinate point.
 * @param {Object|number} latOrCoords - { latitude, longitude } or latitude number
 * @param {number} [longitude] - Longitude number if first arg is latitude
 */
export function findNearestServices(latOrCoords, longitude) {
  let lat, lon;
  if (typeof latOrCoords === 'object' && latOrCoords !== null) {
    lat = Number(latOrCoords.latitude ?? latOrCoords.lat);
    lon = Number(latOrCoords.longitude ?? latOrCoords.lon);
  } else {
    lat = Number(latOrCoords);
    lon = Number(longitude);
  }

  const hospitals = loadJson(hospitalsPath);
  const policeStations = loadJson(policeStationsPath);

  // Find nearest hospital
  let nearestHosp = null;
  let minHospDist = Infinity;

  for (const h of hospitals) {
    const dist = haversineDistanceKm(lat, lon, h.latitude, h.longitude);
    if (dist < minHospDist) {
      minHospDist = dist;
      nearestHosp = { ...h, distanceKm: dist, etaMinutes: calculateETA(dist) };
    }
  }

  // Find nearest police station
  let nearestPolice = null;
  let minPoliceDist = Infinity;

  for (const p of policeStations) {
    const dist = haversineDistanceKm(lat, lon, p.latitude, p.longitude);
    if (dist < minPoliceDist) {
      minPoliceDist = dist;
      nearestPolice = { ...p, distanceKm: dist, etaMinutes: calculateETA(dist) };
    }
  }

  const primaryDistance = minHospDist !== Infinity ? minHospDist : minPoliceDist;
  const primaryETA = nearestHosp ? nearestHosp.etaMinutes : (nearestPolice ? nearestPolice.etaMinutes : 4);
  const primaryAvailability = nearestHosp?.availability || 'AVAILABLE';
  const primaryPriority = nearestHosp?.priority || 'HIGH';

  return {
    'nearest hospital': nearestHosp,
    'nearest police station': nearestPolice,
    nearestHospital: nearestHosp, // camelCase alias
    nearestPoliceStation: nearestPolice, // camelCase alias
    distance: primaryDistance,
    ETA: primaryETA,
    availability: primaryAvailability,
    priority: primaryPriority,
    hospitalDistanceKm: minHospDist,
    hospitalEtaMinutes: nearestHosp ? nearestHosp.etaMinutes : 4,
    policeDistanceKm: minPoliceDist,
    policeEtaMinutes: nearestPolice ? nearestPolice.etaMinutes : 3,
    simulationDisclaimer: 'SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED'
  };
}

export default {
  haversineDistanceKm,
  calculateETA,
  findNearestServices
};
