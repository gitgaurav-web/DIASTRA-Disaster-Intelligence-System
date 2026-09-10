// ============================================================
// Risk Calculator — Prototype Visualization Utility
// SIH 2026: NDMA Sentinel-DSS
//
// This is a FRONTEND visualization utility only. It does NOT
// represent an official government risk methodology.
// ============================================================

// Weight configuration — kept configurable for future calibration
export const RISK_WEIGHTS = {
  hazardExposure: 0.35,
  vulnerability: 0.3,
  populationExposure: 0.2,
  accessibility: 0.15,
};

export function labelFromScore(score) {
  if (score >= 80) return 'High';
  if (score >= 50) return 'Moderate';
  if (score >= 25) return 'Low';
  return 'Very Low';
}

export function riskLevelFromScore(score) {
  if (score >= 80) return 'Critical';
  if (score >= 60) return 'High';
  if (score >= 40) return 'Moderate';
  return 'Low';
}

export function priorityFromScore(score) {
  if (score >= 80) return 'Immediate';
  if (score >= 60) return 'Short-Term';
  if (score >= 40) return 'Medium-Term';
  return 'Monitor';
}

export function priorityColor(priority) {
  return {
    Immediate: 'red',
    'Short-Term': 'orange',
    'Medium-Term': 'yellow',
    Monitor: 'green',
  }[priority] || 'gray';
}

export function riskColor(level) {
  return {
    Critical: 'red',
    High: 'orange',
    Moderate: 'yellow',
    Low: 'green',
  }[level] || 'gray';
}

export function capacityColor(status) {
  return {
    'Critical Deficit': 'red',
    Deficit: 'orange',
    Warning: 'yellow',
    Adequate: 'green',
  }[status] || 'gray';
}

export function computeRiskScore(factors) {
  const vulnMap = { Low: 25, Moderate: 50, High: 75, 'Very High': 95 };
  const accessMap = { Good: 20, Moderate: 50, Poor: 85 };

  const hazard = factors.hazardExposure || 0;
  const vuln = vulnMap[factors.vulnerability] || 50;
  const pop = Math.min(100, (factors.population / 5000) * 100);
  const access = accessMap[factors.accessibility] || 50;

  const score = Math.min(
    100,
    Math.round(
      hazard * RISK_WEIGHTS.hazardExposure +
        vuln * RISK_WEIGHTS.vulnerability +
        pop * RISK_WEIGHTS.populationExposure +
        access * RISK_WEIGHTS.accessibility
    )
  );

  return {
    score,
    level: riskLevelFromScore(score),
    priority: priorityFromScore(score),
    breakdown: {
      hazardExposure: Math.round(hazard),
      vulnerability: Math.round(vuln),
      populationExposure: Math.round(pop),
      accessibility: Math.round(access),
    },
  };
}
