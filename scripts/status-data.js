import { crisis } from "./crisis-data.js";

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
        name: "Taxes",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "finance",
        causes: [],
    },
    "debt": {
        name: "Debt",
        description: "The amount of debt",
        value: 0,
        lastUpdate: 0,
        type: "finance",
        causes: [],
    },
    "economy": {
        name: "Economy",
        description: "The state of the economy.",
        value: 0,
        lastUpdate: 0,
        type: "finance",
        causes: [
            {
                cause: "wage_income", yIntercept: -0.1, factor: 0.25, inertia: 0,
                formula: function () { return this.yIntercept + status['wage_income'].value / 100 * this.factor }
            },
            {
                cause: "poverty", yIntercept: 0.1, factor: -0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['poverty'].value / 100 * this.factor }
            },
            {
                cause: "unemployment", yIntercept: -0.05, factor: -0.1, inertia: 0,
                formula: function () { return this.yIntercept + crisis['unemployment'].value / 100 * this.factor }
            },
        ],
    },
    "disease_control": {
        name: "Disease Control",
        description: "The state of the disease control.",
        value: 0,
        lastUpdate: 0,
        type: "health",
        causes: [],
    },
    "health_workers": {
        name: "Health Workers",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "health",
        causes: [
            {
                cause: "infectious_disease", yIntercept: -0.05, factor: -0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['infectious_disease'].value / 100 * this.factor }
            },
        ],
    },
    "public_health": {
        name: "Public Health",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "health",
        causes: [],
    },
    "healthcare_system": {
        name: "Healthcare System",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "health",
        causes: [
            {
                cause: "health_worker_shortage", yIntercept: 0.1, factor: -0.3, inertia: 0,
                formula: function () { return this.yIntercept + crisis['health_worker_shortage'].value / 100 * this.factor }
            },
        ],
    },
    "education_system": {
        name: "Education System",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "education",
        causes: [
            {
                cause: "teacher_shortage", yIntercept: -0.1, factor: 0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['teacher_shortage'].value / 100 * this.factor }
            },
        ],
    },
    "teachers": {
        name: "Teachers",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "education",
        causes: [],
    },
    "research": {
        name: "Research",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "education",
        causes: [
            {
                cause: "low_education", yIntercept: -0.05, factor: 0.3, inertia: 0,
                formula: function () { return this.yIntercept + crisis['low_education'].value / 100 * this.factor }
            },
        ],
    },
    "social_security": {
        name: "Social Security",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "social",
        causes: [],
    },
    "empowerment": {
        name: "Empowerment",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "social",
        causes: [],
    },
    "population_control": {
        name: "Population Control",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "social",
        causes: [
            {
                cause: "infectious_disease", yIntercept: 0.05, factor: -0.25, inertia: 0,
                formula: function () { return this.yIntercept + crisis['infectious_disease'].value / 100 * this.factor }
            },
            {
                cause: "chronic_disease", yIntercept: 0.05, factor: -0.15, inertia: 0,
                formula: function () { return this.yIntercept + crisis['chronic_disease'].value / 100 * this.factor }
            },
        ],
    },
    "wage_income": {
        name: "Wage Income",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "labor",
        causes: [],
    },
    "work_environment": {
        name: "Work Environment",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "labor",
        causes: [
            {
                cause: "discrimination", yIntercept: 0.05, factor: -0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['discrimination'].value / 100 * this.factor }
            },
        ],
    },
    "productive_workers": {
        name: "Productive Workers",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "labor",
        causes: [
            {
                cause: "dropout_crisis", yIntercept: 0.1, factor: -0.25, inertia: 0,
                formula: function () { return this.yIntercept + crisis['dropout_crisis'].value / 100 * this.factor }
            },
            {
                cause: "low_education", yIntercept: 0.05, factor: -0.15, inertia: 0,
                formula: function () { return this.yIntercept + crisis['low_education'].value / 100 * this.factor }
            },
            {
                cause: "skill_shortage", yIntercept: 0.05, factor: -0.1, inertia: 0,
                formula: function () { return this.yIntercept + crisis['skill_shortage'].value / 100 * this.factor }
            },
        ],
    },
    "jobs": {
        name: "Jobs",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "labor",
        causes: [
            {
                cause: "healthcare_collapse", yIntercept: 0.05, factor: -0.1, inertia: 0,
                formula: function () { return this.yIntercept + crisis['healthcare_collapse'].value / 100 * this.factor }
            },
            {
                cause: "bankruptcies", yIntercept: 0.1, factor: -0.3, inertia: 0,
                formula: function () { return this.yIntercept + crisis['bankruptcies'].value / 100 * this.factor }
            },
        ],
    },
    "justice_system": {
        name: "Justice System",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "stability",
        causes: [],
    },
    "governance": {
        name: "Governance",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "stability",
        causes: [],
    },
    "media_neutrality": {
        name: "Media Neutrality",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "stability",
        causes: [
            {
                cause: "discrimination", yIntercept: 0.1, factor: -0.25, inertia: 0,
                formula: function () { return this.yIntercept + crisis['discrimination'].value / 100 * this.factor }
            },
        ],
    },
    "security": {
        name: "Security",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "stability",
        causes: [
            {
                cause: "cyber_attack", yIntercept: 0.05, factor: -0.1, inertia: 0,
                formula: function () { return this.yIntercept + crisis['cyber_attack'].value / 100 * this.factor }
            },
            {
                cause: "terrorism", yIntercept: 0.1, factor: -0.3, inertia: 0,
                formula: function () { return this.yIntercept + crisis['terrorism'].value / 100 * this.factor }
            },
            {
                cause: "war_aggression", yIntercept: 0.15, factor: -0.3, inertia: 0,
                formula: function () { return this.yIntercept + crisis['war_aggression'].value / 100 * this.factor }
            },
            {
                cause: "separatist_groups", yIntercept: 0.1, factor: -0.15, inertia: 0,
                formula: function () { return this.yIntercept + crisis['separatist_groups'].value / 100 * this.factor }
            },
            {
                cause: "social_unrest", yIntercept: 0.1, factor: -0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['social_unrest'].value / 100 * this.factor }
            },
            {
                cause: "conflicts", yIntercept: 0.1, factor: -0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['conflicts'].value / 100 * this.factor }
            },
            {
                cause: "crime_violence", yIntercept: 0.05, factor: -0.15, inertia: 0,
                formula: function () { return this.yIntercept + crisis['crime_violence'].value / 100 * this.factor }
            },
        ],
    },
    "communication_information": {
        name: "Communication & Information",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "infrastructure",
        causes: [
            {
                cause: "power_energy", yIntercept: -0.1, factor: 0.2, inertia: 0,
                formula: function () { return this.yIntercept + status['power_energy'].value / 100 * this.factor }
            },
        ],
    },
    "transportation": {
        name: "Transportation",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "infrastructure",
        causes: [
            {
                cause: "technology_lag", yIntercept: 0.05, factor: -0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['technology_lag'].value / 100 * this.factor }
            },
            {
                cause: "mineral_scarcity", yIntercept: 0.05, factor: -0.15, inertia: 0,
                formula: function () { return this.yIntercept + crisis['mineral_scarcity'].value / 100 * this.factor }
            },
        ],
    },
    "power_energy": {
        name: "Power & Energy",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "infrastructure",
        causes: [
            {
                cause: "technology_lag", yIntercept: 0.05, factor: -0.15, inertia: 0,
                formula: function () { return this.yIntercept + crisis['technology_lag'].value / 100 * this.factor }
            },
            {
                cause: "mineral_scarcity", yIntercept: 0.05, factor: -0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['mineral_scarcity'].value / 100 * this.factor }
            },
        ],
    },
    "urban_housing": {
        name: "Urban Housing",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "infrastructure",
        causes: [
            {
                cause: "overpopulation", yIntercept: 0.05, factor: -0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['overpopulation'].value / 100 * this.factor }
            },
            {
                cause: "power_energy", yIntercept: 0.05, factor: 0.15, inertia: 0,
                formula: function () { return this.yIntercept + status['power_energy'].value / 100 * this.factor }
            },
        ],
    },
    "pollution_control": {
        name: "Pollution Control",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "environment",
        causes: [],
    },
    "forest": {
        name: "Forest",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "environment",
        causes: [],
    },
    "biodiversity": {
        name: "Biodiversity",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "environment",
        causes: [
            {
                cause: "pollution", yIntercept: 0.1, factor: -0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['pollution'].value / 100 * this.factor }
            },
            {
                cause: "deforestation", yIntercept: 0.1, factor: -0.25, inertia: 0,
                formula: function () { return this.yIntercept + crisis['deforestation'].value / 100 * this.factor }
            },
            {
                cause: "overfishing", yIntercept: 0.05, factor: -0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['overfishing'].value / 100 * this.factor }
            },
        ],
    },
    "marine": {
        name: "Marine",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "environment",
        causes: [
            {
                cause: "overfishing", yIntercept: 0.1, factor: -0.3, inertia: 0,
                formula: function () { return this.yIntercept + crisis['overfishing'].value / 100 * this.factor }
            },
        ],
    },
    "investment": {
        name: "Investment",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "industry",
        causes: [
            {
                cause: "inflation", yIntercept: 0.1, factor: -0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['inflation'].value / 100 * this.factor }
            },
            {
                cause: "infectious_disease", yIntercept: 0.05, factor: -0.1, inertia: 0,
                formula: function () { return this.yIntercept + crisis['infectious_disease'].value / 100 * this.factor }
            },
            {
                cause: "chronic_disease", yIntercept: 0.05, factor: -0.1, inertia: 0,
                formula: function () { return this.yIntercept + crisis['chronic_disease'].value / 100 * this.factor }
            },
            {
                cause: "skill_shortage", yIntercept: 0.1, factor: -0.25, inertia: 0,
                formula: function () { return this.yIntercept + crisis['skill_shortage'].value / 100 * this.factor }
            },
            {
                cause: "unemployment", yIntercept: 0.05, factor: -0.1, inertia: 0,
                formula: function () { return this.yIntercept + crisis['unemployment'].value / 100 * this.factor }
            },
            {
                cause: "black_market", yIntercept: 0.05, factor: -0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['black_market'].value / 100 * this.factor }
            },
            {
                cause: "taxes", yIntercept: 0.15, factor: -0.2, inertia: 0,
                formula: function () { return this.yIntercept + status['taxes'].value / 100 * this.factor }
            },
            {
                cause: "security", yIntercept: 0.05, factor: 0.2, inertia: 0,
                formula: function () { return this.yIntercept + status['security'].value / 100 * this.factor }
            },

        ],
    },
    "mineral_oil_industry": {
        name: "Mineral Oil Industry",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "industry",
        causes: [
            {
                cause: "low_investment", yIntercept: 0.1, factor: -0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['low_investment'].value / 100 * this.factor }
            },

        ],
    },
    "manufacturing": {
        name: "Manufacturing",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "industry",
        causes: [
            {
                cause: "low_investment", yIntercept: 0.1, factor: -0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['low_investment'].value / 100 * this.factor }
            },

        ],
    },
    "agriculture": {
        name: "Agriculture",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "industry",
        causes: [
            {
                cause: "water_land", yIntercept: -0.1, factor: -0.2, inertia: 0,
                formula: function () { return this.yIntercept + status['water_land'].value / 100 * this.factor }
            },
            {
                cause: "low_investment", yIntercept: -0.05, factor: 0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['low_investment'].value / 100 * this.factor }
            },

        ],
    },
    "fisheries": {
        name: "Fisheries",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "industry",
        causes: [
            {
                cause: "water_land", yIntercept: -0.15, factor: 0.25, inertia: 0,
                formula: function () { return this.yIntercept + status['water_land'].value / 100 * this.factor }
            },
            {
                cause: "marine", yIntercept: -0.1, factor: 0.2, inertia: 0,
                formula: function () { return this.yIntercept + status['marine'].value / 100 * this.factor }
            },
            {
                cause: "low_investment", yIntercept: 0.1, factor: 0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['low_investment'].value / 100 * this.factor }
            },

        ],
    },
    "tourism_creative": {
        name: "Tourism and Creative Industries",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "industry",
        causes: [
            {
                cause: "security", yIntercept: -0.1, factor: -0.25, inertia: 0,
                formula: function () { return this.yIntercept + status['security'].value / 100 * this.factor }
            },
            {
                cause: "low_investment", yIntercept: 0.1, factor: -0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['low_investment'].value / 100 * this.factor }
            },
            {
                cause: "infectious_disease", yIntercept: 0.05, factor: -0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['infectious_disease'].value / 100 * this.factor }
            },
            {
                cause: "housing_crisis", yIntercept: 0.1, factor: -0.1, inertia: 0,
                formula: function () { return this.yIntercept + crisis['housing_crisis'].value / 100 * this.factor }
            },
            {
                cause: "pollution", yIntercept: 0.05, factor: -0.1, inertia: 0,
                formula: function () { return this.yIntercept + crisis['pollution'].value / 100 * this.factor }
            },
            {
                cause: "biodiversity_loss", yIntercept: 0.05, factor: -0.1, inertia: 0,
                formula: function () { return this.yIntercept + crisis['biodiversity_loss'].value / 100 * this.factor }
            },
        ],
    },
    "sustainability": {
        name: "Sustainability and Environment",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "industry",
        causes: [
            {
                cause: "research", yIntercept: 0.05, factor: 0.35, inertia: 0,
                formula: function () { return this.yIntercept + status['research'].value / 100 * this.factor }
            },
        ],
    },
    "foreign_relations": {
        name: "Foreign Relations",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "defense",
        causes: [
            {
                cause: "political_instability", yIntercept: 0.1, factor: -0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['political_instability'].value / 100 * this.factor }
            },
        ],
    },
    "defense_force": {
        name: "Defense Force",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "defense",
        causes: [],
    },
    "defense_infrastructure": {
        name: "Defense Infrastructure",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "defense",
        causes: [
            {
                cause: "technology_lag", yIntercept: 0.1, factor: -0.3, inertia: 0,
                formula: function () { return this.yIntercept + crisis['technology_lag'].value / 100 * this.factor }
            },
        ],
    },
    "mineral_oil": {
        name: "Mineral Oil",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "nature",
        causes: [
            {
                cause: "mineral_oil_industry", yIntercept: 0.05, factor: -0.2, inertia: 0,
                formula: function () { return this.yIntercept + status['mineral_oil_industry'].value / 100 * this.factor }
            },
            {
                cause: "sustainability", yIntercept: 0.05, factor: 0.15, inertia: 0,
                formula: function () { return this.yIntercept + status['sustainability'].value / 100 * this.factor }
            },
        ],
    },
    "water_land": {
        name: "Water and Land",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "nature",
        causes: [
            {
                cause: "biodiversity", yIntercept: -0.1, factor: 0.2, inertia: 0,
                formula: function () { return this.yIntercept + status['biodiversity'].value / 100 * this.factor }
            },
            {
                cause: "overpopulation", yIntercept: 0.1, factor: -0.25, inertia: 0,
                formula: function () { return this.yIntercept + crisis['overpopulation'].value / 100 * this.factor }
            },
        ],
    },
    "food_sources": {
        name: "Food Sources",
        description: "The amount of taxes collected.",
        value: 0,
        lastUpdate: 0,
        type: "nature",
        causes: [
            {
                cause: "forest", yIntercept: -0.1, factor: 0.25, inertia: 0,
                formula: function () { return this.yIntercept + status['forest'].value / 100 * this.factor }
            },
            {
                cause: "biodiversity", yIntercept: -0.1, factor: 0.2, inertia: 0,
                formula: function () { return this.yIntercept + status['biodiversity'].value / 100 * this.factor }
            },
            {
                cause: "marine", yIntercept: -0.05, factor: 0.15, inertia: 0,
                formula: function () { return this.yIntercept + status['marine'].value / 100 * this.factor }
            },
            {
                cause: "overfishing", yIntercept: 0.1, factor: -0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['overfishing'].value / 100 * this.factor }
            },
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