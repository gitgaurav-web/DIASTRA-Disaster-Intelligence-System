// ============================================================
// DEMO DATA — SIH 2026 PROTOTYPE
// All data is fictional and for demonstration purposes only.
// isDemo: true on every record to make provenance explicit.
// ============================================================

export const IS_DEMO = true;

export const DISTRICTS = [
  'Chamoli',
  'Rudraprayag',
  'Uttarkashi',
  'Pithoragarh',
  'Tehri Garhwal',
  'Bageshwar',
  'Champawat',
  'Almora',
  'Nainital',
  'Haridwar',
];

export const HAZARD_TYPES = ['Flood', 'Landslide', 'Erosion'];

export const RISK_LEVELS = ['Low', 'Moderate', 'High', 'Critical'];

export const VULNERABILITY_LEVELS = ['Low', 'Moderate', 'High', 'Very High'];

export const CAPACITY_STATUSES = ['Adequate', 'Warning', 'Deficit', 'Critical Deficit'];

export const PRIORITY_LEVELS = ['Immediate', 'Short-Term', 'Medium-Term', 'Monitor'];

const DISTRICT_CENTERS = {
  Chamoli: [30.4, 79.5],
  Rudraprayag: [30.28, 78.98],
  Uttarkashi: [30.73, 78.43],
  Pithoragarh: [29.58, 80.22],
  'Tehri Garhwal': [30.38, 78.42],
  Bageshwar: [29.84, 79.77],
  Champawat: [29.33, 80.1],
  Almora: [29.6, 79.66],
  Nainital: [29.39, 79.45],
  Haridwar: [29.95, 78.17],
};

function jitter(center, delta) {
  const lat = center[0] + (Math.random() - 0.5) * delta;
  const lng = center[1] + (Math.random() - 0.5) * delta;
  return [lat, lng];
}

function riskLevelFromScore(score) {
  if (score >= 80) return 'Critical';
  if (score >= 60) return 'High';
  if (score >= 40) return 'Moderate';
  return 'Low';
}

function priorityFromScore(score) {
  if (score >= 80) return 'Immediate';
  if (score >= 60) return 'Short-Term';
  if (score >= 40) return 'Medium-Term';
  return 'Monitor';
}

function capacityFromDeficit(deficitRatio) {
  if (deficitRatio >= 0.6) return 'Critical Deficit';
  if (deficitRatio >= 0.3) return 'Deficit';
  if (deficitRatio >= 0.1) return 'Warning';
  return 'Adequate';
}

const HABITATION_NAMES = [
  'Rampur', 'Joshimath', 'Gopeshwar', 'Ukhimath', 'Agastyamuni',
  'Bhatwari', 'Dunda', 'Berinag', 'Munsiyari', 'Didihat',
  'Pratapnagar', 'Narendra Nagar', 'Kapkot', 'Lohaghat', 'Sult',
  'Bageshwar Town', 'Someshwar', 'Bhimtal', 'Manglaur', 'Laksar',
  'Karnaprayag', 'Gauchar', 'Pokhri', 'Gangolihat', 'Champawat Town',
  'Rudraprayag Town', 'Tehri Town', 'Dugadda', 'Haldwani', 'Roorkee',
];

const HABITATION_SEED = HABITATION_NAMES.map((name, i) => {
  const district = DISTRICTS[i % DISTRICTS.length];
  const population = Math.floor(800 + Math.random() * 4500);
  const households = Math.floor(population / 4.5);
  const safeCapacity = Math.floor(population * (0.25 + Math.random() * 0.6));
  const capacityDeficit = Math.max(0, population - safeCapacity);
  const deficitRatio = capacityDeficit / population;
  const hazard = HAZARD_TYPES[i % HAZARD_TYPES.length];
  const hazardExposure = Math.floor(50 + Math.random() * 50);
  const vulnerability = VULNERABILITY_LEVELS[Math.floor(Math.random() * VULNERABILITY_LEVELS.length)];
  const vulnScore = { Low: 25, Moderate: 50, High: 75, 'Very High': 95 }[vulnerability];
  const popExposure = Math.min(100, Math.floor((population / 5000) * 100));
  const accessibility = ['Good', 'Moderate', 'Poor'][Math.floor(Math.random() * 3)];
  const accessScore = { Good: 20, Moderate: 50, Poor: 85 }[accessibility];
  const riskScore = Math.min(
    100,
    Math.floor(hazardExposure * 0.35 + vulnScore * 0.3 + popExposure * 0.2 + accessScore * 0.15)
  );
  const riskLevel = riskLevelFromScore(riskScore);
  const priority = priorityFromScore(riskScore);
  const capacityStatus = capacityFromDeficit(deficitRatio);

  const coords = jitter(DISTRICT_CENTERS[district] || [30.0, 79.0], 0.25);

  return {
    id: i + 1,
    name,
    district,
    population,
    households,
    hazard,
    riskScore,
    riskLevel,
    vulnerability,
    accessibility,
    emergencyAccess: accessibility === 'Good' ? 'Accessible' : accessibility === 'Moderate' ? 'Limited' : 'Difficult',
    hazardExposure: {
      Flood: hazard === 'Flood' ? hazardExposure : Math.floor(Math.random() * 30),
      Landslide: hazard === 'Landslide' ? hazardExposure : Math.floor(Math.random() * 30),
      Erosion: hazard === 'Erosion' ? hazardExposure : Math.floor(Math.random() * 30),
    },
    vulnerabilityBreakdown: {
      population: vulnScore,
      infrastructure: Math.floor(30 + Math.random() * 60),
      accessibility: accessScore,
      emergency: accessScore,
    },
    contributingFactors: {
      hazardExposure: hazardExposure >= 70 ? 'High' : hazardExposure >= 40 ? 'Moderate' : 'Low',
      vulnerability,
      populationExposure: popExposure >= 70 ? 'High' : popExposure >= 40 ? 'Moderate' : 'Low',
      accessibility: accessibility === 'Poor' ? 'High' : accessibility === 'Moderate' ? 'Moderate' : 'Low',
    },
    safeCapacity,
    capacityDeficit,
    capacityStatus,
    capacitySurplus: Math.max(0, safeCapacity - population),
    priority,
    status: riskScore >= 60 ? 'At Risk' : riskScore >= 40 ? 'Monitored' : 'Stable',
    coords,
    isDemo: true,
  };
});

export const HABITATIONS = HABITATION_SEED;

// Relocation sites — safe areas with capacity
const SITE_NAMES = [
  'Safe Site Dehradun', 'Safe Site Kotdwar', 'Safe Site Haldwani',
  'Safe Site Rishikesh', 'Safe Site Rudrapur', 'Safe Site Kashipur',
  'Safe Site Ramnagar', 'Safe Site Sitarganj',
];

export const RELOCATION_SITES = SITE_NAMES.map((name, i) => {
  const districts = ['Dehradun', 'Pauri Garhwal', 'Nainital', 'Haridwar', 'Udham Singh Nagar', 'Udham Singh Nagar', 'Nainital', 'Udham Singh Nagar'];
  const coords = jitter(DISTRICT_CENTERS[districts[i]] || [29.5, 79.0], 0.2);
  const capacity = Math.floor(3000 + Math.random() * 5000);
  const occupancy = Math.floor(capacity * (0.2 + Math.random() * 0.5));
  const available = capacity - occupancy;
  return {
    id: i + 1,
    name,
    district: districts[i],
    capacity,
    occupancy,
    available,
    accessibility: ['Good', 'Good', 'Moderate'][i % 3],
    distance: Math.floor(15 + Math.random() * 120),
    infrastructure: ['Good', 'Moderate', 'Good'][i % 3],
    suitability: available > 3000 ? 'High' : available > 1500 ? 'Moderate' : 'Low',
    status: available > 2000 ? 'Ready' : available > 1000 ? 'Available' : 'Limited',
    coords,
    isDemo: true,
  };
});

// Stats for homepage
export const HOME_STATS = {
  totalHabitations: HABITATIONS.length,
  criticalRedZones: HABITATIONS.filter((h) => h.riskLevel === 'Critical').length,
  populationAtRisk: HABITATIONS.filter((h) => h.riskScore >= 60).reduce((s, h) => s + h.population, 0),
  capacityDeficit: HABITATIONS.reduce((s, h) => s + h.capacityDeficit, 0),
  immediateRelocation: HABITATIONS.filter((h) => h.priority === 'Immediate').length,
  isDemo: true,
};

// Disaster information
export const DISASTER_INFO = [
  {
    id: 'flood',
    name: 'Flood',
    icon: 'Waves',
    color: 'blue',
    causes: [
      'Heavy and prolonged rainfall exceeding drainage capacity',
      'Glacial lake outburst floods (GLOFs) in high-altitude regions',
      'Riverbank overflow and breach of embankments',
      'Cloudburst events causing sudden flash floods',
    ],
    riskIndicators: [
      'Proximity to river channels and floodplains',
      'Historical flood recurrence interval',
      'Rainfall intensity and duration',
      'Upstream catchment area and snowmelt contribution',
    ],
    impact: [
      'Loss of life and livestock',
      'Damage to housing, roads, and bridges',
      'Contamination of drinking water sources',
      'Displacement of habitations and agricultural loss',
    ],
    vulnerableAreas: [
      'Riverbank habitation clusters',
      'Low-lying valley settlements',
      'Confluence zones of major tributaries',
    ],
    mitigation: [
      'Flood-resilient construction and elevated platforms',
      'Early warning systems and community evacuation plans',
      'Afforestation in upper catchments',
      'Controlled embankment and channel management',
    ],
    isDemo: true,
  },
  {
    id: 'landslide',
    name: 'Landslide',
    icon: 'Mountain',
    color: 'amber',
    causes: [
      'Intense rainfall saturating slope material',
      'Seismic activity triggering slope failure',
      'Unregulated road construction and slope cutting',
      'Deforestation reducing slope stability',
    ],
    riskIndicators: [
      'Slope gradient and aspect',
      'Soil type and geological formation',
      'Groundwater level and saturation',
      'Historical landslide occurrences',
    ],
    impact: [
      'Burial of habitations and infrastructure',
      'Blockage of roads isolating communities',
      'Damming of rivers creating landslide-dam lakes',
      'Long-term slope instability rendering land unsafe',
    ],
    vulnerableAreas: [
      'Steep slope habitations',
      'Road-cutting zones along mountain highways',
      'Old landslide reactivation sites',
    ],
    mitigation: [
      'Retaining walls and slope stabilization structures',
      'Restricted construction in high-slope zones',
      'Real-time slope monitoring and alert systems',
      'Bioengineering with deep-rooted vegetation',
    ],
    isDemo: true,
  },
  {
    id: 'erosion',
    name: 'Erosion',
    icon: 'Wind',
    color: 'stone',
    causes: [
      'Riverbank scouring during high-flow events',
      'Surface runoff from degraded catchments',
      'Deforestation and overgrazing',
      'Unplanned land-use changes on slopes',
    ],
    riskIndicators: [
      'Bank material erodibility',
      'River flow velocity and seasonal variation',
      'Vegetation cover density',
      'Rate of historical bank retreat',
    ],
    impact: [
      'Progressive loss of agricultural and habitable land',
      'Threatening of riverbank settlements',
      'Sedimentation of downstream water bodies',
      'Destabilization of adjacent slopes and roads',
    ],
    vulnerableAreas: [
      'Riverbank habitation clusters',
      'Agricultural land along floodplains',
      'Confluences with high sediment load',
    ],
    mitigation: [
      'Riverbank protection with gabions and spurs',
      'Riparian vegetation buffers',
      'Check dams and gully plugging',
      'Regulated extraction of riverbed material',
    ],
    isDemo: true,
  },
];

// Notifications (prototype)
export const NOTIFICATIONS = [
  { id: 1, title: '3 critical habitations identified', detail: 'Chamoli & Rudraprayag districts', time: '2h ago', type: 'critical', isDemo: true },
  { id: 2, title: 'Capacity deficit detected in District A', detail: 'Chamoli — 1,250 person deficit', time: '5h ago', type: 'warning', isDemo: true },
  { id: 3, title: 'New risk assessment available', detail: 'Monsoon season updated analysis', time: '1d ago', type: 'info', isDemo: true },
];

// Official resources
export const OFFICIAL_RESOURCES = [
  {
    id: 'ndma',
    name: 'NDMA',
    fullName: 'National Disaster Management Authority',
    description: 'Apex statutory body for disaster management in India, headed by the Prime Minister.',
    url: 'https://ndma.gov.in/',
  },
  {
    id: 'sachet',
    name: 'SACHET',
    fullName: 'National Disaster Alert Portal',
    description: 'Real-time alerts and warnings for natural hazards across India.',
    url: 'https://sachet.ndma.gov.in/',
  },
  {
    id: 'ndem',
    name: 'NDEM',
    fullName: 'National Database for Emergency Management',
    description: 'Geo-spatial database supporting emergency management planning and response.',
    url: 'https://ndem.nrsc.gov.in/',
  },
  {
    id: 'bhuvan',
    name: 'Bhuvan',
    fullName: 'ISRO/NRSC Geospatial Platform',
    description: 'Indian geospatial platform providing satellite imagery and thematic maps.',
    url: 'https://bhuvan.nrsc.gov.in/',
  },
  {
    id: 'nidm',
    name: 'NIDM',
    fullName: 'National Institute of Disaster Management',
    description: 'Capacity building, training, and research in disaster management.',
    url: 'https://nidm.gov.in/',
  },
  {
    id: 'imd',
    name: 'IMD',
    fullName: 'India Meteorological Department',
    description: 'Weather forecasts, warnings, and meteorological observations for India.',
    url: 'https://mausam.imd.gov.in/',
  },
  {
    id: 'cwc',
    name: 'CWC',
    fullName: 'Central Water Commission',
    description: 'Flood forecasting, water resource monitoring, and hydrological data.',
    url: 'https://cwc.gov.in/',
  },
];

export function getHabitationById(id) {
  return HABITATIONS.find((h) => String(h.id) === String(id));
}

export function getRelocationRanking() {
  return [...HABITATIONS]
    .filter((h) => h.riskScore >= 50)
    .sort((a, b) => b.riskScore - a.riskScore)
    .map((h, i) => ({
      ...h,
      rank: i + 1,
      reason: buildRelocationReason(h),
    }));
}

function buildRelocationReason(h) {
  const reasons = [];
  reasons.push(h.hazardExposure[h.hazard] >= 70 ? `High ${h.hazard.toLowerCase()} exposure` : `Moderate ${h.hazard.toLowerCase()} exposure`);
  if (h.vulnerability === 'High' || h.vulnerability === 'Very High') reasons.push(`${h.vulnerability} vulnerable population`);
  if (h.capacityDeficit > 0) reasons.push(`capacity deficit of ${h.capacityDeficit.toLocaleString()}`);
  if (h.accessibility === 'Poor') reasons.push('limited accessibility');
  return reasons.join(' + ');
}
