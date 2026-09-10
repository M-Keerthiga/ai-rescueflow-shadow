/**
 * AI RESCUEFLOW SHADOW — Internal Video Library & Scenario Mapping
 * 
 * Replaces legacy CSV manifest with an internal project-stored video repository.
 * UI labels show strictly professional scenario IDs and location names.
 * Internal filenames (s1-s3, w1-w3, a1-a3) and category names (Safe, Warning, Accident)
 * are NEVER displayed in the dropdown or UI headers.
 */

export const INTERNAL_VIDEOS = [
  {
    clipId: 'TN-001',
    scenarioId: 'TN-001',
    label: 'TN-001 | Chennai Central Junction',
    location: 'Chennai Central Junction',
    sourceUrl: '/videos/s1.mp4',
    description: 'High-density urban multi-lane junction with synchronized signal controls and separated turning corridors.',
    telemetry: {
      vehicleA: { type: 'BUS #07', speed: 25, distance: 70, brakingCapability: 'good', reactionTime: 0.9, mass: 12000, heading: 'lane center' },
      vehicleB: { type: 'CAR #12', speed: 18, distance: 60, brakingCapability: 'good', reactionTime: 0.9, mass: 1400, heading: 'crossing lane' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'low', trafficSignal: 'green' }
    }
  },
  {
    clipId: 'TN-002',
    scenarioId: 'TN-002',
    label: 'TN-002 | Coimbatore Ring Road',
    location: 'Coimbatore Ring Road',
    sourceUrl: '/videos/s2.mp4',
    description: 'Perimeter arterial expressway with regulated lane discipline and ample inter-vehicle headway spacing.',
    telemetry: {
      vehicleA: { type: 'TRUCK #14', speed: 28, distance: 65, brakingCapability: 'good', reactionTime: 1.0, mass: 16000, heading: 'lane center' },
      vehicleB: { type: 'VAN #05', speed: 20, distance: 55, brakingCapability: 'good', reactionTime: 1.0, mass: 2200, heading: 'merging lane' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'moderate', trafficSignal: 'green' }
    }
  },
  {
    clipId: 'TN-003',
    scenarioId: 'TN-003',
    label: 'TN-003 | Madurai Railway Crossing',
    location: 'Madurai Railway Crossing',
    sourceUrl: '/videos/s3.mp4',
    description: 'Managed railway approach grade with automated boom barriers and low-speed regulated vehicle queues.',
    telemetry: {
      vehicleA: { type: 'BUS #09', speed: 22, distance: 60, brakingCapability: 'good', reactionTime: 1.0, mass: 12000, heading: 'straight' },
      vehicleB: { type: 'AUTO #03', speed: 15, distance: 50, brakingCapability: 'good', reactionTime: 1.0, mass: 750, heading: 'approach curb' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'moderate', trafficSignal: 'green' }
    }
  },
  {
    clipId: 'TN-004',
    scenarioId: 'TN-004',
    label: 'TN-004 | Salem Highway Junction',
    location: 'Salem Highway Junction',
    sourceUrl: '/videos/w1.mp4',
    description: 'Complex junction merge with approaching traffic closing headway distance under transitional yellow signal.',
    telemetry: {
      vehicleA: { type: 'BUS #11', speed: 36, distance: 35, brakingCapability: 'medium', reactionTime: 1.0, mass: 12000, heading: 'toward intersection' },
      vehicleB: { type: 'CAR #08', speed: 22, distance: 30, brakingCapability: 'medium', reactionTime: 1.0, mass: 1400, heading: 'crossing intersection' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'moderate', trafficSignal: 'yellow' }
    }
  },
  {
    clipId: 'TN-005',
    scenarioId: 'TN-005',
    label: 'TN-005 | Tiruchirappalli Signal Junction',
    location: 'Tiruchirappalli Signal Junction',
    sourceUrl: '/videos/w2.mp4',
    description: 'High-speed signalized intersection approach with tightening stopping distance margin and crossing traffic.',
    telemetry: {
      vehicleA: { type: 'BUS #16', speed: 38, distance: 36, brakingCapability: 'medium', reactionTime: 1.0, mass: 12000, heading: 'toward intersection' },
      vehicleB: { type: 'SUV #04', speed: 24, distance: 31, brakingCapability: 'medium', reactionTime: 1.0, mass: 2100, heading: 'perpendicular cross' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'moderate', trafficSignal: 'yellow' }
    }
  },
  {
    clipId: 'TN-006',
    scenarioId: 'TN-006',
    label: 'TN-006 | Tirunelveli Bypass',
    location: 'Tirunelveli Bypass',
    sourceUrl: '/videos/w3.mp4',
    description: 'Bypass corridor intersection with narrowing headway margins, requiring proactive collision avoidance advisory.',
    telemetry: {
      vehicleA: { type: 'TRUCK #22', speed: 37, distance: 34, brakingCapability: 'medium', reactionTime: 1.0, mass: 15000, heading: 'along bypass' },
      vehicleB: { type: 'CAR #19', speed: 23, distance: 29, brakingCapability: 'medium', reactionTime: 1.0, mass: 1350, heading: 'entry ramp' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'moderate', trafficSignal: 'yellow' }
    }
  },
  {
    clipId: 'TN-007',
    scenarioId: 'TN-007',
    label: 'TN-007 | Chennai Outer Ring Road',
    location: 'Chennai Outer Ring Road',
    sourceUrl: '/videos/a1.mp4',
    description: 'Severe high-speed perimeter highway impact with vehicle structural deformation and critical g-force telemetry.',
    telemetry: {
      vehicleA: { type: 'HEAVY TRUCK #02', speed: 58, distance: 20, brakingCapability: 'medium', reactionTime: 1.2, mass: 16000, heading: 'high speed straight' },
      vehicleB: { type: 'SEDAN #15', speed: 28, distance: 16, brakingCapability: 'medium', reactionTime: 1.0, mass: 1400, heading: 'orthogonal conflict' },
      environment: { roadCondition: 'wet', visibility: 'moderate', trafficDensity: 'moderate', trafficSignal: 'yellow' }
    }
  },
  {
    clipId: 'TN-008',
    scenarioId: 'TN-008',
    label: 'TN-008 | Virudhunagar Highway',
    location: 'Virudhunagar Highway',
    sourceUrl: '/videos/a2.mp4',
    description: 'Critical highway collision with high kinetic energy transfer, vehicle rollover kinematics, and severe deformation.',
    telemetry: {
      vehicleA: { type: 'INTERCITY BUS #04', speed: 65, distance: 18, brakingCapability: 'medium', reactionTime: 1.2, mass: 13500, heading: 'toward conflict zone' },
      vehicleB: { type: 'HATCHBACK #09', speed: 22, distance: 14, brakingCapability: 'medium', reactionTime: 1.0, mass: 1100, heading: 'crossing highway' },
      environment: { roadCondition: 'wet', visibility: 'poor', trafficDensity: 'high', trafficSignal: 'yellow' }
    }
  },
  {
    clipId: 'TN-009',
    scenarioId: 'TN-009',
    label: 'TN-009 | Coimbatore Flyover',
    location: 'Coimbatore Flyover',
    sourceUrl: '/videos/a3.mp4',
    description: 'Catastrophic elevated flyover collision with barrier impact, structural crushing, and immediate multi-agency emergency trigger.',
    telemetry: {
      vehicleA: { type: 'COMMERCIAL TRUCK #08', speed: 70, distance: 15, brakingCapability: 'medium', reactionTime: 1.3, mass: 18000, heading: 'flyover gradient' },
      vehicleB: { type: 'SEDAN #21', speed: 20, distance: 12, brakingCapability: 'medium', reactionTime: 1.0, mass: 1450, heading: 'decelerating lane' },
      environment: { roadCondition: 'wet', visibility: 'poor', trafficDensity: 'high', trafficSignal: 'yellow' }
    }
  }
];

export const DEFAULT_SCENARIO = INTERNAL_VIDEOS[0];
