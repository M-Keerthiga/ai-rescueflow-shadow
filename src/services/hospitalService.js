/**
 * AI RESCUEFLOW SHADOW — Hospital Availability & Ambulance Dispatch Service
 * 
 * Reuses existing backend emergency data while tailoring nearest hospital
 * selection to incident accident locations across Tamil Nadu corridors.
 * 
 * Sort Priority Rule:
 * 1. Distance from accident (closest first)
 * 2. Emergency bed availability (highest available first)
 * 3. ICU bed availability (highest available first)
 * 
 * SIMULATION DISCLAIMER: SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED
 */

export const SIMULATION_DISCLAIMER = 'SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED';

export const REGIONAL_HOSPITALS_DATABASE = [
  // Chennai Central Junction
  {
    id: 'HOSP-CHN-01',
    name: 'Rajiv Gandhi Government General Hospital',
    locationMatch: ['Chennai Central', 'Chennai Central Junction', 'Central', 'Chennai'],
    address: 'EVR Periyar Salai, Park Town, Chennai, Tamil Nadu 600003',
    city: 'Chennai',
    distanceKm: 1.4,
    etaMinutes: 3,
    emergencyBeds: 14,
    icuBeds: 6,
    totalBeds: 150,
    traumaLevel: 'LEVEL_1_TRAUMA',
    phone: '+91-44-2530-5000',
    emergencyContact: '108 / Trauma Intake Bay 2',
    ambulanceFleet: ['TN-108-ALS-01', 'TN-108-TRAUMA-02', 'TN-108-EMS-03'],
    waypoints: [
      { name: 'Park Town Hospital Dispatch Bay', progress: 0 },
      { name: 'Poonamallee High Road Flyover', progress: 25 },
      { name: 'Chennai Central Station South Gate', progress: 55 },
      { name: 'EVR Periyar Junction Approach', progress: 80 },
      { name: 'Accident Scene (Chennai Central Junction)', progress: 100 }
    ]
  },
  {
    id: 'HOSP-CHN-02',
    name: 'Apollo Hospitals Greams Road',
    locationMatch: ['Chennai Central', 'Chennai Central Junction', 'Chennai'],
    address: '21 Greams Lane, Thousand Lights, Chennai, Tamil Nadu 600006',
    city: 'Chennai',
    distanceKm: 3.2,
    etaMinutes: 6,
    emergencyBeds: 18,
    icuBeds: 9,
    totalBeds: 120,
    traumaLevel: 'LEVEL_1_TRAUMA',
    phone: '+91-44-2829-0200',
    emergencyContact: '1066 / Apollo Emergency Command',
    ambulanceFleet: ['APOLLO-ALS-09', 'APOLLO-CRIT-04'],
    waypoints: [
      { name: 'Apollo Greams Bay', progress: 0 },
      { name: 'Anna Salai Arterial Corridor', progress: 30 },
      { name: 'Wellingdon Bridge Crossing', progress: 65 },
      { name: 'Park Town Sector', progress: 85 },
      { name: 'Accident Scene (Chennai Central Junction)', progress: 100 }
    ]
  },
  {
    id: 'HOSP-CHN-03',
    name: 'Government Stanley Medical College Hospital',
    locationMatch: ['Chennai Central', 'Chennai Central Junction', 'Chennai'],
    address: '1 Old Jail Road, Royapuram, Chennai, Tamil Nadu 600001',
    city: 'Chennai',
    distanceKm: 3.8,
    etaMinutes: 7,
    emergencyBeds: 10,
    icuBeds: 4,
    totalBeds: 110,
    traumaLevel: 'LEVEL_1_TRAUMA',
    phone: '+91-44-2528-1351',
    emergencyContact: '108 Stanley Emergency Wing',
    ambulanceFleet: ['TN-108-STANLEY-01', 'TN-108-STANLEY-02'],
    waypoints: [
      { name: 'Stanley Trauma Bay', progress: 0 },
      { name: 'Royapuram Overbridge', progress: 35 },
      { name: 'Wall Tax Road Corridor', progress: 70 },
      { name: 'Accident Scene (Chennai Central Junction)', progress: 100 }
    ]
  },

  // Coimbatore Ring Road / Coimbatore Flyover
  {
    id: 'HOSP-CBE-01',
    name: 'Coimbatore Medical College Hospital (CMCH)',
    locationMatch: ['Coimbatore Ring Road', 'Coimbatore Flyover', 'Coimbatore'],
    address: 'Trichy Road, Gopalapuram, Coimbatore, Tamil Nadu 641018',
    city: 'Coimbatore',
    distanceKm: 2.1,
    etaMinutes: 4,
    emergencyBeds: 15,
    icuBeds: 6,
    totalBeds: 180,
    traumaLevel: 'LEVEL_1_TRAUMA',
    phone: '+91-422-230-1393',
    emergencyContact: '108 CMCH Trauma Unit',
    ambulanceFleet: ['TN-108-CBE-01', 'TN-108-CBE-02'],
    waypoints: [
      { name: 'CMCH Emergency Dispatch Bay', progress: 0 },
      { name: 'Trichy Road Junction', progress: 30 },
      { name: 'Ramanathapuram Underpass', progress: 65 },
      { name: 'Ring Road Outer Merge', progress: 85 },
      { name: 'Accident Scene (Coimbatore Ring Road)', progress: 100 }
    ]
  },
  {
    id: 'HOSP-CBE-02',
    name: 'Ganga Medical Centre & Hospital (Trauma Care)',
    locationMatch: ['Coimbatore Ring Road', 'Coimbatore Flyover', 'Coimbatore'],
    address: '313 Mettupalayam Road, Saibaba Colony, Coimbatore, Tamil Nadu 641043',
    city: 'Coimbatore',
    distanceKm: 1.6,
    etaMinutes: 3,
    emergencyBeds: 20,
    icuBeds: 8,
    totalBeds: 160,
    traumaLevel: 'LEVEL_1_TRAUMA',
    phone: '+91-422-248-5000',
    emergencyContact: 'Ganga Trauma Response 108',
    ambulanceFleet: ['GANGA-ALS-01', 'GANGA-CRIT-03'],
    waypoints: [
      { name: 'Ganga Trauma Bay', progress: 0 },
      { name: 'Mettupalayam Corridor', progress: 30 },
      { name: 'Flyover Ramp Alignment', progress: 70 },
      { name: 'Accident Scene (Coimbatore Flyover)', progress: 100 }
    ]
  },
  {
    id: 'HOSP-CBE-03',
    name: 'KMCH — Kovai Medical Center and Hospital',
    locationMatch: ['Coimbatore Ring Road', 'Coimbatore Flyover', 'Coimbatore'],
    address: '99 Avinashi Road, Civil Aerodrome Post, Coimbatore, Tamil Nadu 641014',
    city: 'Coimbatore',
    distanceKm: 4.5,
    etaMinutes: 8,
    emergencyBeds: 22,
    icuBeds: 10,
    totalBeds: 220,
    traumaLevel: 'LEVEL_1_TRAUMA',
    phone: '+91-422-432-3800',
    emergencyContact: 'KMCH Emergency Command 1066',
    ambulanceFleet: ['KMCH-AIR-EMS', 'KMCH-ALS-05'],
    waypoints: [
      { name: 'KMCH Avinashi Road Hub', progress: 0 },
      { name: 'Airport Flyover Sector', progress: 40 },
      { name: 'Peelamedu Expressway', progress: 75 },
      { name: 'Accident Scene', progress: 100 }
    ]
  },

  // Madurai Railway Crossing
  {
    id: 'HOSP-MDU-01',
    name: 'Government Rajaji Hospital Madurai',
    locationMatch: ['Madurai Railway Crossing', 'Madurai'],
    address: 'Panagal Road, Alwarpuram, Madurai, Tamil Nadu 625020',
    city: 'Madurai',
    distanceKm: 1.8,
    etaMinutes: 4,
    emergencyBeds: 16,
    icuBeds: 6,
    totalBeds: 170,
    traumaLevel: 'LEVEL_1_TRAUMA',
    phone: '+91-452-253-2535',
    emergencyContact: '108 Madurai Trauma Central',
    ambulanceFleet: ['TN-108-MDU-01', 'TN-108-MDU-04'],
    waypoints: [
      { name: 'Rajaji Hospital Trauma Gate', progress: 0 },
      { name: 'Goripalayam Signal', progress: 30 },
      { name: 'Vaigai River Cause-way', progress: 60 },
      { name: 'Railway Crossing Sector', progress: 85 },
      { name: 'Accident Scene (Madurai Railway Crossing)', progress: 100 }
    ]
  },
  {
    id: 'HOSP-MDU-02',
    name: 'Meenakshi Mission Hospital & Research Centre',
    locationMatch: ['Madurai Railway Crossing', 'Madurai'],
    address: 'Melur Road, Madurai, Tamil Nadu 625107',
    city: 'Madurai',
    distanceKm: 4.2,
    etaMinutes: 7,
    emergencyBeds: 14,
    icuBeds: 7,
    totalBeds: 140,
    traumaLevel: 'LEVEL_1_TRAUMA',
    phone: '+91-452-258-8741',
    emergencyContact: 'Meenakshi Emergency Unit',
    ambulanceFleet: ['MMHRC-ALS-02', 'MMHRC-CRIT-01'],
    waypoints: [
      { name: 'Meenakshi Mission Bay', progress: 0 },
      { name: 'Mattuthavani Bus Terminus Ring', progress: 40 },
      { name: 'Alagar Kovil Road Crossing', progress: 75 },
      { name: 'Accident Scene (Madurai Railway Crossing)', progress: 100 }
    ]
  },

  // Salem Highway Junction
  {
    id: 'HOSP-SLM-01',
    name: 'Govt Mohan Kumaramangalam Medical College Hospital',
    locationMatch: ['Salem Highway Junction', 'Salem'],
    address: 'Fort Main Road, Shevapet, Salem, Tamil Nadu 636001',
    city: 'Salem',
    distanceKm: 2.6,
    etaMinutes: 5,
    emergencyBeds: 12,
    icuBeds: 5,
    totalBeds: 130,
    traumaLevel: 'LEVEL_1_TRAUMA',
    phone: '+91-427-221-1200',
    emergencyContact: '108 Salem Trauma Dispatch',
    ambulanceFleet: ['TN-108-SLM-01', 'TN-108-SLM-02'],
    waypoints: [
      { name: 'Mohan Kumaramangalam Bay', progress: 0 },
      { name: 'Collectorate Roundabout', progress: 30 },
      { name: 'Salem-Bangalore Highway Merge', progress: 70 },
      { name: 'Accident Scene (Salem Highway Junction)', progress: 100 }
    ]
  },
  {
    id: 'HOSP-SLM-02',
    name: 'Manipal Hospital Salem',
    locationMatch: ['Salem Highway Junction', 'Salem'],
    address: 'NH 44, Dalmia Board, Salem, Tamil Nadu 636012',
    city: 'Salem',
    distanceKm: 4.8,
    etaMinutes: 8,
    emergencyBeds: 16,
    icuBeds: 6,
    totalBeds: 110,
    traumaLevel: 'LEVEL_2_TRAUMA',
    phone: '+91-427-234-6666',
    emergencyContact: 'Manipal Emergency Command',
    ambulanceFleet: ['MANIPAL-SLM-01', 'MANIPAL-ALS-03'],
    waypoints: [
      { name: 'Manipal Hospital Campus', progress: 0 },
      { name: 'NH 44 Expressway Tollway', progress: 45 },
      { name: 'Kandampatty Flyover', progress: 80 },
      { name: 'Accident Scene (Salem Highway Junction)', progress: 100 }
    ]
  },

  // Tiruchirappalli Signal Junction
  {
    id: 'HOSP-TRY-01',
    name: 'Mahatma Gandhi Memorial Govt Hospital Trichy',
    locationMatch: ['Tiruchirappalli Signal Junction', 'Tiruchirappalli', 'Trichy'],
    address: 'Collector Office Road, Cantonment, Tiruchirappalli, Tamil Nadu 620001',
    city: 'Tiruchirappalli',
    distanceKm: 2.3,
    etaMinutes: 4,
    emergencyBeds: 14,
    icuBeds: 5,
    totalBeds: 140,
    traumaLevel: 'LEVEL_1_TRAUMA',
    phone: '+91-431-241-2533',
    emergencyContact: '108 MGMH Trichy Base',
    ambulanceFleet: ['TN-108-TRY-01', 'TN-108-TRY-02'],
    waypoints: [
      { name: 'MGMH Cantonment Gate', progress: 0 },
      { name: 'Head Post Office Circle', progress: 35 },
      { name: 'Tiruchirappalli Signal Corridor', progress: 75 },
      { name: 'Accident Scene (Tiruchirappalli Signal Junction)', progress: 100 }
    ]
  },
  {
    id: 'HOSP-TRY-02',
    name: 'Kauvery Hospital Cantonment Trichy',
    locationMatch: ['Tiruchirappalli Signal Junction', 'Tiruchirappalli', 'Trichy'],
    address: 'No 1, KC Road, Tennur, Tiruchirappalli, Tamil Nadu 620017',
    city: 'Tiruchirappalli',
    distanceKm: 3.6,
    etaMinutes: 6,
    emergencyBeds: 15,
    icuBeds: 6,
    totalBeds: 125,
    traumaLevel: 'LEVEL_1_TRAUMA',
    phone: '+91-431-407-7777',
    emergencyContact: 'Kauvery Emergency Response',
    ambulanceFleet: ['KAUVERY-ALS-04', 'KAUVERY-EMS-02'],
    waypoints: [
      { name: 'Kauvery Hospital Emergency Entrance', progress: 0 },
      { name: 'Tennur High Road', progress: 40 },
      { name: 'Anna Stadium Bypass', progress: 70 },
      { name: 'Accident Scene (Tiruchirappalli Signal Junction)', progress: 100 }
    ]
  },

  // Tirunelveli Bypass
  {
    id: 'HOSP-TNV-01',
    name: 'Tirunelveli Government Medical College Hospital (TVMCH)',
    locationMatch: ['Tirunelveli Bypass', 'Tirunelveli'],
    address: 'High Ground, Palayamkottai, Tirunelveli, Tamil Nadu 627011',
    city: 'Tirunelveli',
    distanceKm: 2.9,
    etaMinutes: 5,
    emergencyBeds: 13,
    icuBeds: 5,
    totalBeds: 135,
    traumaLevel: 'LEVEL_1_TRAUMA',
    phone: '+91-462-257-2720',
    emergencyContact: '108 TVMCH High Ground',
    ambulanceFleet: ['TN-108-TNV-01', 'TN-108-TNV-03'],
    waypoints: [
      { name: 'TVMCH High Ground Dispatch', progress: 0 },
      { name: 'Palayamkottai Bus Stand Circle', progress: 30 },
      { name: 'Vannarpettai Flyover', progress: 65 },
      { name: 'Tirunelveli Bypass Arterial', progress: 85 },
      { name: 'Accident Scene (Tirunelveli Bypass)', progress: 100 }
    ]
  },
  {
    id: 'HOSP-TNV-02',
    name: 'Galaxy Hospital Tirunelveli',
    locationMatch: ['Tirunelveli Bypass', 'Tirunelveli'],
    address: 'NH 44 Bypass Road, Vannarpettai, Tirunelveli, Tamil Nadu 627003',
    city: 'Tirunelveli',
    distanceKm: 4.1,
    etaMinutes: 7,
    emergencyBeds: 8,
    icuBeds: 3,
    totalBeds: 75,
    traumaLevel: 'LEVEL_2_TRAUMA',
    phone: '+91-462-230-0100',
    emergencyContact: 'Galaxy Trauma Care Unit',
    ambulanceFleet: ['GALAXY-ALS-01'],
    waypoints: [
      { name: 'Galaxy Hospital ER Port', progress: 0 },
      { name: 'Thachanallur Junction', progress: 40 },
      { name: 'NH 44 Bypass Mile 8', progress: 75 },
      { name: 'Accident Scene (Tirunelveli Bypass)', progress: 100 }
    ]
  },

  // Chennai Outer Ring Road
  {
    id: 'HOSP-ORR-01',
    name: 'Sri Ramachandra Medical Centre (SRMC)',
    locationMatch: ['Chennai Outer Ring Road', 'Outer Ring Road', 'Chennai'],
    address: 'No 1 Ramachandra Nagar, Porur, Chennai, Tamil Nadu 600116',
    city: 'Chennai',
    distanceKm: 2.4,
    etaMinutes: 4,
    emergencyBeds: 18,
    icuBeds: 8,
    totalBeds: 190,
    traumaLevel: 'LEVEL_1_TRAUMA',
    phone: '+91-44-4592-8500',
    emergencyContact: 'SRMC Level 1 Trauma 108',
    ambulanceFleet: ['SRMC-ALS-01', 'SRMC-TRAUMA-03', 'TN-108-PORUR-02'],
    waypoints: [
      { name: 'SRMC Porur Trauma Port', progress: 0 },
      { name: 'Mount-Poonamallee Road Toll Plaza', progress: 25 },
      { name: 'Kundanrathur ORR Interchange', progress: 60 },
      { name: 'Outer Ring Road Northbound Corridor', progress: 85 },
      { name: 'Accident Scene (Chennai Outer Ring Road)', progress: 100 }
    ]
  },
  {
    id: 'HOSP-ORR-02',
    name: 'MIOT International Hospital',
    locationMatch: ['Chennai Outer Ring Road', 'Outer Ring Road', 'Chennai'],
    address: '4/112 Mount Poonamallee Road, Manapakkam, Chennai, Tamil Nadu 600089',
    city: 'Chennai',
    distanceKm: 4.6,
    etaMinutes: 8,
    emergencyBeds: 24,
    icuBeds: 11,
    totalBeds: 240,
    traumaLevel: 'LEVEL_1_TRAUMA',
    phone: '+91-44-4200-2288',
    emergencyContact: 'MIOT Trauma Command 1052',
    ambulanceFleet: ['MIOT-ALS-05', 'MIOT-CRIT-01'],
    waypoints: [
      { name: 'MIOT Manapakkam Base', progress: 0 },
      { name: 'Ramapuram Junction', progress: 35 },
      { name: 'Porur Outer Cloverleaf', progress: 70 },
      { name: 'Accident Scene (Chennai Outer Ring Road)', progress: 100 }
    ]
  },

  // Virudhunagar Highway
  {
    id: 'HOSP-VNR-01',
    name: 'Virudhunagar Government District Headquarters Hospital',
    locationMatch: ['Virudhunagar Highway', 'Virudhunagar'],
    address: 'Madurai Road, Virudhunagar, Tamil Nadu 626001',
    city: 'Virudhunagar',
    distanceKm: 2.2,
    etaMinutes: 4,
    emergencyBeds: 11,
    icuBeds: 4,
    totalBeds: 95,
    traumaLevel: 'LEVEL_2_TRAUMA',
    phone: '+91-4562-243-500',
    emergencyContact: '108 Virudhunagar HQ Base',
    ambulanceFleet: ['TN-108-VNR-01', 'TN-108-VNR-02'],
    waypoints: [
      { name: 'District HQ Hospital Bay', progress: 0 },
      { name: 'Madurai Road Overbridge', progress: 35 },
      { name: 'Virudhunagar Industrial Corridor', progress: 70 },
      { name: 'Accident Scene (Virudhunagar Highway)', progress: 100 }
    ]
  },
  {
    id: 'HOSP-VNR-02',
    name: 'Aruppukottai Government Hospital',
    locationMatch: ['Virudhunagar Highway', 'Virudhunagar'],
    address: 'Hospital Road, Aruppukottai, Tamil Nadu 626101',
    city: 'Virudhunagar',
    distanceKm: 11.8,
    etaMinutes: 14,
    emergencyBeds: 7,
    icuBeds: 2,
    totalBeds: 60,
    traumaLevel: 'LEVEL_2_TRAUMA',
    phone: '+91-4566-220-300',
    emergencyContact: '108 Aruppukottai Unit',
    ambulanceFleet: ['TN-108-APK-01'],
    waypoints: [
      { name: 'Aruppukottai Govt Hospital Gate', progress: 0 },
      { name: 'State Highway 42 Link', progress: 40 },
      { name: 'NH 44 Virudhunagar Link', progress: 75 },
      { name: 'Accident Scene (Virudhunagar Highway)', progress: 100 }
    ]
  }
];

/**
 * Locate and rank hospitals for an accident location.
 * Ordering rule strictly applied:
 * 1. Distance from accident (Ascending)
 * 2. Emergency bed availability (Descending)
 * 3. ICU bed availability (Descending)
 */
export function getHospitalsForLocation(locationName = '') {
  const normLocation = String(locationName).toLowerCase().trim();

  // Find facilities matching location tags, fallback to all if no exact match
  let matchedHospitals = REGIONAL_HOSPITALS_DATABASE.filter((h) =>
    h.locationMatch.some((tag) => normLocation.includes(tag.toLowerCase()))
  );

  if (matchedHospitals.length === 0) {
    matchedHospitals = REGIONAL_HOSPITALS_DATABASE.slice(0, 4);
  }

  // Strictly sort by: 1. Distance, 2. Emergency Beds, 3. ICU Beds
  const sorted = [...matchedHospitals].sort((a, b) => {
    if (a.distanceKm !== b.distanceKm) {
      return a.distanceKm - b.distanceKm;
    }
    if (b.emergencyBeds !== a.emergencyBeds) {
      return b.emergencyBeds - a.emergencyBeds;
    }
    return b.icuBeds - a.icuBeds;
  });

  return sorted;
}

/**
 * Automatically select the nearest suitable hospital
 */
export function selectNearestSuitableHospital(locationName = '') {
  const ranked = getHospitalsForLocation(locationName);
  return ranked[0] || REGIONAL_HOSPITALS_DATABASE[0];
}

/**
 * Generate Ambulance Dispatch Request details
 */
export function createAmbulanceDispatchRequest(incident, hospital) {
  const hosp = hospital || selectNearestSuitableHospital(incident?.telemetry?.location || incident?.location);
  const ambulanceId = hosp.ambulanceFleet?.[0] || 'TN-108-ALS-04';

  return {
    dispatchId: `DISP-${Date.now().toString().slice(-6)}`,
    incidentId: incident?.id || incident?.incidentId || 'INC-SIM-DEFAULT',
    timestamp: new Date().toISOString(),
    hospitalId: hosp.id,
    hospitalName: hosp.name,
    hospitalAddress: hosp.address,
    emergencyBeds: hosp.emergencyBeds,
    icuBeds: hosp.icuBeds,
    ambulanceId,
    ambulanceType: 'Advanced Life Support (ALS) Trauma Care',
    crew: [
      { role: 'Trauma Team Lead', name: 'Dr. R. Vigneshwaran, MD (Emergency)' },
      { role: 'ALS Emergency Paramedic', name: 'S. Divya, EMT-P' },
      { role: 'Emergency Transit Pilot', name: 'M. Kathiravan' }
    ],
    equipment: [
      'Biphasic Defibrillator & 12-Lead Tele-ECG',
      'Hamilton Transport Ventilator',
      'Hydraulic Spinal Extrication Collar & Board',
      'Emergency Resuscitation & Trauma Drug Kit'
    ],
    estimatedTravelTimeMin: hosp.etaMinutes,
    distanceKm: hosp.distanceKm,
    status: 'DISPATCH_REQUESTED',
    simulationDisclaimer: SIMULATION_DISCLAIMER,
    waypoints: hosp.waypoints || [
      { name: 'Hospital Trauma Emergency Bay', progress: 0 },
      { name: 'Arterial Corridor Expressway', progress: 35 },
      { name: 'Flyover Interchange Point', progress: 70 },
      { name: 'Accident Scene Arrival', progress: 100 }
    ]
  };
}
