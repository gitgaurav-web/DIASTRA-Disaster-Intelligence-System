# ==========================================
# RELOCATION PRIORITY
# ==========================================

def calculate_relocation_priority(
    risk_score,
    capacity_deficit,
    accessibility
):

    score = 0

    # Risk contribution - 60%
    score += risk_score * 0.60

    # Capacity deficit contribution - 25%
    if capacity_deficit > 0:
        score += min(capacity_deficit / 5000 * 100, 100) * 0.25

    # Accessibility contribution - 15%
    accessibility_map = {
        "Good": 20,
        "Moderate": 50,
        "Poor": 85
    }

    accessibility_score = accessibility_map.get(
        accessibility,
        50
    )

    score += accessibility_score * 0.15

    score = round(min(100, score), 2)

    # Priority
    if score >= 80:
        priority = "Immediate"
    elif score >= 60:
        priority = "Short-Term"
    elif score >= 40:
        priority = "Medium-Term"
    else:
        priority = "Monitor"

    return {
        "priority_score": score,
        "priority": priority
    }


# ==========================================
# BEST RELOCATION SITE
# ==========================================

def calculate_site_score(
    available,
    suitability,
    accessibility,
    distance
):

    score = 0

    # Suitability - 40%
    score += suitability * 0.40

    # Available capacity - 30%
    capacity_score = min(
        (available / 1000) * 100,
        100
    )

    score += capacity_score * 0.30

    # Accessibility - 20%
    accessibility_map = {
        "Good": 100,
        "Moderate": 60,
        "Poor": 20
    }

    accessibility_score = accessibility_map.get(
        accessibility,
        60
    )

    score += accessibility_score * 0.20

    # Distance - 10%
    if distance <= 5:
        distance_score = 100
    elif distance <= 10:
        distance_score = 80
    elif distance <= 20:
        distance_score = 60
    elif distance <= 50:
        distance_score = 40
    else:
        distance_score = 20

    score += distance_score * 0.10

    return round(min(100, score), 2)


def calculate_site_match_score(available, required_population, suitability, accessibility,
                               distance_km, same_district):
    """Transparent relocation-site ranking used by the API.

    A score is an aid for officers, never an approval.  Capacity is deliberately
    penalised when a site cannot take the full population so a nearby but
    overcrowded shelter is not presented as an unqualified safe destination.
    """
    required = max(float(required_population), 1.0)
    capacity_ratio = max(0.0, min(float(available) / required, 1.0))
    capacity_score = capacity_ratio * 100
    suitability_score = max(0.0, min(float(suitability) * 10, 100.0))
    access_map = {"Good": 100, "Moderate": 60, "Poor": 20,
                  "Restricted": 20, "Blocked": 0, "Impassable": 0}
    access_score = access_map.get(accessibility, 50)
    distance_score = max(0.0, 100.0 - min(float(distance_km), 100.0))
    district_score = 100 if same_district else 0

    score = (
        capacity_score * 0.35
        + suitability_score * 0.25
        + access_score * 0.20
        + distance_score * 0.10
        + district_score * 0.10
    )
    return round(score, 2)
