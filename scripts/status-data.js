import { crisis } from "./crisis-data.js";
import { updateIncomeFromIndustry } from "./fiscal-data.js";
import { policy } from "./policy-data.js";
import { getObjectbyId, getTextById, resetScrollablePosition, setScrollableHeight, toDeltaFormat } from "./utils.js";

/**
 * @typedef {{
*     cause: string,
*     yIntercept: number,
*     inertia: number,
*     factor: number,
*     formula: function(),
* }} Cause
*/

/**
 * @type {{
 * [key: string]: {
 *      name: string,
 *      description: string,
 *      value: number,
 *      causeValue: number,
 *      policyValue: number,
 *      lastUpdateCause: number,
 *      lastUpdatePolicy: number,
 *      type: "finance" | "health" | "education" | "social" | "environment" | "nature" | "infrastructure" | "industry" | "defense" | "stability" | "labor",
 *      affectsIncome: boolean,
 *      causes: Cause[],
 * }}}
 */
export let status = {
    "taxes": {
        name: "Taxes",
        description: "The perception of taxe rates.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "finance",
        affectsIncome: false,
        causes: [],
    },
    "debt": {
        name: "Debt",
        description: "The perception of debt-to-income ratio.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "finance",
        affectsIncome: false,
        causes: [],
    },
    "economy": {
        name: "Economy",
        description: "The state of the economy.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "finance",
        affectsIncome: false,
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
        description: "Effectiveness of disease prevention and control.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "health",
        affectsIncome: false,
        causes: [],
    },
    "health_workers": {
        name: "Health Workers",
        description: "Situation of health worker availability and competency.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "health",
        affectsIncome: false,
        causes: [
            {
                cause: "infectious_disease", yIntercept: -0.05, factor: -0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['infectious_disease'].value / 100 * this.factor }
            },
        ],
    },
    "public_health": {
        name: "Public Health",
        description: "The state of the population well-being and health.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "health",
        affectsIncome: false,
        causes: [],
    },
    "healthcare_system": {
        name: "Healthcare System",
        description: "Quality and accessibility of healthcare.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "health",
        affectsIncome: false,
        causes: [
            {
                cause: "health_worker_shortage", yIntercept: 0.1, factor: -0.3, inertia: 0,
                formula: function () { return this.yIntercept + crisis['health_worker_shortage'].value / 100 * this.factor }
            },
        ],
    },
    "education_system": {
        name: "Education System",
        description: "Quality and accessibility of education.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "education",
        affectsIncome: false,
        causes: [
            {
                cause: "teacher_shortage", yIntercept: -0.1, factor: 0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['teacher_shortage'].value / 100 * this.factor }
            },
        ],
    },
    "teachers": {
        name: "Teachers",
        description: "Situation of teacher availability and competency.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "education",
        affectsIncome: false,
        causes: [],
    },
    "research": {
        name: "Research",
        description: "The state and quality of researches.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "education",
        affectsIncome: false,
        causes: [
            {
                cause: "low_education", yIntercept: -0.05, factor: 0.3, inertia: 0,
                formula: function () { return this.yIntercept + crisis['low_education'].value / 100 * this.factor }
            },
        ],
    },
    "social_security": {
        name: "Social Security",
        description: "Safety nets for the population in need of assistance.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "social",
        affectsIncome: false,
        causes: [],
    },
    "empowerment": {
        name: "Empowerment",
        description: "Assistance for the population to be self-sufficient and independent.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "social",
        affectsIncome: false,
        causes: [],
    },
    "population_control": {
        name: "Population Control",
        description: "The state of population growth and control.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "social",
        affectsIncome: false,
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
        description: "Wage and income situation per capita.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "labor",
        affectsIncome: false,
        causes: [],
    },
    "work_environment": {
        name: "Work Environment",
        description: "Work environment and conditions for workers.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "labor",
        affectsIncome: false,
        causes: [
            {
                cause: "discrimination", yIntercept: 0.05, factor: -0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['discrimination'].value / 100 * this.factor }
            },
        ],
    },
    "productive_workers": {
        name: "Productive Workers",
        description: "Workforce availability, productivity, and efficiency.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "labor",
        affectsIncome: false,
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
        description: "Jobs availability, quality, and security.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "labor",
        affectsIncome: false,
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
        description: "Justice system's ability to enforce the law and protect the people.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "stability",
        affectsIncome: false,
        causes: [],
    },
    "governance": {
        name: "Governance",
        description: "Perception of the government's ability to govern the country.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "stability",
        affectsIncome: false,
        causes: [],
    },
    "media_neutrality": {
        name: "Media Neutrality",
        description: "The media's ability to report the truth without bias or censorship.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "stability",
        affectsIncome: false,
        causes: [
            {
                cause: "discrimination", yIntercept: 0.1, factor: -0.25, inertia: 0,
                formula: function () { return this.yIntercept + crisis['discrimination'].value / 100 * this.factor }
            },
        ],
    },
    "security": {
        name: "Security",
        description: "Tthe country's security and safety from internal and external threats.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "stability",
        affectsIncome: false,
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
        description: "Quality and accessibility of communication and information services.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "infrastructure",
        affectsIncome: false,
        causes: [
            {
                cause: "power_energy", yIntercept: -0.1, factor: 0.2, inertia: 0,
                formula: function () { return this.yIntercept + status['power_energy'].value / 100 * this.factor }
            },
        ],
    },
    "transportation": {
        name: "Transportation",
        description: "Quality and accessibility of transportation services.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "infrastructure",
        affectsIncome: false,
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
        description: "Quality and availability of power and energy infrastructure.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "infrastructure",
        affectsIncome: false,
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
        description: "Availability and quality of housing in urban areas.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "infrastructure",
        affectsIncome: false,
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
        description: "Quality of pollution control and waste management services.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "environment",
        affectsIncome: false,
        causes: [],
    },
    "forest": {
        name: "Forest",
        description: "Condition of forest areas.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "environment",
        affectsIncome: false,
        causes: [],
    },
    "biodiversity": {
        name: "Biodiversity",
        description: "Condition of biodiversity and ecosystems.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "environment",
        affectsIncome: false,
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
        description: "Condition of marine and ocean areas.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "environment",
        affectsIncome: false,
        causes: [
            {
                cause: "overfishing", yIntercept: 0.1, factor: -0.3, inertia: 0,
                formula: function () { return this.yIntercept + crisis['overfishing'].value / 100 * this.factor }
            },
        ],
    },
    "investment": {
        name: "Investment",
        description: "Level of investment in the country.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "industry",
        affectsIncome: false,
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
        name: "Mineral & Oil Industry",
        description:"The amount and advancement of mineral and oil industry.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "industry",
        affectsIncome: true,
        causes: [
            {
                cause: "low_investment", yIntercept: 0.1, factor: -0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['low_investment'].value / 100 * this.factor }
            },

        ],
    },
    "manufacturing": {
        name: "Manufacturing",
        description: "The amount and advancement of manufacturing industry.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "industry",
        affectsIncome: true,
        causes: [
            {
                cause: "low_investment", yIntercept: 0.1, factor: -0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['low_investment'].value / 100 * this.factor }
            },

        ],
    },
    "agriculture": {
        name: "Agriculture",
        description: "The amount and advancement of agriculture industry.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "industry",
        affectsIncome: true,
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
        description: "The amount and advancement of fisheries industry",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "industry",
        affectsIncome: true,
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
        name: "Tourism and Creative",
        description: "The amount and advancement of tourism and creative industry.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "industry",
        affectsIncome: true,
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
        name: "Sustainability",
        description: "Sustainability practices across all industries.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "industry",
        affectsIncome: false,
        causes: [
            {
                cause: "research", yIntercept: 0.05, factor: 0.35, inertia: 0,
                formula: function () { return this.yIntercept + status['research'].value / 100 * this.factor }
            },
        ],
    },
    "foreign_relations": {
        name: "Foreign Relations",
        description: "The relationship with other countries.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "defense",
        affectsIncome: false,
        causes: [
            {
                cause: "political_instability", yIntercept: 0.1, factor: -0.2, inertia: 0,
                formula: function () { return this.yIntercept + crisis['political_instability'].value / 100 * this.factor }
            },
        ],
    },
    "defense_force": {
        name: "Defense Force",
        description: "The size and advancement of the defense force.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "defense",
        affectsIncome: false,
        causes: [],
    },
    "defense_infrastructure": {
        name: "Defense Infrastructure",
        description: "The quality and advancement of the defense infrastructure.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "defense",
        affectsIncome: false,
        causes: [
            {
                cause: "technology_lag", yIntercept: 0.1, factor: -0.3, inertia: 0,
                formula: function () { return this.yIntercept + crisis['technology_lag'].value / 100 * this.factor }
            },
        ],
    },
    "mineral_oil": {
        name: "Mineral & Oil",
        description: "Availability of mineral and oil resources.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "nature",
        affectsIncome: false,
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
        name: "Water & Land",
        description: "Availability and quality of water and land resources.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "nature",
        affectsIncome: false,
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
        description: "Availability of food sources and quality of food production.",
        value: 0,
        causeValue: 0,
        policyValue: 0,
        lastUpdateCause: 0,
        lastUpdatePolicy: 0,
        type: "nature",
        affectsIncome: false,
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
        status[variable].causeValue = levelVariables[variable];
        status[variable].value = levelVariables[variable];
    }
}

/**
 * Update the status.
 * @param {string} variable The variable.
 */
export function updateStatus(variable) {
    const statusData = status[variable];

    let totalUpdate = 0;
    for (const cause of statusData.causes) {
        const update = cause.formula();
        statusData.causeValue += update;
        statusData.value += update;
        totalUpdate += update;
    }
    statusData.lastUpdateCause = totalUpdate;

    if (statusData.affectsIncome) {
        updateIncomeFromIndustry(variable);
    }
}

export function setupStatusPopUp(statusName, runtime) {
    const statusData = status[statusName];

    const statusTitle = getTextById("status_pop_up_name");
    statusTitle.text = statusData.name;

    const statusDescription = getTextById("status_pop_up_description");
    statusDescription.text = statusData.description;
    
    setupStatusCauses(runtime, statusName);
    setupStatusEffects(runtime, statusName);
}

export function setupStatusCauses(runtime, statusName) {
    const statusData = status[statusName];

    const causeScrollable = getObjectbyId(runtime.objects.ScrollablePanel, "status_causes");
    const initialY = causeScrollable.y + 10;
    let causeCount = 0;
    let instanceX = causeScrollable.x + (causeScrollable.width - 296) / 2;
    let instanceY = initialY;

    for (const causeView of causeScrollable.children()) {
        causeView.destroy();
    }

    // From status causes
    for (const causeObj of statusData.causes) {
        const causeData = status[causeObj.cause] ?? crisis[causeObj.cause];

        causeCount++;
        instanceY = initialY + (causeCount - 1) * 70;

        const causeName = runtime.objects.UIText.createInstance("StatusPopUpMG", instanceX, instanceY, true, "cause_effect_view");
        const causeNameText = status[causeObj.cause] ? "Status: " + causeData.name : "Crisis: " + causeData.name;
        causeName.text = causeNameText;
        causeName.instVars['id'] = causeObj.cause + "_cause";

        const causeValue = causeName.getChildAt(0);
        const value = causeObj.formula();
        causeValue.text = toDeltaFormat(value) + "  per day";

        causeScrollable.addChild(causeName, { transformX: true, transformY: true });
    }

    // From policy
    for (const policyName in policy) {
        const policyData = policy[policyName];
        // console.log("Policy ", policyName);

        for (const effectName in policyData.effects) {
            // console.log("Effect ", effectName);
            if (effectName == statusName) {
                const effectData = policyData.effects[effectName];
                // console.log("Effect data ", effectData.name);

                causeCount++;
                instanceY = initialY + (causeCount - 1) * 70;

                const causeName = runtime.objects.UIText.createInstance("StatusPopUpMG", instanceX, instanceY, true, "cause_effect_view");
                causeName.text = "Policy: " + policyData.name;
                causeName.instVars['id'] = policyData.name + "_cause";

                const causeValue = causeName.getChildAt(0);
                const value = effectData.formula(policyData.value);
                causeValue.text = toDeltaFormat(value);

                causeScrollable.addChild(causeName, { transformX: true, transformY: true });

                continue;
            }
        }
    }
    // console.log("Cause count ", causeCount);
    resetScrollablePosition(causeScrollable);
    setScrollableHeight(runtime, causeScrollable, causeCount, 70, 20, "cause_effect_status_pop_up");
}

export function setupStatusEffects(runtime, statusName) {
    const statusData = status[statusName];

    const effectScrollable = getObjectbyId(runtime.objects.ScrollablePanel, "status_effects");
    const initialY = effectScrollable.y + 10;
    let effectCount = 0;
    let instanceX = effectScrollable.x + (effectScrollable.width - 296) / 2;
    let instanceY = initialY;

    for (const effectView of effectScrollable.children()) {
        effectView.destroy();
    }

    // From other status
    for (const otherStatusName in status) {
        const otherStatusData = status[otherStatusName];

        for (const causeObj of otherStatusData.causes) {
            if (causeObj.cause == statusName) {
                effectCount++;
                instanceY = initialY + (effectCount - 1) * 70;

                const effectName = runtime.objects.UIText.createInstance("StatusPopUpMG", instanceX, instanceY, true, "cause_effect_view");
                effectName.text = "Status: " + otherStatusData.name;
                effectName.instVars['id'] = otherStatusData.name + "_effect";

                const effectValue = effectName.getChildAt(0);
                const value = causeObj.formula();
                effectValue.text = toDeltaFormat(value) + "  per day";

                effectScrollable.addChild(effectName, { transformX: true, transformY: true });
            }
        }
    }

    // From other crisis
    for (const otherCrisisName in crisis) {
        const otherCrisisData = crisis[otherCrisisName];

        for (const causeObj of otherCrisisData.causes) {
            if (causeObj.cause == statusName) {
                effectCount++;
                instanceY = initialY + (effectCount - 1) * 70;

                const effectName = runtime.objects.UIText.createInstance("StatusPopUpMG", instanceX, instanceY, true, "cause_effect_view");
                effectName.text = "Crisis: " + otherCrisisData.name;
                effectName.instVars['id'] = otherCrisisData.name + "_effect";

                const effectValue = effectName.getChildAt(0);
                const value = causeObj.formula();
                effectValue.text = toDeltaFormat(value) + "  per day";

                effectScrollable.addChild(effectName, { transformX: true, transformY: true });
            }
        }
    }

    resetScrollablePosition(effectScrollable);
    setScrollableHeight(runtime, effectScrollable, effectCount, 70, 20, "cause_effect_status_pop_up");
}