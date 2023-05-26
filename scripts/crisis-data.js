import { createMachine } from "./fsm.js";
import { status } from "./status-data.js";

/**
 * @typedef {
 *      target: string,
 *      evaluation: () => boolean
 * } Transition
 */

/**
 * @typedef {
 *      name: string,
 *      transitions: Transition[]
 * } State
 */

/**
 * @typedef {
 *     cause: string, 
 *     y-value: number,
 *     inertia: number,
 *     formula: () => number,
 * } Cause
 */

/**
 * @type {
 * string: {
 *      value: number,
 *      states: State[],
 *      causes: Cause[],
 * }}
 */
export let crisis = {
    "inflation": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['inflation'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['inflation'].value >= 60},
                {target: "low", evaluation: () => crisis['inflation'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['inflation'].value < 60},
                {target: "hyperinflation", evaluation: () => crisis['inflation'].value >= 90},
            ]},
            {name: "hyperinflation", transitions: [
                {target: "high", evaluation: () => crisis['inflation'].value < 90},
            ]},
        ],
        causes: [
            {cause: "taxes", yValue: 0, inertia: 0.1,
                formula: () => status['taxes'].value * 0.1},
            {cause: "economy", yValue: 0, inertia: 0.1,
                formula: () => status['economy'].value * 0.1},
            {cause: "wage_income", yValue: 0, inertia: 0.1,
                formula: () => status['wage_income'].value * 0.1},
            {cause: "security", yValue: 0, inertia: 0.1,
                formula: () => status['security'].value * 0.1},
            {cause: "debt_crisis", yValue: 0, inertia: 0.1,
                formula: () => crisis['debt_crisis'].value * 0.1},
        ],
    },  
    "recession": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['recession'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['recession'].value >= 60},
                {target: "low", evaluation: () => crisis['recession'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['recession'].value < 60},
                {target: "depression", evaluation: () => crisis['recession'].value >= 90},
            ]},
            {name: "depression", transitions: [
                {target: "high", evaluation: () => crisis['recession'].value < 90},
            ]},
        ],
        causes: [
            {cause: "investment", yValue: 0, inertia: 0.1,
                formula: () => status['investment'].value * 0.1},
            {cause: "inflation", yValue: 0, inertia: 0.1,
                formula: () => crisis['inflation'].value * 0.1},
        ],
    },
    "debt_crisis": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['debt_crisis'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['debt_crisis'].value >= 60},
                {target: "low", evaluation: () => crisis['debt_crisis'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['debt_crisis'].value < 60},
                {target: "extreme", evaluation: () => crisis['debt_crisis'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['debt_crisis'].value < 90},
            ]},
        ],
        causes: [
            {cause: "debt", yValue: 0, inertia: 0.1,
                formula: () => status['debt'].value * 0.1},
        ],
    },
    "tax_evasion": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['tax_evasion'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['tax_evasion'].value >= 60},
                {target: "low", evaluation: () => crisis['tax_evasion'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['tax_evasion'].value < 60},
                {target: "extreme", evaluation: () => crisis['tax_evasion'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['tax_evasion'].value < 90},
            ]},
        ],
        causes: [
            {cause: "taxes", yValue: 0, inertia: 0.1,
                formula: () => status['taxes'].value * 0.1},
            {cause: "black_market", yValue: 0, inertia: 0.1,
                formula: () => crisis['black_market'].value * 0.1},
        ],
    },
    "infectious_disease": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['infectious_disease'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['infectious_disease'].value >= 60},
                {target: "low", evaluation: () => crisis['infectious_disease'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['infectious_disease'].value < 60},
                {target: "pandemic", evaluation: () => crisis['infectious_disease'].value >= 90},
            ]},
            {name: "pandemic", transitions: [
                {target: "high", evaluation: () => crisis['infectious_disease'].value < 90},
            ]},
        ],
        causes: [
            {cause: "disease_control", yValue: 0, inertia: 0.1,
                formula: () => status['disease_control'].value * 0.1},
            {cause: "healthcare_system", yValue: 0, inertia: 0.1,
                formula: () => status['healthcare_system'].value * 0.1},
            {cause: "mental_health_crisis", yValue: 0, inertia: 0.1,
                formula: () => crisis['mental_health_crisis'].value * 0.1},
            {cause: "urban_overcrowding", yValue: 0, inertia: 0.1,
                formula: () => crisis['urban_overcrowding'].value * 0.1},
            {cause: "pollution", yValue: 0, inertia: 0.1,
                formula: () => crisis['pollution'].value * 0.1},
            {cause: "water_scarcity", yValue: 0, inertia: 0.1,
                formula: () => crisis['water_scarcity'].value * 0.1},
            {cause: "food_insecurity", yValue: 0, inertia: 0.1,
                formula: () => crisis['food_insecurity'].value * 0.1},
        ],
    },
    "chronic_disease": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['chronic_disease'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['chronic_disease'].value >= 60},
                {target: "low", evaluation: () => crisis['chronic_disease'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['chronic_disease'].value < 60},
                {target: "epidemic", evaluation: () => crisis['chronic_disease'].value >= 90},
            ]},
            {name: "epidemic", transitions: [
                {target: "high", evaluation: () => crisis['chronic_disease'].value < 90},
            ]},
        ],
        causes: [
            {cause: "disease_control", yValue: 0, inertia: 0.1,
                formula: () => status['disease_control'].value * 0.1},
            {cause: "healthcare_system", yValue: 0, inertia: 0.1,
                formula: () => status['healthcare_system'].value * 0.1},
            {cause: "public_health", yValue: 0, inertia: 0.1,
                formula: () => status['public_health'].value * 0.1},
            {cause: "work_environment", yValue: 0, inertia: 0.1,
                formula: () => status['work_environment'].value * 0.1},
            {cause: "pollution", yValue: 0, inertia: 0.1,
                formula: () => crisis['pollution'].value * 0.1},
            {cause: "water_scarcity", yValue: 0, inertia: 0.1,
                formula: () => crisis['water_scarcity'].value * 0.1},
            {cause: "food_insecurity", yValue: 0, inertia: 0.1,
                formula: () => crisis['food_insecurity'].value * 0.1},
        ],
    },
    "mental_health_crisis": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['mental_health_crisis'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['mental_health_crisis'].value >= 60},
                {target: "low", evaluation: () => crisis['mental_health_crisis'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['mental_health_crisis'].value < 60},
                {target: "epidemic", evaluation: () => crisis['mental_health_crisis'].value >= 90},
            ]},
            {name: "epidemic", transitions: [
                {target: "high", evaluation: () => crisis['mental_health_crisis'].value < 90},
            ]},
        ],
        causes: [
            {cause: "public_health", yValue: 0, inertia: 0.1,
                formula: () => status['public_health'].value * 0.1},
            {cause: "tourism_creative", yValue: 0, inertia: 0.1,
                formula: () => status['tourism_creative'].value * 0.1},
            {cause: "inflation", yValue: 0, inertia: 0.1,
                formula: () => crisis['inflation'].value * 0.1},
            {cause: "poverty", yValue: 0, inertia: 0.1,
                formula: () => crisis['poverty'].value * 0.1},
            {cause: "unemployment", yValue: 0, inertia: 0.1,
                formula: () => crisis['unemployment'].value * 0.1},
            {cause: "job_loss", yValue: 0, inertia: 0.1,
                formula: () => crisis['job_loss'].value * 0.1},
        ],
    },
    "healthcare_collapse": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['healthcare_collapse'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['healthcare_collapse'].value >= 60},
                {target: "low", evaluation: () => crisis['healthcare_collapse'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['healthcare_collapse'].value < 60},
                {target: "extreme", evaluation: () => crisis['healthcare_collapse'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['healthcare_collapse'].value < 90},
            ]},
        ],
        causes: [
            {cause: "healthcare_system", yValue: 0, inertia: 0.1,
                formula: () => status['healthcare_system'].value * 0.1},
            {cause: "infectious_disease", yValue: 0, inertia: 0.1,
                formula: () => crisis['infectious_disease'].value * 0.1},
            {cause: "chronic_disease", yValue: 0, inertia: 0.1,
                formula: () => crisis['chronic_disease'].value * 0.1},
        ],
    },
    "health_worker_shortage": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['health_worker_shortage'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['health_worker_shortage'].value >= 60},
                {target: "low", evaluation: () => crisis['health_worker_shortage'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['health_worker_shortage'].value < 60},
                {target: "extreme", evaluation: () => crisis['health_worker_shortage'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['health_worker_shortage'].value < 90},
            ]},
        ],
        causes: [
            {cause: "health_workers", yValue: 0, inertia: 0.1,
                formula: () => status['health_workers'].value * 0.1},
            {cause: "productive_workers", yValue: 0, inertia: 0.1,
                formula: () => status['productive_workers'].value * 0.1},
        ],
    },
    "dropout_crisis": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['dropout_crisis'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['dropout_crisis'].value >= 60},
                {target: "low", evaluation: () => crisis['dropout_crisis'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['dropout_crisis'].value < 60},
                {target: "extreme", evaluation: () => crisis['dropout_crisis'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['dropout_crisis'].value < 90},
            ]},
        ],
        causes: [
            {cause: "education_system", yValue: 0, inertia: 0.1,
                formula: () => status['education_system'].value * 0.1},
            {cause: "poverty", yValue: 0, inertia: 0.1,
                formula: () => crisis['poverty'].value * 0.1},
        ],
    },
    "low_education": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['low_education'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['low_education'].value >= 60},
                {target: "low", evaluation: () => crisis['low_education'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['low_education'].value < 60},
                {target: "extreme", evaluation: () => crisis['low_education'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['low_education'].value < 90},
            ]},
        ],
        causes: [
            {cause: "education_system", yValue: 0, inertia: 0.1,
                formula: () => status['education_system'].value * 0.1},
            {cause: "teachers", yValue: 0, inertia: 0.1,
                formula: () => status['teachers'].value * 0.1},
        ],
    },
    "teacher_shortage": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['teacher_shortage'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['teacher_shortage'].value >= 60},
                {target: "low", evaluation: () => crisis['teacher_shortage'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['teacher_shortage'].value < 60},
                {target: "extreme", evaluation: () => crisis['teacher_shortage'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['teacher_shortage'].value < 90},
            ]},
        ],
        causes: [
            {cause: "teachers", yValue: 0, inertia: 0.1,
                formula: () => status['teachers'].value * 0.1},
            {cause: "skill_shortage", yValue: 0, inertia: 0.1,
                formula: () => crisis['skill_shortage'].value * 0.1},
        ],
    },
    "technology_lag": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['technology_lag'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['technology_lag'].value >= 60},
                {target: "low", evaluation: () => crisis['technology_lag'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['technology_lag'].value < 60},
                {target: "extreme", evaluation: () => crisis['technology_lag'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['technology_lag'].value < 90},
            ]},
        ],
        causes: [
            {cause: "research", yValue: 0, inertia: 0.1,
                formula: () => status['healthcare_system'].value * 0.1},
        ],
    },
    "poverty": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['poverty'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['poverty'].value >= 60},
                {target: "low", evaluation: () => crisis['poverty'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['poverty'].value < 60},
                {target: "extreme", evaluation: () => crisis['poverty'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['poverty'].value < 90},
            ]},
        ],
        causes: [
            {cause: "social_security", yValue: 0, inertia: 0.1,
                formula: () => status['social_security'].value * 0.1},
            {cause: "recession", yValue: 0, inertia: 0.1,
                formula: () => crisis['recession'].value * 0.1},
            {cause: "discrimination", yValue: 0, inertia: 0.1,
                formula: () => crisis['discrimination'].value * 0.1},
        ],
    },
    "discrimination": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['discrimination'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['discrimination'].value >= 60},
                {target: "low", evaluation: () => crisis['discrimination'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['discrimination'].value < 60},
                {target: "extreme", evaluation: () => crisis['discrimination'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['discrimination'].value < 90},
            ]},
        ],
        causes: [
            {cause: "empowerment", yValue: 0, inertia: 0.1,
                formula: () => status['empowerment'].value * 0.1},
            {cause: "justice_system", yValue: 0, inertia: 0.1,
                formula: () => status['justice_system'].value * 0.1},
            {cause: "media_bias", yValue: 0, inertia: 0.1,
                formula: () => crisis['media_bias'].value * 0.1},
            {cause: "misinformation_spread", yValue: 0, inertia: 0.1,
                formula: () => crisis['misinformation_spread'].value * 0.1},
        ],
    },
    "urban_overcrowding": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['urban_overcrowding'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['urban_overcrowding'].value >= 60},
                {target: "low", evaluation: () => crisis['urban_overcrowding'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['urban_overcrowding'].value < 60},
                {target: "extreme", evaluation: () => crisis['urban_overcrowding'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['urban_overcrowding'].value < 90},
            ]},
        ],
        causes: [
            {cause: "water_land", yValue: 0, inertia: 0.1,
                formula: () => status['water_land'].value * 0.1},
            {cause: "transportation", yValue: 0, inertia: 0.1,
                formula: () => status['transportation'].value * 0.1},
            {cause: "urban_housing", yValue: 0, inertia: 0.1,
                formula: () => status['urban_housing'].value * 0.1},
            {cause: "overpopulation", yValue: 0, inertia: 0.1,
                formula: () => crisis['overpopulation'].value * 0.1},
        ],
    },
    "housing_crisis": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['housing_crisis'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['housing_crisis'].value >= 60},
                {target: "low", evaluation: () => crisis['housing_crisis'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['housing_crisis'].value < 60},
                {target: "extreme", evaluation: () => crisis['housing_crisis'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['housing_crisis'].value < 90},
            ]},
        ],
        causes: [
            {cause: "social_security", yValue: 0, inertia: 0.1,
                formula: () => status['social_security'].value * 0.1},
            {cause: "water_land", yValue: 0, inertia: 0.1,
                formula: () => status['water_land'].value * 0.1},
            {cause: "urban_housing", yValue: 0, inertia: 0.1,
                formula: () => status['urban_housing'].value * 0.1},
        ],
    },
    "overpopulation": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['overpopulation'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['overpopulation'].value >= 60},
                {target: "low", evaluation: () => crisis['overpopulation'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['overpopulation'].value < 60},
                {target: "extreme", evaluation: () => crisis['overpopulation'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['overpopulation'].value < 90},
            ]},
        ],
        causes: [
            {cause: "population_control", yValue: 0, inertia: 0.1,
                formula: () => status['population_control'].value * 0.1},
        ],
    },
    "pollution": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['pollution'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['pollution'].value >= 60},
                {target: "low", evaluation: () => crisis['pollution'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['pollution'].value < 60},
                {target: "extreme", evaluation: () => crisis['pollution'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['pollution'].value < 90},
            ]},
        ],
        causes: [
            {cause: "pollution_control", yValue: 0, inertia: 0.1,
                formula: () => status['pollution_control'].value * 0.1},
            {cause: "forest", yValue: 0, inertia: 0.1,
                formula: () => status['forest'].value * 0.1},
            {cause: "marine", yValue: 0, inertia: 0.1,
                formula: () => status['marine'].value * 0.1},
            {cause: "sustainability", yValue: 0, inertia: 0.1,
                formula: () => status['sustainability'].value * 0.1},
        ],
    },
    "deforestation": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['deforestation'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['deforestation'].value >= 60},
                {target: "low", evaluation: () => crisis['deforestation'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['deforestation'].value < 60},
                {target: "extreme", evaluation: () => crisis['deforestation'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['deforestation'].value < 90},
            ]},
        ],
        causes: [
            {cause: "forest", yValue: 0, inertia: 0.1,
                formula: () => status['forest'].value * 0.1},
            {cause: "sustainability", yValue: 0, inertia: 0.1,
                formula: () => status['sustainability'].value * 0.1},
            {cause: "overpopulation", yValue: 0, inertia: 0.1,
                formula: () => crisis['overpopulation'].value * 0.1},
        ],
    },
    "overfishing": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['overfishing'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['overfishing'].value >= 60},
                {target: "low", evaluation: () => crisis['overfishing'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['overfishing'].value < 60},
                {target: "extreme", evaluation: () => crisis['overfishing'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['overfishing'].value < 90},
            ]},
        ],
        causes: [
            {cause: "fisheries", yValue: 0, inertia: 0.1,
                formula: () => status['fisheries'].value * 0.1},
            {cause: "sustainability", yValue: 0, inertia: 0.1,
                formula: () => status['sustainability'].value * 0.1},
        ],
    },
    "biodiversity_loss": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['biodiversity_loss'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['biodiversity_loss'].value >= 60},
                {target: "low", evaluation: () => crisis['biodiversity_loss'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['biodiversity_loss'].value < 60},
                {target: "extreme", evaluation: () => crisis['biodiversity_loss'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['biodiversity_loss'].value < 90},
            ]},
        ],
        causes: [
            {cause: "biodiversity", yValue: 0, inertia: 0.1,
                formula: () => status['healthcare_system'].value * 0.1},
        ],
    },
    "water_scarcity": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['water_scarcity'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['water_scarcity'].value >= 60},
                {target: "low", evaluation: () => crisis['water_scarcity'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['water_scarcity'].value < 60},
                {target: "extreme", evaluation: () => crisis['water_scarcity'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['water_scarcity'].value < 90},
            ]},
        ],
        causes: [
            {cause: "forest", yValue: 0, inertia: 0.1,
                formula: () => status['forest'].value * 0.1},
            {cause: "marine", yValue: 0, inertia: 0.1,
                formula: () => status['marine'].value * 0.1},
            {cause: "water_land", yValue: 0, inertia: 0.1,
                formula: () => status['water_land'].value * 0.1},
        ],
    },
    "mineral_scarcity": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['mineral_scarcity'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['mineral_scarcity'].value >= 60},
                {target: "low", evaluation: () => crisis['mineral_scarcity'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['mineral_scarcity'].value < 60},
                {target: "extreme", evaluation: () => crisis['mineral_scarcity'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['mineral_scarcity'].value < 90},
            ]},
        ],
        causes: [
            {cause: "mineral_oil", yValue: 0, inertia: 0.1,
                formula: () => status['mineral_oil'].value * 0.1},
        ],
    },
    "food_insecurity": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['food_insecurity'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['food_insecurity'].value >= 60},
                {target: "low", evaluation: () => crisis['food_insecurity'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['food_insecurity'].value < 60},
                {target: "extreme", evaluation: () => crisis['food_insecurity'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['food_insecurity'].value < 90},
            ]},
        ],
        causes: [
            {cause: "food_sources", yValue: 0, inertia: 0.1,
                formula: () => status['food_sources'].value * 0.1},
            {cause: "agriculture", yValue: 0, inertia: 0.1,
                formula: () => status['agriculture'].value * 0.1},
            {cause: "fisheries", yValue: 0, inertia: 0.1,
                formula: () => status['fisheries'].value * 0.1},
        ],
    },
    "energy_crisis": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['energy_crisis'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['energy_crisis'].value >= 60},
                {target: "low", evaluation: () => crisis['energy_crisis'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['energy_crisis'].value < 60},
                {target: "extreme", evaluation: () => crisis['energy_crisis'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['energy_crisis'].value < 90},
            ]},
        ],
        causes: [
            {cause: "mineral_oil_industry", yValue: 0, inertia: 0.1,
                formula: () => status['mineral_oil_industry'].value * 0.1},
            {cause: "power_energy", yValue: 0, inertia: 0.1,
                formula: () => status['power_energy'].value * 0.1},
        ],
    },
    "infrastructure_inequality": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['infrastructure_inequality'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['infrastructure_inequality'].value >= 60},
                {target: "low", evaluation: () => crisis['infrastructure_inequality'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['infrastructure_inequality'].value < 60},
                {target: "extreme", evaluation: () => crisis['infrastructure_inequality'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['infrastructure_inequality'].value < 90},
            ]},
        ],
        causes: [
            {cause: "communication_information", yValue: 0, inertia: 0.1,
                formula: () => status['communication_information'].value * 0.1},
            {cause: "transportation", yValue: 0, inertia: 0.1,
                formula: () => status['transportation'].value * 0.1},
        ],
    },
    "skill_shortage": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['skill_shortage'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['skill_shortage'].value >= 60},
                {target: "low", evaluation: () => crisis['skill_shortage'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['skill_shortage'].value < 60},
                {target: "extreme", evaluation: () => crisis['skill_shortage'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['skill_shortage'].value < 90},
            ]},
        ],
        causes: [
            {cause: "low_education", yValue: 0, inertia: 0.1,
                formula: () => crisis['low_education'].value * 0.1},
            {cause: "dropout_crisis", yValue: 0, inertia: 0.1,
                formula: () => crisis['dropout_crisis'].value * 0.1},
            {cause: "discrimination", yValue: 0, inertia: 0.1,
                formula: () => crisis['discrimination'].value * 0.1},
        ],
    },
    "unemployment": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['unemployment'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['unemployment'].value >= 60},
                {target: "low", evaluation: () => crisis['unemployment'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['unemployment'].value < 60},
                {target: "extreme", evaluation: () => crisis['unemployment'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['unemployment'].value < 90},
            ]},
        ],
        causes: [
            {cause: "empowerment", yValue: 0, inertia: 0.1,
                formula: () => status['empowerment'].value * 0.1},
            {cause: "security", yValue: 0, inertia: 0.1,
                formula: () => status['security'].value * 0.1},
            {cause: "manufacturing", yValue: 0, inertia: 0.1,
                formula: () => status['manufacturing'].value * 0.1},
            {cause: "tourism_creative", yValue: 0, inertia: 0.1,
                formula: () => status['tourism_creative'].value * 0.1},
            {cause: "low_education", yValue: 0, inertia: 0.1,
                formula: () => crisis['low_education'].value * 0.1},
            {cause: "dropout_crisis", yValue: 0, inertia: 0.1,
                formula: () => crisis['dropout_crisis'].value * 0.1},
        ],
    },
    "job_loss": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['job_loss'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['job_loss'].value >= 60},
                {target: "low", evaluation: () => crisis['job_loss'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['job_loss'].value < 60},
                {target: "extreme", evaluation: () => crisis['job_loss'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['job_loss'].value < 90},
            ]},
        ],
        causes: [
            {cause: "work_environment", yValue: 0, inertia: 0.1,
                formula: () => status['work_environment'].value * 0.1},
            {cause: "jobs", yValue: 0, inertia: 0.1,
                formula: () => status['jobs'].value * 0.1},
            {cause: "security", yValue: 0, inertia: 0.1,
                formula: () => status['security'].value * 0.1},
            {cause: "wage_income", yValue: 0, inertia: 0.1,
                formula: () => status['wage_income'].value * 0.1},
            {cause: "infectious_disease", yValue: 0, inertia: 0.1,
                formula: () => crisis['infectious_disease'].value * 0.1},
        ],
    },
    "cyber_attack": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['cyber_attack'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['cyber_attack'].value >= 60},
                {target: "low", evaluation: () => crisis['cyber_attack'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['cyber_attack'].value < 60},
                {target: "extreme", evaluation: () => crisis['cyber_attack'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['cyber_attack'].value < 90},
            ]},
        ],
        causes: [
            {cause: "defense_infrastructure", yValue: 0, inertia: 0.1,
                formula: () => status['defense_infrastructure'].value * 0.1},
            {cause: "foreign_relations", yValue: 0, inertia: 0.1,
                formula: () => status['foreign_relations'].value * 0.1},
        ],
    },
    "terrorism": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['terrorism'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['terrorism'].value >= 60},
                {target: "low", evaluation: () => crisis['terrorism'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['terrorism'].value < 60},
                {target: "extreme", evaluation: () => crisis['terrorism'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['terrorism'].value < 90},
            ]},
        ],
        causes: [
            {cause: "defense_infrastructure", yValue: 0, inertia: 0.1,
                formula: () => status['defense_infrastructure'].value * 0.1},
            {cause: "foreign_relations", yValue: 0, inertia: 0.1,
                formula: () => status['foreign_relations'].value * 0.1},
            {cause: "defense_force", yValue: 0, inertia: 0.1,
                formula: () => status['defense_force'].value * 0.1},
        ],
    },
    "war_aggression": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['war_aggression'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['war_aggression'].value >= 60},
                {target: "low", evaluation: () => crisis['war_aggression'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['war_aggression'].value < 60},
                {target: "extreme", evaluation: () => crisis['war_aggression'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['war_aggression'].value < 90},
            ]},
        ],
        causes: [
            {cause: "foreign_relations", yValue: 0, inertia: 0.1,
                formula: () => status['foreign_relations'].value * 0.1},
            {cause: "defense_force", yValue: 0, inertia: 0.1,
                formula: () => status['defense_force'].value * 0.1},
        ],
    },
    "separatist_groups": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['separatist_groups'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['separatist_groups'].value >= 60},
                {target: "low", evaluation: () => crisis['separatist_groups'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['separatist_groups'].value < 60},
                {target: "extreme", evaluation: () => crisis['separatist_groups'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['separatist_groups'].value < 90},
            ]},
        ],
        causes: [
            {cause: "water_land", yValue: 0, inertia: 0.1,
                formula: () => status['water_land'].value * 0.1},
            {cause: "foreign_relations", yValue: 0, inertia: 0.1,
                formula: () => status['foreign_relations'].value * 0.1},
            {cause: "poverty", yValue: 0, inertia: 0.1,
                formula: () => crisis['poverty'].value * 0.1},
            {cause: "overpopulation", yValue: 0, inertia: 0.1,
                formula: () => crisis['overpopulation'].value * 0.1},
            {cause: "media_bias", yValue: 0, inertia: 0.1,
                formula: () => crisis['media_bias'].value * 0.1},
        ],
    },
    "misinformation_spread": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['misinformation_spread'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['misinformation_spread'].value >= 60},
                {target: "low", evaluation: () => crisis['misinformation_spread'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['misinformation_spread'].value < 60},
                {target: "extreme", evaluation: () => crisis['misinformation_spread'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['misinformation_spread'].value < 90},
            ]},
        ],
        causes: [
            {cause: "media_neutrality", yValue: 0, inertia: 0.1,
                formula: () => status['media_neutrality'].value * 0.1},
            {cause: "communication_information", yValue: 0, inertia: 0.1,
                formula: () => status['communication_information'].value * 0.1},
            {cause: "poverty", yValue: 0, inertia: 0.1,
                formula: () => crisis['poverty'].value * 0.1},
            {cause: "low_education", yValue: 0, inertia: 0.1,
                formula: () => crisis['low_education'].value * 0.1},
            {cause: "unemployment", yValue: 0, inertia: 0.1,
                formula: () => crisis['unemployment'].value * 0.1},
        ],
    },
    "media_bias": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['media_bias'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['media_bias'].value >= 60},
                {target: "low", evaluation: () => crisis['media_bias'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['media_bias'].value < 60},
                {target: "extreme", evaluation: () => crisis['media_bias'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['media_bias'].value < 90},
            ]},
        ],
        causes: [
            {cause: "communication_information", yValue: 0, inertia: 0.1,
                formula: () => status['communication_information'].value * 0.1},
            {cause: "media_neutrality", yValue: 0, inertia: 0.1,
                formula: () => status['media_neutrality'].value * 0.1},
            {cause: "social_unrest", yValue: 0, inertia: 0.1,
                formula: () => crisis['social_unrest'].value * 0.1},
        ],
    },
    "political_instability": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['political_instability'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['political_instability'].value >= 60},
                {target: "low", evaluation: () => crisis['political_instability'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['political_instability'].value < 60},
                {target: "extreme", evaluation: () => crisis['political_instability'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['political_instability'].value < 90},
            ]},
        ],
        causes: [
            {cause: "governance", yValue: 0, inertia: 0.1,
                formula: () => status['governance'].value * 0.1},
            {cause: "misinformation_spread", yValue: 0, inertia: 0.1,
                formula: () => crisis['misinformation_spread'].value * 0.1},
        ],
    },
    "social_unrest": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['social_unrest'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['social_unrest'].value >= 60},
                {target: "low", evaluation: () => crisis['social_unrest'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['social_unrest'].value < 60},
                {target: "extreme", evaluation: () => crisis['social_unrest'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['social_unrest'].value < 90},
            ]},
        ],
        causes: [
            {cause: "recession", yValue: 0, inertia: 0.1,
                formula: () => crisis['recession'].value * 0.1},
            {cause: "infectious_disease", yValue: 0, inertia: 0.1,
                formula: () => crisis['infectious_disease'].value * 0.1},
            {cause: "water_scarcity", yValue: 0, inertia: 0.1,
                formula: () => crisis['water_scarcity'].value * 0.1},
            {cause: "infrastructure_inequality", yValue: 0, inertia: 0.1,
                formula: () => crisis['infrastructure_inequality'].value * 0.1},
            {cause: "energy_crisis", yValue: 0, inertia: 0.1,
                formula: () => crisis['energy_crisis'].value * 0.1},
            {cause: "unemployment", yValue: 0, inertia: 0.1,
                formula: () => crisis['unemployment'].value * 0.1},
            {cause: "political_instability", yValue: 0, inertia: 0.1,
                formula: () => crisis['political_instability'].value * 0.1},
        ],
    },
    "conflicts": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['conflicts'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['conflicts'].value >= 60},
                {target: "low", evaluation: () => crisis['conflicts'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['conflicts'].value < 60},
                {target: "extreme", evaluation: () => crisis['conflicts'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['conflicts'].value < 90},
            ]},
        ],
        causes: [
            {cause: "justice_system", yValue: 0, inertia: 0.1,
                formula: () => status['justice_system'].value * 0.1},
            {cause: "discrimination", yValue: 0, inertia: 0.1,
                formula: () => crisis['discrimination'].value * 0.1},
            {cause: "poverty", yValue: 0, inertia: 0.1,
                formula: () => crisis['poverty'].value * 0.1},
            {cause: "misinformation_spread", yValue: 0, inertia: 0.1,
                formula: () => crisis['misinformation_spread'].value * 0.1},
            {cause: "media_bias", yValue: 0, inertia: 0.1,
                formula: () => crisis['media_bias'].value * 0.1},
        ],
    },
    "crime_violence": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['crime_violence'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['crime_violence'].value >= 60},
                {target: "low", evaluation: () => crisis['crime_violence'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['crime_violence'].value < 60},
                {target: "extreme", evaluation: () => crisis['crime_violence'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['crime_violence'].value < 90},
            ]},
        ],
        causes: [
            {cause: "jobs", yValue: 0, inertia: 0.1,
                formula: () => status['jobs'].value * 0.1},
            {cause: "justice_system", yValue: 0, inertia: 0.1,
                formula: () => status['justice_system'].value * 0.1},
            {cause: "discrimination", yValue: 0, inertia: 0.1,
                formula: () => crisis['discrimination'].value * 0.1},
            {cause: "poverty", yValue: 0, inertia: 0.1,
                formula: () => crisis['poverty'].value * 0.1},
            {cause: "media_bias", yValue: 0, inertia: 0.1,
                formula: () => crisis['media_bias'].value * 0.1},
            {cause: "unemployment", yValue: 0, inertia: 0.1,
                formula: () => crisis['unemployment'].value * 0.1},
            {cause: "black_market", yValue: 0, inertia: 0.1,
                formula: () => crisis['black_market'].value * 0.1},
            {cause: "food_insecurity", yValue: 0, inertia: 0.1,
                formula: () => crisis['food_insecurity'].value * 0.1},
        ],
    },
    "black_market": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['black_market'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['black_market'].value >= 60},
                {target: "low", evaluation: () => crisis['black_market'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['black_market'].value < 60},
                {target: "extreme", evaluation: () => crisis['black_market'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['black_market'].value < 90},
            ]},
        ],
        causes: [
            {cause: "transportation", yValue: 0, inertia: 0.1,
                formula: () => status['transportation'].value * 0.1},
            {cause: "tax_evasion", yValue: 0, inertia: 0.1,
                formula: () => crisis['tax_evasion'].value * 0.1},
            {cause: "inflation", yValue: 0, inertia: 0.1,
                formula: () => crisis['inflation'].value * 0.1},
        ],
    },
    "low_investment": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['low_investment'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['low_investment'].value >= 60},
                {target: "low", evaluation: () => crisis['low_investment'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['low_investment'].value < 60},
                {target: "extreme", evaluation: () => crisis['low_investment'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['low_investment'].value < 90},
            ]},
        ],
        causes: [
            {cause: "investment", yValue: 0, inertia: 0.1,
                formula: () => status['investment'].value * 0.1},
            {cause: "productive_workers", yValue: 0, inertia: 0.1,
                formula: () => status['productive_workers'].value * 0.1},
            {cause: "infrastructure_inequality", yValue: 0, inertia: 0.1,
                formula: () => crisis['infrastructure_inequality'].value * 0.1},
        ],
    },
    "bankruptcies": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['bankruptcies'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['bankruptcies'].value >= 60},
                {target: "low", evaluation: () => crisis['bankruptcies'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['bankruptcies'].value < 60},
                {target: "extreme", evaluation: () => crisis['bankruptcies'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['bankruptcies'].value < 90},
            ]},
        ],
        causes: [
            {cause: "taxes", yValue: 0, inertia: 0.1,
                formula: () => status['taxes'].value * 0.1},
            {cause: "economy", yValue: 0, inertia: 0.1,
                formula: () => status['economy'].value * 0.1},
            {cause: "low_investment", yValue: 0, inertia: 0.1,
                formula: () => crisis['low_investment'].value * 0.1},
        ],
    },
}

/**
* @typedef {{
    *   value: string,
    *   updateState: () => boolean,
    *   tick: () => void
    * }} StateMachine
    */

/**
 * The crisis FSMs.
 * @type {StateMachine[]}
 */
export let crisisFsms = []

/**
 * Initialize the crisis.
 * @param {*} levelVariables The level variables.
 */
export function initializeCrisis(levelVariables) {
    for (const variable in levelVariables) {
        crisis[variable].value = levelVariables[variable];
    }

    for (const variable in crisis) {
        let states = {};
        let initial = null;

        crisis[variable].states.forEach(crisisState => {
            if (!initial) {
                initial = crisisState.name;
            }

            let transitions = [];
            crisisState.transitions.forEach(transition => {
                transitions.push({
                    target: transition.target,
                    condition: {
                        evaluate: transition.evaluation
                    }
                });
            });

            const state = {
                actions: {
                    onEnter : () => {
                        console.log(`Crisis ${variable}: ${crisisState.name}`);
                    }
                },
                transitions: transitions
            }
            states[crisisState.name] = state;
        });

        const fsm = createMachine({
            initialState: initial,
            states: states
        });

        crisisFsms.push(fsm);
    }
}

/**
 * Update the crisis.
 * @param {string} variable The variable.
 */
export function updateCrisis(variable) {
    for (const cause of crisis[variable].causes) {
        const update = cause.formula();
        if (update > 0) {
            crisis[variable].value += update;
            // console.log(cause.cause, "update", variable, update)
        } else {
            crisis[variable].value += cause.yValue;
            // console.log(cause.cause, "y-value", variable, cause.yValue)
        }
    }
}