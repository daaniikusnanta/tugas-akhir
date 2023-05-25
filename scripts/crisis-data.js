import { createMachine } from "./fsm.js";

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

/**
 * @type {
 * string: {
 *      value: number,
 *      states: State[]
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
                {"depression": () => crisis['recession'].value >= 90},
            ]},
            {name: "depression", transitions: [
                {target: "high", evaluation: () => crisis['recession'].value < 90},
            ]},
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
    },
    "low_education_quality": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['low_education_quality'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['low_education_quality'].value >= 60},
                {target: "low", evaluation: () => crisis['low_education_quality'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['low_education_quality'].value < 60},
                {target: "extreme", evaluation: () => crisis['low_education_quality'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['low_education_quality'].value < 90},
            ]},
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
    },
    "power_crisis": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['power_crisis'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['power_crisis'].value >= 60},
                {target: "low", evaluation: () => crisis['power_crisis'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['power_crisis'].value < 60},
                {target: "extreme", evaluation: () => crisis['power_crisis'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['power_crisis'].value < 90},
            ]},
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
    },
    "war_aggresion": {
        value: 0,
        states: [
            {name: "low", transitions: [
                {target: "medium", evaluation: () => crisis['war_aggresion'].value >= 30},
            ]},
            {name: "medium", transitions: [
                {target: "high", evaluation: () => crisis['war_aggresion'].value >= 60},
                {target: "low", evaluation: () => crisis['war_aggresion'].value < 30},
            ]},
            {name: "high", transitions: [
                {target: "medium", evaluation: () => crisis['war_aggresion'].value < 60},
                {target: "extreme", evaluation: () => crisis['war_aggresion'].value >= 90},
            ]},
            {name: "extreme", transitions: [
                {target: "high", evaluation: () => crisis['war_aggresion'].value < 90},
            ]},
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
 * @param {number} value The value.
 */
export function updateCrisis(variable, value) {
    crisis[variable].value = value;
}