/**
 * AI RESCUEFLOW SHADOW — 28 Video Dataset Manifest & Telemetry Profiles
 * Extracted from ml/datasets/manifest.csv
 * Maps each clip to its scenario, state, location, telemetry, video timestamps, and risk expectations.
 */

export const MANIFEST_VIDEOS = [
  // =========================================================================
  // 1. SAFE SCENARIOS (TN-S01 -> TN-S12)
  // =========================================================================
  {
    clipId: 'TN-S01',
    state: 'SAFE',
    scenario: 'Tamil Nadu highway traffic',
    location: 'Tamil Nadu Highway (NH 44)',
    category: 'SAFE',
    videoTime: 2,
    sourceUrl: 'https://www.pexels.com/video/aerial-view-of-busy-indian-national-highway-31995845/',
    sourceType: 'Pexels / Aerial Highway',
    description: 'Smooth aerial highway flow with ample following distance (>60m) and normal cruising speeds.',
    telemetry: {
      vehicleA: { type: 'BUS #7', speed: 28, distance: 68, brakingCapability: 'good', heading: 'lane center' },
      vehicleB: { type: 'CAR #12', speed: 25, distance: 58, brakingCapability: 'good', heading: 'lane center' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'moderate', trafficSignal: 'green' }
    }
  },
  {
    clipId: 'TN-S02',
    state: 'SAFE',
    scenario: 'Chennai urban streets',
    location: 'Anna Salai, Chennai',
    category: 'SAFE',
    videoTime: 5,
    sourceUrl: 'https://www.pexels.com/video/urban-streetscape-in-chennai-india-29980781/',
    sourceType: 'Pexels / Urban Streetscape',
    description: 'Regulated urban multi-lane street traffic with synchronized signals and safe pedestrian clearance.',
    telemetry: {
      vehicleA: { type: 'BUS #7', speed: 22, distance: 55, brakingCapability: 'good', heading: 'along corridor' },
      vehicleB: { type: 'AUTO #03', speed: 18, distance: 48, brakingCapability: 'good', heading: 'along corridor' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'moderate', trafficSignal: 'green' }
    }
  },
  {
    clipId: 'TN-S03',
    state: 'SAFE',
    scenario: 'Tamil Nadu busy street',
    location: 'Madurai Central Market Road',
    category: 'SAFE',
    videoTime: 8,
    sourceUrl: 'https://www.pexels.com/video/bustling-street-life-in-tamil-nadu-32707438/',
    sourceType: 'Pexels / Street Life',
    description: 'Low-speed mixed traffic (auto-rickshaws, bikes, pedestrians) moving smoothly without conflict.',
    telemetry: {
      vehicleA: { type: 'BUS #7', speed: 18, distance: 50, brakingCapability: 'good', heading: 'straight' },
      vehicleB: { type: 'BIKE #09', speed: 15, distance: 42, brakingCapability: 'good', heading: 'straight' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'high', trafficSignal: 'green' }
    }
  },
  {
    clipId: 'TN-S04',
    state: 'SAFE',
    scenario: 'Chennai traffic / urban road',
    location: 'OMR Expressway, Chennai',
    category: 'SAFE',
    videoTime: 11,
    sourceUrl: 'https://www.pexels.com/video/bustling-city-traffic-on-busy-urban-road-32034252/',
    sourceType: 'Pexels / Urban Road',
    description: 'Multi-vehicle orderly transit on IT expressway with adequate headway.',
    telemetry: {
      vehicleA: { type: 'BUS #7', speed: 32, distance: 62, brakingCapability: 'good', heading: 'straight' },
      vehicleB: { type: 'CAR #12', speed: 30, distance: 54, brakingCapability: 'good', heading: 'straight' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'moderate', trafficSignal: 'green' }
    }
  },
  {
    clipId: 'TN-S05',
    state: 'SAFE',
    scenario: 'South India rainy urban street',
    location: 'Coimbatore Town Hall',
    category: 'SAFE',
    videoTime: 14,
    sourceUrl: 'https://www.pexels.com/video/boy-walking-in-the-rain-18293121/',
    sourceType: 'Pexels / Rainy Street',
    description: 'Rainy asphalt road with drivers maintaining defensive gap and lower speed limits.',
    telemetry: {
      vehicleA: { type: 'BUS #7', speed: 20, distance: 58, brakingCapability: 'good', heading: 'straight' },
      vehicleB: { type: 'CAR #12', speed: 18, distance: 50, brakingCapability: 'good', heading: 'straight' },
      environment: { roadCondition: 'wet', visibility: 'moderate', trafficDensity: 'moderate', trafficSignal: 'green' }
    }
  },
  {
    clipId: 'TN-S06',
    state: 'SAFE',
    scenario: 'India crossroads traffic',
    location: 'Salem Junction Crossroad',
    category: 'SAFE',
    videoTime: 17,
    sourceUrl: 'https://pixabay.com/videos/india-crossroads-traffic-busy-road-8698/',
    sourceType: 'Pixabay / Crossroads',
    description: 'Four-way crossroad intersection with orderly turning movements and green light clearance.',
    telemetry: {
      vehicleA: { type: 'BUS #7', speed: 16, distance: 52, brakingCapability: 'good', heading: 'turning left' },
      vehicleB: { type: 'CAR #12', speed: 14, distance: 46, brakingCapability: 'good', heading: 'straight' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'moderate', trafficSignal: 'green' }
    }
  },
  {
    clipId: 'TN-S07',
    state: 'SAFE',
    scenario: 'Chennai city traffic pool',
    location: 'T. Nagar, Chennai',
    category: 'SAFE',
    videoTime: 20,
    sourceUrl: 'https://pixabay.com/videos/search/chennai%20city/',
    sourceType: 'Pixabay / City Pool',
    description: 'Commercial zone road transit with commercial vehicles moving steadily at 20 km/h.',
    telemetry: {
      vehicleA: { type: 'BUS #7', speed: 20, distance: 48, brakingCapability: 'good', heading: 'straight' },
      vehicleB: { type: 'AUTO #03', speed: 16, distance: 40, brakingCapability: 'good', heading: 'straight' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'high', trafficSignal: 'green' }
    }
  },
  {
    clipId: 'TN-S08',
    state: 'SAFE',
    scenario: 'Chennai Smart City traffic pool',
    location: 'Guindy Smart Corridor, Chennai',
    category: 'SAFE',
    videoTime: 23,
    sourceUrl: 'https://pixabay.com/videos/search/chennai%20smart%20city/',
    sourceType: 'Pixabay / Smart City',
    description: 'Smart city arterial road with automated signal timing and free traffic flow.',
    telemetry: {
      vehicleA: { type: 'BUS #7', speed: 25, distance: 56, brakingCapability: 'good', heading: 'straight' },
      vehicleB: { type: 'CAR #12', speed: 24, distance: 50, brakingCapability: 'good', heading: 'straight' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'moderate', trafficSignal: 'green' }
    }
  },
  {
    clipId: 'TN-S09',
    state: 'SAFE',
    scenario: 'Tamil Nadu / India traffic pool',
    location: 'Trichy Main Road',
    category: 'SAFE',
    videoTime: 26,
    sourceUrl: 'https://pixabay.com/videos/search/india%20traffic/',
    sourceType: 'Pixabay / Regional Corridor',
    description: 'Inter-district highway transit with low collision probability.',
    telemetry: {
      vehicleA: { type: 'BUS #7', speed: 30, distance: 65, brakingCapability: 'good', heading: 'straight' },
      vehicleB: { type: 'TRUCK #05', speed: 28, distance: 60, brakingCapability: 'good', heading: 'straight' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'low', trafficSignal: 'green' }
    }
  },
  {
    clipId: 'TN-S10',
    state: 'SAFE',
    scenario: 'Indian road traffic pool',
    location: 'Vellore Ring Road',
    category: 'SAFE',
    videoTime: 29,
    sourceUrl: 'https://pixabay.com/videos/search/indian%20road%20traffic/',
    sourceType: 'Pixabay / Multi-Vehicle Pool',
    description: 'Multi-vehicle road transit with buses and cars holding proper safety buffers.',
    telemetry: {
      vehicleA: { type: 'BUS #7', speed: 26, distance: 60, brakingCapability: 'good', heading: 'straight' },
      vehicleB: { type: 'CAR #12', speed: 22, distance: 52, brakingCapability: 'good', heading: 'straight' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'moderate', trafficSignal: 'green' }
    }
  },
  {
    clipId: 'TN-S11',
    state: 'SAFE',
    scenario: 'Indian roads pool',
    location: 'Erode Outer Bypass',
    category: 'SAFE',
    videoTime: 32,
    sourceUrl: 'https://pixabay.com/videos/search/indian%20roads/',
    sourceType: 'Pixabay / Bypass Road',
    description: 'Bypass corridor with clear visibility and wide shoulders.',
    telemetry: {
      vehicleA: { type: 'BUS #7', speed: 34, distance: 70, brakingCapability: 'good', heading: 'straight' },
      vehicleB: { type: 'CAR #12', speed: 30, distance: 64, brakingCapability: 'good', heading: 'straight' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'low', trafficSignal: 'green' }
    }
  },
  {
    clipId: 'TN-S12',
    state: 'SAFE',
    scenario: 'India traffic pool',
    location: 'Tirunelveli Bypass',
    category: 'SAFE',
    videoTime: 35,
    sourceUrl: 'https://www.pexels.com/search/videos/india%20traffic/',
    sourceType: 'Pexels / Intersection Pool',
    description: 'Uncongested intersection with clear lines of sight across all approaches.',
    telemetry: {
      vehicleA: { type: 'BUS #7', speed: 24, distance: 58, brakingCapability: 'good', heading: 'straight' },
      vehicleB: { type: 'BIKE #09', speed: 20, distance: 50, brakingCapability: 'good', heading: 'straight' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'low', trafficSignal: 'green' }
    }
  },

  // =========================================================================
  // 2. WARNING SCENARIOS (TN-W01 -> TN-W04)
  // =========================================================================
  {
    clipId: 'TN-W01',
    state: 'WARNING',
    scenario: 'Chennai traffic — close approach candidate',
    location: 'Mount Road, Chennai',
    category: 'WARNING',
    videoTime: 38,
    sourceUrl: 'https://www.pexels.com/video/bustling-city-traffic-on-busy-urban-road-32034252/',
    sourceType: 'Pexels / Close Approach',
    description: 'Vehicle closing headway rapidly toward 32m; yellow light transition requires caution alert.',
    telemetry: {
      vehicleA: { type: 'BUS #7', speed: 38, distance: 35, brakingCapability: 'medium', heading: 'toward intersection' },
      vehicleB: { type: 'CAR #12', speed: 30, distance: 30, brakingCapability: 'medium', heading: 'crossing intersection' },
      environment: { roadCondition: 'wet', visibility: 'moderate', trafficDensity: 'high', trafficSignal: 'yellow' }
    }
  },
  {
    clipId: 'TN-W02',
    state: 'WARNING',
    scenario: 'Tamil Nadu highway — merge/approach candidate',
    location: 'NH 45 Chengalpattu Toll Approach',
    category: 'WARNING',
    videoTime: 41,
    sourceUrl: 'https://www.pexels.com/video/aerial-view-of-busy-indian-national-highway-31995845/',
    sourceType: 'Pexels / Merging Flow',
    description: 'Converging traffic lanes with lateral gap narrowing and speed differential.',
    telemetry: {
      vehicleA: { type: 'BUS #7', speed: 40, distance: 36, brakingCapability: 'medium', heading: 'merging right' },
      vehicleB: { type: 'CAR #12', speed: 32, distance: 32, brakingCapability: 'medium', heading: 'merging left' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'high', trafficSignal: 'yellow' }
    }
  },
  {
    clipId: 'TN-W03',
    state: 'WARNING',
    scenario: 'India crossroads — approach candidate',
    location: 'Tiruppur Textile Junction',
    category: 'WARNING',
    videoTime: 44,
    sourceUrl: 'https://pixabay.com/videos/india-crossroads-traffic-busy-road-8698/',
    sourceType: 'Pixabay / Crossroads Approach',
    description: 'Crossroad approach where vehicle B enters conflict box on amber light.',
    telemetry: {
      vehicleA: { type: 'BUS #7', speed: 36, distance: 34, brakingCapability: 'medium', heading: 'toward intersection' },
      vehicleB: { type: 'CAR #12', speed: 26, distance: 28, brakingCapability: 'medium', heading: 'crossing intersection' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'moderate', trafficSignal: 'yellow' }
    }
  },
  {
    clipId: 'TN-W04',
    state: 'WARNING',
    scenario: 'Rainy South India traffic — reduced visibility',
    location: 'Kodaikanal Ghat Approach',
    category: 'WARNING',
    videoTime: 47,
    sourceUrl: 'https://www.pexels.com/video/boy-walking-in-the-rain-18293121/',
    sourceType: 'Pexels / Rainy Ghat Road',
    description: 'Heavy rainfall and reduced tire grip increasing required braking distance.',
    telemetry: {
      vehicleA: { type: 'BUS #7', speed: 35, distance: 38, brakingCapability: 'poor', heading: 'curving road' },
      vehicleB: { type: 'CAR #12', speed: 28, distance: 34, brakingCapability: 'medium', heading: 'curving road' },
      environment: { roadCondition: 'wet', visibility: 'poor', trafficDensity: 'moderate', trafficSignal: 'yellow' }
    }
  },

  // =========================================================================
  // 3. CRITICAL SCENARIOS (TN-C01 -> TN-C04)
  // =========================================================================
  {
    clipId: 'TN-C01',
    state: 'CRITICAL',
    scenario: 'Chennai traffic — dangerous interaction candidate',
    location: 'Koyambedu Roundabout, Chennai',
    category: 'CRITICAL',
    videoTime: 50,
    sourceUrl: 'https://www.pexels.com/video/bustling-city-traffic-on-busy-urban-road-32034252/',
    sourceType: 'Pexels / Dangerous Interaction',
    description: 'Sudden deceleration by lead vehicle with tailgating bus; immediate dual alert required.',
    telemetry: {
      vehicleA: { type: 'BUS #7', speed: 46, distance: 24, brakingCapability: 'poor', heading: 'toward intersection' },
      vehicleB: { type: 'CAR #12', speed: 12, distance: 16, brakingCapability: 'medium', heading: 'crossing intersection' },
      environment: { roadCondition: 'wet', visibility: 'moderate', trafficDensity: 'high', trafficSignal: 'yellow' }
    }
  },
  {
    clipId: 'TN-C02',
    state: 'CRITICAL',
    scenario: 'Tamil Nadu highway — high-risk convergence candidate',
    location: 'Krishnagiri Highway Merge',
    category: 'CRITICAL',
    videoTime: 53,
    sourceUrl: 'https://www.pexels.com/video/aerial-view-of-busy-indian-national-highway-31995845/',
    sourceType: 'Pexels / High-Risk Merge',
    description: 'Conflicting trajectories with TTC dropping under 2.0 seconds.',
    telemetry: {
      vehicleA: { type: 'BUS #7', speed: 48, distance: 22, brakingCapability: 'medium', heading: 'toward intersection' },
      vehicleB: { type: 'CAR #12', speed: 18, distance: 15, brakingCapability: 'medium', heading: 'crossing intersection' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'high', trafficSignal: 'yellow' }
    }
  },
  {
    clipId: 'TN-C03',
    state: 'CRITICAL',
    scenario: 'Thoppur pre-collision sequence',
    location: 'Thoppur Ghat, Dharmapuri',
    category: 'CRITICAL',
    videoTime: 56,
    sourceUrl: 'https://www.ndtv.com/video/4-killed-in-freak-vehicle-collision-in-tamil-nadu-cctv-captures-horror-756268',
    sourceType: 'NDTV CCTV / Pre-Collision Sequence',
    description: 'Steep downhill gradient; heavy bus approaching stopped queue with degraded braking.',
    telemetry: {
      vehicleA: { type: 'BUS #7', speed: 52, distance: 20, brakingCapability: 'poor', heading: 'downhill incline' },
      vehicleB: { type: 'CAR #12', speed: 10, distance: 14, brakingCapability: 'medium', heading: 'stationary queue' },
      environment: { roadCondition: 'wet', visibility: 'poor', trafficDensity: 'high', trafficSignal: 'red' }
    }
  },
  {
    clipId: 'TN-C04',
    state: 'CRITICAL',
    scenario: 'Virudhunagar–Madurai SUV approach',
    location: 'Virudhunagar–Madurai NH 44',
    category: 'CRITICAL',
    videoTime: 59,
    sourceUrl: 'https://www.ndtv.com/video/video-suv-flips-after-hitting-divider-at-high-speed-in-tamil-nadu-5-dead-775203',
    sourceType: 'NDTV CCTV / High Speed Approach',
    description: 'High velocity SUV approaching intersection divider with two-wheeler on left flank.',
    telemetry: {
      vehicleA: { type: 'SUV #04', speed: 54, distance: 18, brakingCapability: 'medium', heading: 'high-speed approach' },
      vehicleB: { type: 'BIKE #09', speed: 14, distance: 12, brakingCapability: 'good', heading: 'crossing lane' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'moderate', trafficSignal: 'yellow' }
    }
  },

  // =========================================================================
  // 4. ACCIDENT SCENARIOS (TN-A01 -> TN-A04)
  // =========================================================================
  {
    clipId: 'TN-A01',
    state: 'ACCIDENT',
    scenario: 'Thoppur Ghat four-vehicle collision',
    location: 'Thoppur Ghat, Dharmapuri, Tamil Nadu',
    category: 'HIGH',
    videoTime: 62,
    sourceUrl: 'https://www.ndtv.com/video/4-killed-in-freak-vehicle-collision-in-tamil-nadu-cctv-captures-horror-756268',
    sourceType: 'NDTV News / Multi-Vehicle Impact',
    description: 'Truck-into-truck rear collision causing chain reaction with car and bus.',
    telemetry: {
      vehicleA: { type: 'BUS #7', speed: 42, distance: 10, brakingCapability: 'poor', heading: 'collision course' },
      vehicleB: { type: 'TRUCK #05', speed: 0, distance: 8, brakingCapability: 'poor', heading: 'impact node' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'high', trafficSignal: 'red' }
    }
  },
  {
    clipId: 'TN-A02',
    state: 'ACCIDENT',
    scenario: 'Rameswaram auto collision',
    location: 'Rameswaram Temple Complex Road',
    category: 'MODERATE',
    videoTime: 65,
    sourceUrl: 'https://www.ndtv.com/video/tamil-nadu-news-auto-rams-into-complex-pillar-in-rameswaram-871847',
    sourceType: 'NDTV CCTV / Pillar Impact',
    description: 'Auto-rickshaw structural collision with commercial building pillar.',
    telemetry: {
      vehicleA: { type: 'AUTO #03', speed: 32, distance: 6, brakingCapability: 'medium', heading: 'curb deviation' },
      vehicleB: { type: 'PILLAR #01', speed: 0, distance: 4, brakingCapability: 'good', heading: 'fixed obstacle' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'moderate', trafficSignal: 'none' }
    }
  },
  {
    clipId: 'TN-A03',
    state: 'ACCIDENT',
    scenario: 'Virudhunagar–Madurai SUV crash',
    location: 'Virudhunagar Highway, Tamil Nadu',
    category: 'HIGH',
    videoTime: 68,
    sourceUrl: 'https://www.ndtv.com/video/video-suv-flips-after-hitting-divider-at-high-speed-in-tamil-nadu-5-dead-775203',
    sourceType: 'NDTV CCTV / Divider Crash',
    description: 'SUV impact with highway median divider causing secondary rollover.',
    telemetry: {
      vehicleA: { type: 'SUV #04', speed: 50, distance: 8, brakingCapability: 'poor', heading: 'median contact' },
      vehicleB: { type: 'MEDIAN #02', speed: 0, distance: 5, brakingCapability: 'good', heading: 'divider barrier' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'low', trafficSignal: 'none' }
    }
  },
  {
    clipId: 'TN-A04',
    state: 'ACCIDENT',
    scenario: 'Chennai car accident CCTV',
    location: 'Poonamallee High Road, Chennai',
    category: 'HIGH',
    videoTime: 70,
    sourceUrl: 'https://www.youtube.com/watch?v=0_u04yBX1vA',
    sourceType: 'Thanthi TV / Urban CCTV Collision',
    description: 'Intersection T-bone collision between sedan and city bus.',
    telemetry: {
      vehicleA: { type: 'BUS #7', speed: 44, distance: 12, brakingCapability: 'medium', heading: 'perpendicular impact' },
      vehicleB: { type: 'CAR #12', speed: 28, distance: 10, brakingCapability: 'medium', heading: 'intersection center' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'high', trafficSignal: 'red' }
    }
  },

  // =========================================================================
  // 5. EMERGENCY SCENARIOS (TN-E01 -> TN-E04)
  // =========================================================================
  {
    clipId: 'TN-E01',
    state: 'EMERGENCY',
    scenario: 'Thoppur severe multi-vehicle crash',
    location: 'Thoppur Ghat, Dharmapuri, Tamil Nadu',
    category: 'CATASTROPHIC',
    videoTime: 72,
    sourceUrl: 'https://www.ndtv.com/video/4-killed-in-freak-vehicle-collision-in-tamil-nadu-cctv-captures-horror-756268',
    sourceType: 'NDTV CCTV / Severe Aftermath',
    description: 'Severe multi-vehicle crush on mountain pass. Requires Immediate Highest Priority Code-3 Emergency dispatch.',
    telemetry: {
      vehicleA: { type: 'BUS #7', speed: 48, distance: 5, brakingCapability: 'poor', heading: 'crush zone' },
      vehicleB: { type: 'TRUCK #05', speed: 0, distance: 3, brakingCapability: 'poor', heading: 'pileup node' },
      environment: { roadCondition: 'wet', visibility: 'poor', trafficDensity: 'high', trafficSignal: 'red' }
    }
  },
  {
    clipId: 'TN-E02',
    state: 'EMERGENCY',
    scenario: 'Virudhunagar–Madurai severe SUV rollover',
    location: 'Virudhunagar Highway, Tamil Nadu',
    category: 'CRITICAL',
    videoTime: 73,
    sourceUrl: 'https://www.ndtv.com/video/video-suv-flips-after-hitting-divider-at-high-speed-in-tamil-nadu-5-dead-775203',
    sourceType: 'NDTV CCTV / High Impact Rollover',
    description: 'High kinetic rollover with passenger compartment compromise; immediate trauma response triggered.',
    telemetry: {
      vehicleA: { type: 'SUV #04', speed: 56, distance: 4, brakingCapability: 'poor', heading: 'rollover trajectory' },
      vehicleB: { type: 'MEDIAN #02', speed: 0, distance: 2, brakingCapability: 'good', heading: 'barrier' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'low', trafficSignal: 'none' }
    }
  },
  {
    clipId: 'TN-E03',
    state: 'EMERGENCY',
    scenario: 'Rameswaram auto crash aftermath',
    location: 'Rameswaram Temple Area, Tamil Nadu',
    category: 'MODERATE',
    videoTime: 74,
    sourceUrl: 'https://www.ndtv.com/video/tamil-nadu-news-auto-rams-into-complex-pillar-in-rameswaram-871847',
    sourceType: 'NDTV CCTV / Emergency Aftermath',
    description: 'Auto passenger extrication and hospital triage dispatch for injured occupants.',
    telemetry: {
      vehicleA: { type: 'AUTO #03', speed: 28, distance: 4, brakingCapability: 'medium', heading: 'post-impact' },
      vehicleB: { type: 'PILLAR #01', speed: 0, distance: 2, brakingCapability: 'good', heading: 'post-impact' },
      environment: { roadCondition: 'dry', visibility: 'good', trafficDensity: 'moderate', trafficSignal: 'none' }
    }
  },
  {
    clipId: 'TN-E04',
    state: 'EMERGENCY',
    scenario: 'Chennai car-fire/accident CCTV candidate',
    location: 'GST Road, Chennai, Tamil Nadu',
    category: 'CRITICAL',
    videoTime: 75,
    sourceUrl: 'https://www.youtube.com/watch?v=EhaJC6ue_u8',
    sourceType: 'YouTube / Emergency Response Event',
    description: 'Vehicle fire post-collision; immediate multi-agency response (Fire, Trauma Hospital, Municipal Police).',
    telemetry: {
      vehicleA: { type: 'CAR #12', speed: 45, distance: 5, brakingCapability: 'poor', heading: 'fire hazard zone' },
      vehicleB: { type: 'BUS #7', speed: 0, distance: 3, brakingCapability: 'medium', heading: 'impact point' },
      environment: { roadCondition: 'dry', visibility: 'moderate', trafficDensity: 'high', trafficSignal: 'red' }
    }
  }
];

export const VIDEO_STATE_GROUPS = [
  { state: 'SAFE', color: 'emerald', label: 'SAFE (12 Videos)', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
  { state: 'WARNING', color: 'amber', label: 'WARNING (4 Videos)', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
  { state: 'CRITICAL', color: 'orange', label: 'CRITICAL (4 Videos)', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/40' },
  { state: 'ACCIDENT', color: 'rose', label: 'ACCIDENT (4 Videos)', badge: 'bg-rose-500/20 text-rose-400 border-rose-500/40' },
  { state: 'EMERGENCY', color: 'red', label: 'EMERGENCY (4 Videos)', badge: 'bg-red-500/20 text-red-400 border-red-500/40' }
];
