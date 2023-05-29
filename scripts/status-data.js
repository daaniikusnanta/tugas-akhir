import {crisis} from "./crisis-data.js";

/**
 * @typedef {
 *     cause: string, 
 *     yValue: number,
 *     inertia: number,
 *     formula: () => number,
 * } Cause
 */

/**
 * @type {
 * string: {
 *      value: number,
 *      causes: Cause[],
 * }}
 */
export let status = {
    "taxes": {
        value: 0,
        causes: [
            {cause: "investment", yValue: 0, inertia: 0.1,
                formula: () => status['investment'].value * 0.1},
            {cause: "inflation", yValue: 0, inertia: 0.1,
                formula: () => crisis['inflation'].value * 0.1},
            {cause: "tax_evasion", yValue: 0, inertia: 0.1,
                formula: () => crisis['tax_evasion'].value * 0.1},
            {cause: "bankruptcies", yValue: 0, inertia: 0.1,
                formula: () => crisis['bankruptcies'].value * 0.1},
        ],
    },
    "debt": {
        value: 0,
        causes: [],
    },
    "economy": {
        value: 0,
        causes: [
            {cause: "wage_income", yValue: 0, inertia: 0.1,
                formula: () => status['wage_income'].value * 0.1},
            {cause: "poverty", yValue: 0, inertia: 0.1,
                formula: () => crisis['poverty'].value * 0.1},
            {cause: "unemployment", yValue: 0, inertia: 0.1,
                formula: () => crisis['unemployment'].value * 0.1},
        ],
    },
    "disease_control": {
        value: 0,
        causes: [],
    },
    "health_workers": {
        value: 0,
        causes: [
            {cause: "infectious_disease", yValue: 0, inertia: 0.1,
                formula: () => crisis['infectious_disease'].value * 0.1},
        ],
    },
    "public_health": {
        value: 0,
        causes: [],
    },
    "healthcare_system": {
        value: 0,
        causes: [
            {cause: "health_worker_shortage", yValue: 0, inertia: 0.1,
                formula: () => crisis['health_worker_shortage'].value * 0.1},
        ],
    },
    "education_system": {
        value: 0,
        causes: [
            {cause: "teacher_shortage", yValue: 0, inertia: 0.1,
                formula: () => crisis['teacher_shortage'].value * 0.1},
        ],
    },
    "teachers": {
        value: 0,
        causes: [],
    },
    "research": {
        value: 0,
        causes: [
            {cause: "low_education", yValue: 0, inertia: 0.1,
                formula: () => crisis['low_education'].value * 0.1},
        ],
    },
    "social_security": {
        value: 0,
        causes: [],
    },
    "empowerment": {
        value: 0,
        causes: [],
    },
    "population_control": {
        value: 0,
        causes: [
            {cause: "infectious_disease", yValue: 0, inertia: 0.1,
                formula: () => crisis['infectious_disease'].value * 0.1},
            {cause: "chronic_disease", yValue: 0, inertia: 0.1,
                formula: () => crisis['chronic_disease'].value * 0.1},
        ],
    },
    "wage_income": {
        value: 0,
        causes: [],
    },
    "work_environment": {
        value: 0,
        causes: [
            {cause: "discrimination", yValue: 0, inertia: 0.1,
                formula: () => crisis['discrimination'].value * 0.1},
        ],
    },
    "productive_workers": {
        value: 0,
        causes: [
            {cause: "dropout_crisis", yValue: 0, inertia: 0.1,
                formula: () => crisis['dropout_crisis'].value * 0.1},
            {cause: "low_education", yValue: 0, inertia: 0.1,
                formula: () => crisis['low_education'].value * 0.1},
            {cause: "skill_shortage", yValue: 0, inertia: 0.1,
                formula: () => crisis['skill_shortage'].value * 0.1},
        ],
    },
    "jobs": {
        value: 0,
        causes: [
            {cause: "healthcare_collapse", yValue: 0, inertia: 0.1,
                formula: () => crisis['healthcare_collapse'].value * 0.1},
            {cause: "bankruptcies", yValue: 0, inertia: 0.1,
                formula: () => crisis['bankruptcies'].value * 0.1},
        ],
    },
    "justice_system": {
        value: 0,
        causes: [],
    },
    "governance": {
        value: 0,
        causes: [],
    },
    "media_neutrality": {
        value: 0,
        causes: [
            {cause: "discrimination", yValue: 0, inertia: 0.1,
                formula: () => crisis['discrimination'].value * 0.1},
        ],
    },
    "security": {
        value: 0,
        causes: [
            {cause: "cyber_attack", yValue: 0, inertia: 0.1,
                formula: () => crisis['cyber_attack'].value * 0.1},
            {cause: "terrorism", yValue: 0, inertia: 0.1,
                formula: () => crisis['terrorism'].value * 0.1},
            {cause: "war_aggression", yValue: 0, inertia: 0.1,
                formula: () => crisis['war_aggression'].value * 0.1},
            {cause: "separatist_groups", yValue: 0, inertia: 0.1,
                formula: () => crisis['separatist_groups'].value * 0.1},
            {cause: "social_unrest", yValue: 0, inertia: 0.1,
                formula: () => crisis['social_unrest'].value * 0.1},
            {cause: "conflicts", yValue: 0, inertia: 0.1,
                formula: () => crisis['conflicts'].value * 0.1},
            {cause: "crime_violence", yValue: 0, inertia: 0.1,
                formula: () => crisis['crime_violence'].value * 0.1},
        ],
    },
    "communication_information": {
        value: 0,
        causes: [
            {cause: "power_energy", yValue: 0, inertia: 0.1,
                formula: () => status['power_energy'].value * 0.1},
        ],
    },
    "transportation": {
        value: 0,
        causes: [
            {cause: "technology_lag", yValue: 0, inertia: 0.1,
                formula: () => crisis['technology_lag'].value * 0.1},
            {cause: "mineral_scarcity", yValue: 0, inertia: 0.1,
                formula: () => crisis['mineral_scarcity'].value * 0.1},
        ],
    },
    "power_energy": {
        value: 0,
        causes: [
            {cause: "technology_lag", yValue: 0, inertia: 0.1,
                formula: () => crisis['technology_lag'].value * 0.1},
            {cause: "mineral_scarcity", yValue: 0, inertia: 0.1,
                formula: () => crisis['mineral_scarcity'].value * 0.1},
        ],
    },
    "urban_housing": {
        value: 0,
        causes: [
            {cause: "overpopulation", yValue: 0, inertia: 0.1,
                formula: () => crisis['overpopulation'].value * 0.1},
            {cause: "power_energy", yValue: 0, inertia: 0.1,
                formula: () => status['power_energy'].value * 0.1},
        ],
    },
    "pollution_control": {
        value: 0,
        causes: [],
    },
    "forest": {
        value: 0,
        causes: [],
    },
    "biodiversity": {
        value: 0,
        causes: [
            {cause: "pollution", yValue: 0, inertia: 0.1,
                formula: () => crisis['pollution'].value * 0.1},
            {cause: "deforestation", yValue: 0, inertia: 0.1,
                formula: () => crisis['deforestation'].value * 0.1},
            {cause: "overfishing", yValue: 0, inertia: 0.1,
                formula: () => crisis['overfishing'].value * 0.1},
        ],
    },
    "marine": {
        value: 0,
        causes: [
            {cause: "overfishing", yValue: 0, inertia: 0.1,
                formula: () => crisis['overfishing'].value * 0.1},
        ],
    },
    "investment": {
        value: 0,
        causes: [
            {cause: "inflation", yValue: 0, inertia: 0.1,
                formula: () => crisis['inflation'].value * 0.1},
            {cause: "infectious_disease", yValue: 0, inertia: 0.1,
                formula: () => crisis['infectious_disease'].value * 0.1},
            {cause: "chronic_disease", yValue: 0, inertia: 0.1,
                formula: () => crisis['chronic_disease'].value * 0.1},
            {cause: "skill_shortage", yValue: 0, inertia: 0.1,
                formula: () => crisis['skill_shortage'].value * 0.1},
            {cause: "unemployment", yValue: 0, inertia: 0.1,
                formula: () => crisis['unemployment'].value * 0.1},
            {cause: "black_market", yValue: 0, inertia: 0.1,
                formula: () => crisis['black_market'].value * 0.1},
            {cause: "taxes", yValue: 0, inertia: 0.1,
                formula: () => status['taxes'].value * 0.1},
            {cause: "security", yValue: 0, inertia: 0.1,
                formula: () => status['security'].value * 0.1},

        ],
    },
    "mineral_oil_industry": {
        value: 0,
        causes: [
            {cause: "low_investment", yValue: 0, inertia: 0.1,
                formula: () => crisis['low_investment'].value * 0.1},

        ],
    },
    "manufacturing": {
        value: 0,
        causes: [
            {cause: "low_investment", yValue: 0, inertia: 0.1,
                formula: () => crisis['low_investment'].value * 0.1},

        ],
    },
    "agriculture": {
        value: 0,
        causes: [
            {cause: "water_land", yValue: 0, inertia: 0.1,
                formula: () => status['water_land'].value * 0.1},
            {cause: "low_investment", yValue: 0, inertia: 0.1,
                formula: () => crisis['low_investment'].value * 0.1},

        ],
    },
    "fisheries": {
        value: 0,
        causes: [
            {cause: "water_land", yValue: 0, inertia: 0.1,
                formula: () => status['water_land'].value * 0.1},
            {cause: "marine", yValue: 0, inertia: 0.1,
                formula: () => status['marine'].value * 0.1},
            {cause: "low_investment", yValue: 0, inertia: 0.1,
                formula: () => crisis['low_investment'].value * 0.1},

        ],
    },
    "tourism_creative": {
        value: 0,
        causes: [
            {cause: "security", yValue: 0, inertia: 0.1,
                formula: () => status['security'].value * 0.1},
            {cause: "low_investment", yValue: 0, inertia: 0.1,
                formula: () => crisis['low_investment'].value * 0.1},
            {cause: "infectious_disease", yValue: 0, inertia: 0.1,
                formula: () => crisis['infectious_disease'].value * 0.1},
            {cause: "housing_crisis", yValue: 0, inertia: 0.1,
                formula: () => crisis['housing_crisis'].value * 0.1},
            {cause: "pollution", yValue: 0, inertia: 0.1,
                formula: () => crisis['pollution'].value * 0.1},
            {cause: "biodiversity_loss", yValue: 0, inertia: 0.1,
                formula: () => crisis['biodiversity_loss'].value * 0.1},
        ],
    },
    "sustainability": {
        value: 0,
        causes: [
            {cause: "research", yValue: 0, inertia: 0.1,
                formula: () => status['research'].value * 0.1},
        ],
    },
    "foreign_relations": {
        value: 0,
        causes: [
            {cause: "political_instability", yValue: 0, inertia: 0.1,
                formula: () => crisis['political_instability'].value * 0.1},
        ],
    },
    "defense_force": {
        value: 0,
        causes: [],
    },
    "defense_infrastructure": {
        value: 0,
        causes: [
            {cause: "technology_lag", yValue: 0, inertia: 0.1,
                formula: () => crisis['technology_lag'].value * 0.1},
        ],
    },
    "mineral_oil": {
        value: 0,
        causes: [
            {cause: "mineral_oil_industry", yValue: 0, inertia: 0.1,
                formula: () => status['mineral_oil_industry'].value * 0.1},
            {cause: "sustainability", yValue: 0, inertia: 0.1,
                formula: () => status['sustainability'].value * 0.1},
        ],
    },
    "water_land": {
        value: 0,
        causes: [
            {cause: "biodiversity", yValue: 0, inertia: 0.1,
                formula: () => status['biodiversity'].value * 0.1},
            {cause: "overpopulation", yValue: 0, inertia: 0.1,
                formula: () => crisis['overpopulation'].value * 0.1},
        ],
    },
    "food_sources": {
        value: 0,
        causes: [
            {cause: "forest", yValue: 0, inertia: 0.1,
                formula: () => status['forest'].value * 0.1},
            {cause: "biodiversity", yValue: 0, inertia: 0.1,
                formula: () => status['biodiversity'].value * 0.1},
            {cause: "marine", yValue: 0, inertia: 0.1,
                formula: () => status['marine'].value * 0.1},
            {cause: "overfishing", yValue: 0, inertia: 0.1,
                formula: () => crisis['overfishing'].value * 0.1},
        ],
    },
}

/**
 * Initialize the status.
 * @param {*} levelVariables The level variables.
 */
export function initializeStatus(levelVariables) {
    for (const variable in levelVariables) {
        status[variable].value = levelVariables[variable];
    }
}

/**
 * Update the status.
 * @param {string} variable The variable.
 */
export function updateStatus(variable) {
    for (const cause of status[variable].causes) {
        const update = cause.formula();
        if (update > 0) {
            status[variable].value += update;
            // console.log(cause.cause, "update", variable, update)
        } else {
            status[variable].value += cause.yValue;
            // console.log(cause.cause, "y-value", variable, cause.yValue)
        }
    }
}