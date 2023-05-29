import {crisis} from "./crisis-data.js";

/**
 * @typedef {
*     cause: string,
*     yIntercept: number,
*     inertia: number,
*     factor: number,
*     formula: function(),
* } Cause
*/

/**
 * @type {
 * string: {
 *      value: number,
 *     lastUpdate: number,
 *      causes: Cause[],
 * }}
 */
export let status = {
    "taxes": {
        value: 0,
    lastUpdate: 0,
        causes: [],
    },
    "debt": {
        value: 0,
    lastUpdate: 0,
        causes: [],
    },
    "economy": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "wage_income", yIntercept: -0.1, factor: 0.25, inertia: 0,
                formula: function() {return this.yIntercept + status['wage_income'].value / 100 * this.factor}},
            {cause: "poverty", yIntercept: 0.1, factor: -0.2, inertia: 0,
                formula: function() {return this.yIntercept + crisis['poverty'].value / 100 * this.factor}},
            {cause: "unemployment", yIntercept: -0.05, factor: -0.1, inertia: 0,
                formula: function() {return this.yIntercept + crisis['unemployment'].value / 100 * this.factor}},
        ],
    },
    "disease_control": {
        value: 0,
    lastUpdate: 0,
        causes: [],
    },
    "health_workers": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "infectious_disease", yIntercept: -0.05, factor: -0.2, inertia: 0,
                formula: function() {return this.yIntercept + crisis['infectious_disease'].value / 100 * this.factor}},
        ],
    },
    "public_health": {
        value: 0,
    lastUpdate: 0,
        causes: [],
    },
    "healthcare_system": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "health_worker_shortage", yIntercept: 0.1, factor: -0.3, inertia: 0,
                formula: function() {return this.yIntercept + crisis['health_worker_shortage'].value / 100 * this.factor}},
        ],
    },
    "education_system": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "teacher_shortage", yIntercept: -0.1, factor: 0.2, inertia: 0,
                formula: function() {return this.yIntercept + crisis['teacher_shortage'].value / 100 * this.factor}},
        ],
    },
    "teachers": {
        value: 0,
    lastUpdate: 0,
        causes: [],
    },
    "research": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "low_education", yIntercept: -0.05, factor: 0.3, inertia: 0,
                formula: function() {return this.yIntercept + crisis['low_education'].value / 100 * this.factor}},
        ],
    },
    "social_security": {
        value: 0,
    lastUpdate: 0,
        causes: [],
    },
    "empowerment": {
        value: 0,
    lastUpdate: 0,
        causes: [],
    },
    "population_control": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "infectious_disease", yIntercept: 0.05, factor: -0.25, inertia: 0,
                formula: function() {return this.yIntercept + crisis['infectious_disease'].value / 100 * this.factor}},
            {cause: "chronic_disease", yIntercept: 0.05, factor: -0.15, inertia: 0,
                formula: function() {return this.yIntercept + crisis['chronic_disease'].value / 100 * this.factor}},
        ],
    },
    "wage_income": {
        value: 0,
    lastUpdate: 0,
        causes: [],
    },
    "work_environment": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "discrimination", yIntercept: 0.05, factor: -0.2, inertia: 0,
                formula: function() {return this.yIntercept + crisis['discrimination'].value / 100 * this.factor}},
        ],
    },
    "productive_workers": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "dropout_crisis", yIntercept: 0.1, factor: -0.25, inertia: 0,
                formula: function() {return this.yIntercept + crisis['dropout_crisis'].value / 100 * this.factor}},
            {cause: "low_education", yIntercept: 0.05, factor: -0.15, inertia: 0,
                formula: function() {return this.yIntercept + crisis['low_education'].value / 100 * this.factor}},
            {cause: "skill_shortage", yIntercept: 0.05, factor: -0.1, inertia: 0,
                formula: function() {return this.yIntercept + crisis['skill_shortage'].value / 100 * this.factor}},
        ],
    },
    "jobs": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "healthcare_collapse", yIntercept: 0.05, factor: -0.1, inertia: 0,
                formula: function() {return this.yIntercept + crisis['healthcare_collapse'].value / 100 * this.factor}},
            {cause: "bankruptcies", yIntercept: 0.1, factor: -0.3, inertia: 0,
                formula: function() {return this.yIntercept + crisis['bankruptcies'].value / 100 * this.factor}},
        ],
    },
    "justice_system": {
        value: 0,
    lastUpdate: 0,
        causes: [],
    },
    "governance": {
        value: 0,
    lastUpdate: 0,
        causes: [],
    },
    "media_neutrality": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "discrimination", yIntercept: 0.1, factor: -0.25, inertia: 0,
                formula: function() {return this.yIntercept + crisis['discrimination'].value / 100 * this.factor}},
        ],
    },
    "security": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "cyber_attack", yIntercept: 0.05, factor: -0.1, inertia: 0,
                formula: function() {return this.yIntercept + crisis['cyber_attack'].value / 100 * this.factor}},
            {cause: "terrorism", yIntercept: 0.1, factor: -0.3, inertia: 0,
                formula: function() {return this.yIntercept + crisis['terrorism'].value / 100 * this.factor}},
            {cause: "war_aggression", yIntercept: 0.15, factor: -0.3, inertia: 0,
                formula: function() {return this.yIntercept + crisis['war_aggression'].value / 100 * this.factor}},
            {cause: "separatist_groups", yIntercept: 0.1, factor: -0.15, inertia: 0,
                formula: function() {return this.yIntercept + crisis['separatist_groups'].value / 100 * this.factor}},
            {cause: "social_unrest", yIntercept: 0.1, factor: -0.2, inertia: 0,
                formula: function() {return this.yIntercept + crisis['social_unrest'].value / 100 * this.factor}},
            {cause: "conflicts", yIntercept: 0.1, factor: -0.2, inertia: 0,
                formula: function() {return this.yIntercept + crisis['conflicts'].value / 100 * this.factor}},
            {cause: "crime_violence", yIntercept: 0.05, factor: -0.15, inertia: 0,
                formula: function() {return this.yIntercept + crisis['crime_violence'].value / 100 * this.factor}},
        ],
    },
    "communication_information": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "power_energy", yIntercept: -0.1, factor: 0.2, inertia: 0,
                formula: function() {return this.yIntercept + status['power_energy'].value / 100 * this.factor}},
        ],
    },
    "transportation": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "technology_lag", yIntercept: 0.05, factor: -0.2, inertia: 0,
                formula: function() {return this.yIntercept + crisis['technology_lag'].value / 100 * this.factor}},
            {cause: "mineral_scarcity", yIntercept: 0.05, factor: -0.15, inertia: 0,
                formula: function() {return this.yIntercept + crisis['mineral_scarcity'].value / 100 * this.factor}},
        ],
    },
    "power_energy": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "technology_lag", yIntercept: 0.05, factor: -0.15, inertia: 0,
                formula: function() {return this.yIntercept + crisis['technology_lag'].value / 100 * this.factor}},
            {cause: "mineral_scarcity", yIntercept: 0.05, factor: -0.2, inertia: 0,
                formula: function() {return this.yIntercept + crisis['mineral_scarcity'].value / 100 * this.factor}},
        ],
    },
    "urban_housing": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "overpopulation", yIntercept: 0.05, factor: -0.2, inertia: 0,
                formula: function() {return this.yIntercept + crisis['overpopulation'].value / 100 * this.factor}},
            {cause: "power_energy", yIntercept: 0.05, factor: 0.15, inertia: 0,
                formula: function() {return this.yIntercept + status['power_energy'].value / 100 * this.factor}},
        ],
    },
    "pollution_control": {
        value: 0,
    lastUpdate: 0,
        causes: [],
    },
    "forest": {
        value: 0,
    lastUpdate: 0,
        causes: [],
    },
    "biodiversity": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "pollution", yIntercept: 0.1, factor: -0.2, inertia: 0,
                formula: function() {return this.yIntercept + crisis['pollution'].value / 100 * this.factor}},
            {cause: "deforestation", yIntercept: 0.1, factor: -0.25, inertia: 0,
                formula: function() {return this.yIntercept + crisis['deforestation'].value / 100 * this.factor}},
            {cause: "overfishing", yIntercept: 0.05, factor: -0.2, inertia: 0,
                formula: function() {return this.yIntercept + crisis['overfishing'].value / 100 * this.factor}},
        ],
    },
    "marine": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "overfishing", yIntercept: 0.1, factor: -0.3, inertia: 0,
                formula: function() {return this.yIntercept + crisis['overfishing'].value / 100 * this.factor}},
        ],
    },
    "investment": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "inflation", yIntercept: 0.1, factor: -0.2, inertia: 0,
                formula: function() {return this.yIntercept + crisis['inflation'].value / 100 * this.factor}},
            {cause: "infectious_disease", yIntercept: 0.05, factor: -0.1, inertia: 0,
                formula: function() {return this.yIntercept + crisis['infectious_disease'].value / 100 * this.factor}},
            {cause: "chronic_disease", yIntercept: 0.05, factor: -0.1, inertia: 0,
                formula: function() {return this.yIntercept + crisis['chronic_disease'].value / 100 * this.factor}},
            {cause: "skill_shortage", yIntercept: 0.1, factor: -0.25, inertia: 0,
                formula: function() {return this.yIntercept + crisis['skill_shortage'].value / 100 * this.factor}},
            {cause: "unemployment", yIntercept: 0.05, factor: -0.1, inertia: 0,
                formula: function() {return this.yIntercept + crisis['unemployment'].value / 100 * this.factor}},
            {cause: "black_market", yIntercept: 0.05, factor: -0.2, inertia: 0,
                formula: function() {return this.yIntercept + crisis['black_market'].value / 100 * this.factor}},
            {cause: "taxes", yIntercept: 0.15, factor: -0.2, inertia: 0,
                formula: function() {return this.yIntercept + status['taxes'].value / 100 * this.factor}},
            {cause: "security", yIntercept: 0.05, factor: 0.2, inertia: 0,
                formula: function() {return this.yIntercept + status['security'].value / 100 * this.factor}},

        ],
    },
    "mineral_oil_industry": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "low_investment", yIntercept: 0.1, factor: -0.2, inertia: 0,
                formula: function() {return this.yIntercept + crisis['low_investment'].value / 100 * this.factor}},

        ],
    },
    "manufacturing": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "low_investment", yIntercept: 0.1, factor: -0.2, inertia: 0,
                formula: function() {return this.yIntercept + crisis['low_investment'].value / 100 * this.factor}},

        ],
    },
    "agriculture": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "water_land", yIntercept: -0.1, factor: -0.2, inertia: 0,
                formula: function() {return this.yIntercept + status['water_land'].value / 100 * this.factor}},
            {cause: "low_investment", yIntercept: -0.05, factor: 0.2, inertia: 0,
                formula: function() {return this.yIntercept + crisis['low_investment'].value / 100 * this.factor}},

        ],
    },
    "fisheries": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "water_land", yIntercept: -0.15, factor: 0.25, inertia: 0,
                formula: function() {return this.yIntercept + status['water_land'].value / 100 * this.factor}},
            {cause: "marine", yIntercept: -0.1, factor: 0.2, inertia: 0,
                formula: function() {return this.yIntercept + status['marine'].value / 100 * this.factor}},
            {cause: "low_investment", yIntercept: 0.1, factor: 0.2, inertia: 0,
                formula: function() {return this.yIntercept + crisis['low_investment'].value / 100 * this.factor}},

        ],
    },
    "tourism_creative": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "security", yIntercept: -0.1, factor: -0.25, inertia: 0,
                formula: function() {return this.yIntercept + status['security'].value / 100 * this.factor}},
            {cause: "low_investment", yIntercept: 0.1, factor: -0.2, inertia: 0,
                formula: function() {return this.yIntercept + crisis['low_investment'].value / 100 * this.factor}},
            {cause: "infectious_disease", yIntercept: 0.05, factor: -0.2, inertia: 0,
                formula: function() {return this.yIntercept + crisis['infectious_disease'].value / 100 * this.factor}},
            {cause: "housing_crisis", yIntercept: 0.1, factor: -0.1, inertia: 0,
                formula: function() {return this.yIntercept + crisis['housing_crisis'].value / 100 * this.factor}},
            {cause: "pollution", yIntercept: 0.05, factor: -0.1, inertia: 0,
                formula: function() {return this.yIntercept + crisis['pollution'].value / 100 * this.factor}},
            {cause: "biodiversity_loss", yIntercept: 0.05, factor: -0.1, inertia: 0,
                formula: function() {return this.yIntercept + crisis['biodiversity_loss'].value / 100 * this.factor}},
        ],
    },
    "sustainability": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "research", yIntercept: 0.05, factor: 0.35, inertia: 0,
                formula: function() {return this.yIntercept + status['research'].value / 100 * this.factor}},
        ],
    },
    "foreign_relations": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "political_instability", yIntercept: 0.1, factor: -0.2, inertia: 0,
                formula: function() {return this.yIntercept + crisis['political_instability'].value / 100 * this.factor}},
        ],
    },
    "defense_force": {
        value: 0,
    lastUpdate: 0,
        causes: [],
    },
    "defense_infrastructure": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "technology_lag", yIntercept: 0.1, factor: -0.3, inertia: 0,
                formula: function() {return this.yIntercept + crisis['technology_lag'].value / 100 * this.factor}},
        ],
    },
    "mineral_oil": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "mineral_oil_industry", yIntercept: 0.05, factor: -0.2, inertia: 0,
                formula: function() {return this.yIntercept + status['mineral_oil_industry'].value / 100 * this.factor}},
            {cause: "sustainability", yIntercept: 0.05, factor: 0.15, inertia: 0,
                formula: function() {return this.yIntercept + status['sustainability'].value / 100 * this.factor}},
        ],
    },
    "water_land": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "biodiversity", yIntercept: -0.1, factor: 0.2, inertia: 0,
                formula: function() {return this.yIntercept + status['biodiversity'].value / 100 * this.factor}},
            {cause: "overpopulation", yIntercept: 0.1, factor: -0.25, inertia: 0,
                formula: function() {return this.yIntercept + crisis['overpopulation'].value / 100 * this.factor}},
        ],
    },
    "food_sources": {
        value: 0,
    lastUpdate: 0,
        causes: [
            {cause: "forest", yIntercept: -0.1, factor: 0.25, inertia: 0,
                formula: function() {return this.yIntercept + status['forest'].value / 100 * this.factor}},
            {cause: "biodiversity", yIntercept: -0.1, factor: 0.2, inertia: 0,
                formula: function() {return this.yIntercept + status['biodiversity'].value / 100 * this.factor}},
            {cause: "marine", yIntercept: -0.05, factor: 0.15, inertia: 0,
                formula: function() {return this.yIntercept + status['marine'].value / 100 * this.factor}},
            {cause: "overfishing", yIntercept: 0.1, factor: -0.2, inertia: 0,
                formula: function() {return this.yIntercept + crisis['overfishing'].value / 100 * this.factor}},
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
    let totalUpdate = 0;
    for (const cause of status[variable].causes) {
        const update = cause.formula();
        status[variable].value += update;
        totalUpdate += update;
    }
    status[variable].lastUpdate = totalUpdate;
}