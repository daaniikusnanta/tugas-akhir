import { createMachine } from "./fsm.js";

export let crisis = {
    "inflation": 0,
    "recession": 0,
    "debt_crisis": 0,
    "tax_evasion": 0,
    "infectious_disease": 0,
    "chronic_disease": 0,
    "mental_health_crisis": 0,
    "healthcare_collapse": 0,
    "health_worker_shortage": 0,
    "dropout_crisis": 0,
    "low_education_quality": 0,
    "teacher_shortage": 0,
    "poverty": 0,
    "discrimination": 0,
    "urban_overcrowding": 0,
    "housing_crisis": 0,
    "overpopulation": 0,
    "pollution": 0,
    "deforestation": 0,
    "overfishing": 0,
    "biodiversity_loss": 0,
    "water_scarcity": 0,
    "energy_crisis": 0,
    "food_insecurity": 0,
    "infrastructure_inequality": 0,
    "power_crisis": 0,
    "skill_shortage": 0,
    "unemployment": 0,
    "job_loss": 0,
    "cyber_attack": 0,
    "terrorism": 0,
    "war_aggresion": 0,
    "separatist_groups": 0,
    "misinformation_spread": 0,
    "media_bias": 0,
    "political_instability": 0,
    "social_unrest": 0,
    "conflicts": 0,
    "crime_violence": 0,
    "black_market": 0,
    "low_investment": 0,
    "bankruptcies": 0,
}

/**
 * Initialize the crisis.
 * @param {*} levelVariables The level variables.
 */
export function initializeCrisis(levelVariables) {
    for (const variable in levelVariables) {
        crisis[variable] = levelVariables[variable];
    }
}

/**
 * Update the crisis.
 * @param {string} variable The variable.
 * @param {number} value The value.
 */
export function updateCrisis(variable, value) {
    crisis[variable] = value;
}

// export const fsmInflation = createMachine({
//     initialState: "0",
//     states: {
//         "0": {
//             actions: {
//                 onEnter: () => {
//                     runtime.objects.InflationState.getFirstInstance().text = "Low";
//                     console.log("Inflation LOW is now " + inflation);
//                 }
//             },
//             transitions: [
//                 {
//                     target: "1",
//                     condition: {
//                         evaluate: () => 
//                             inflation >= 30,
//                     }
//                 }
//             ]
//         },
//         "1": {
//             actions: {
//                 onEnter: () => {
//                     runtime.objects.InflationState.getFirstInstance().text = "Medium";
//                     console.log("Inflation MEDIUM is now " + inflation);
//                 }
//             },
//             transitions: [
//                 {
//                     target: "2",
//                     condition: {
//                         evaluate: () => 
//                             inflation >= 60,
//                     }
//                 },
//                 {
//                     target: "0",
//                     condition: {
//                         evaluate: () => 
//                             inflation < 30,
//                     }
//                 }
//             ]
//         },
//         "2": {
//             actions: {
//                 onEnter: () => {
//                     runtime.objects.InflationState.getFirstInstance().text = "High";
//                     console.log("Inflation HIGH is now " + inflation);
//                 }
//             },
//             transitions: [
//                 {
//                     target: "1",
//                     condition: {
//                         evaluate: () => 
//                             inflation < 60,
//                     }
//                 },
//                 {
//                     target: "3",
//                     condition: {
//                         evaluate: () => 
//                             inflation >= 90,
//                     }
//                 }
//             ]
//         },
//         "3": {
//             actions: {
//                 onEnter: () => {
//                     console.log("Inflation EXTREME is now " + inflation);
//                 }
//             },
//             transitions: [
//                 {
//                     target: "2",
//                     condition: {
//                         evaluate: () => 
//                             inflation < 90,
//                     }
//                 }
//             ]
//         }
//     }
// })