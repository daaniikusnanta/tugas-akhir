// /**
//  * @type {number}
//  */
// let taxes = 0;

// /**
//  * @type {number}
//  */
// let debt = 0;

// /**
//  * @type {number}
//  */
// let economy = 0;

// /**
//  * @type {number}
//  */
// let disease_control = 0;

// /**
//  * @type {number}
//  */
// let health_workers = 0;

// /**
//  * @type {number}
//  */
// let public_health = 0;

// /**
//  * @type {number}
//  */
// let healthcare_system = 0;

//  /**
//  * Represents the education system status.
//  * @type {number}
//  */
// let education_system = 0;

// /**
//  * Represents the teacher status.
//  * @type {number}
//  */
// let teacher = 0;

// /**
//  * Represents the research and technology status.
//  * @type {number}
//  */
// let research_technology = 0;

// /**
//  * Represents the social security status.
//  * @type {number}
//  */
// let social_security = 0;

// /**
//  * Represents the empowerment status.
//  * @type {number}
//  */
// let empowerment = 0;

// /**
//  * Represents the population control status.
//  * @type {number}
//  */
// let population_control = 0;

// /**
//  * Represents the wages and income status.
//  * @type {number}
//  */
// let wages_income = 0;

// /**
//  * Represents the work environment status.
//  * @type {number}
//  */
// let work_environment = 0;

// /**
//  * Represents the productive worker status.
//  * @type {number}
//  */
// let productive_worker = 0;

// /**
//  * Represents the jobs status.
//  * @type {number}
//  */
// let jobs = 0;

// /**
//  * Represents the justice system status.
//  * @type {number}
//  */
// let justice_system = 0;

// /**
//  * Represents the governance status.
//  * @type {number}
//  */
// let governance = 0;

// /**
//  * Represents the media neutrality status.
//  * @type {number}
//  */
// let media_neutrality = 0;

// /**
//  * Represents the security status.
//  * @type {number}
//  */
// let security = 0;

// /**
//  * Represents the communication and information status.
//  * @type {number}
//  */
// let communication_information = 0;

// /**
//  * Represents the transportation status.
//  * @type {number}
//  */
// let transportation = 0;

// /**
//  * Represents the power and energy status.
//  * @type {number}
//  */
// let power_energy = 0;

// /**
//  * Represents the urban housing status.
//  * @type {number}
//  */
// let urban_housing = 0;

// /**
//  * Represents the pollution control status.
//  * @type {number}
//  */
// let pollution_control = 0;

// /**
//  * Represents the forest status.
//  * @type {number}
//  */
// let forest = 0;

// /**
//  * Represents the biodiversity status.
//  * @type {number}
//  */
// let biodiversity = 0;

// /**
//  * Represents the marine status.
//  * @type {number}
//  */
// let marine = 0;

// /**
//  * Represents the investment status.
//  * @type {number}
//  */
// let investment = 0;

// /**
//  * Represents the mineral and oil industry status.
//  * @type {number}
//  */
// let mineral_oil_industry = 0;

// /**
//  * Represents the manufacture status.
//  * @type {number}
//  */
// let manufacture = 0;

// /**
//  * Represents the agriculture status.
//  * @type {number}
//  */
// let agriculture = 0;

// /**
//  * Represents the fisheries status.
//  * @type {number}
//  */
// let fisheries = 0;

// /**
//  * Represents the tourism and creative status.
//  * @type {number}
//  */
// let tourism_creative = 0;

// /**
//  * Represents the sustainability status.
//  * @type {number}
//  */
// let sustainability = 0;

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