export let status = {
    "taxes": 0,
    "debt": 0,
    "economy": 0,
    "disease_control": 0,
    "health_workers": 0,
    "public_health": 0,
    "healthcare_system": 0,
    "education_system": 0,
    "teachers": 0,
    "research": 0,
    "social_security": 0,
    "empowerment": 0,
    "population_control": 0,
    "wage_income": 0,
    "work_environment": 0,
    "productive_workes": 0,
    "jobs": 0,
    "justice_system": 0,
    "governance": 0,
    "media_neutrality": 0,
    "security": 0,
    "communication_information": 0,
    "transportation": 0,
    "power_energy": 0,
    "urban_housing": 0,
    "pollution_control": 0,
    "forest": 0,
    "biodiversity": 0,
    "marine": 0,
    "investment": 0,
    "mineral_oil_industry": 0,
    "manufacture": 0,
    "agriculture": 0,
    "fisheries": 0,
    "tourism_creative": 0,
    "sustainability": 0,
    "foreign_relation": 0,
    "defense_force": 0,
    "defense_infrastructure": 0,
    "mineral_oil": 0,
    "water_land": 0,
    "food_sources": 0,
}

/**
 * Initialize the status.
 * @param {*} levelVariables The level variables.
 */
export function initializeStatus(levelVariables) {
    for (const variable in levelVariables) {
        status[variable] = levelVariables[variable];
    }
}

/**
 * Update the status.
 * @param {string} variable The variable.
 * @param {number} value The value.
 */
export function updateStatus(variable, value) {
    status[variable] = value;
}