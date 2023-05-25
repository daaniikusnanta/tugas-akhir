import { initializeCrisis } from "./crisis-data.js";
import { initializeStatus, status } from "./status-data.js";

/**
 * @type {{[level: number]: {[variable: string]: number}}}
 */
const levelVariables = {
    0: { // test level
        status: {
            taxes: 23,
            debt: 45,
            economy: 89,
            disease_control: 42,
            health_workers: 76,
            public_health: 31,
            healthcare_system: 68,
            education_system: 19,
            teachers: 94,
            research: 61,
            social_security: 12,
            empowerment: 83,
            population_control: 48,
            wage_income: 72,
            work_environment: 27,
            productive_workers: 99,
            jobs: 38,
            justice_system: 81,
            governance: 53,
            media_neutrality: 16,
            security: 67,
            communication_information: 91,
            transportation: 35,
            power_energy: 79,
            urban_housing: 22,
            pollution_control: 64,
            forest: 47,
            biodiversity: 88,
            marine: 29,
            investment: 73,
            mineral_oil_industry: 51,
            manufacture: 96,
            agriculture: 44,
            fisheries: 77,
            tourism_creative: 21,
            sustainability: 58,
            foreign_relation: 11,
            defense_force: 84,
            defense_infrastructure: 37,
            mineral_oil: 69,
            water_land: 26,
            food_sources: 98,
        },
        crisis: {
            inflation: 23,
            recession: 56,
            debt_crisis: 87,
            tax_evasion: 42,
            infectious_disease: 76,
            chronic_disease: 11,
            mental_health_crisis: 34,
            healthcare_collapse: 98,
            health_worker_shortage: 67,
            dropout_crisis: 89,
            low_education_quality: 45,
            teacher_shortage: 78,
            poverty: 12,
            discrimination: 54,
            urban_overcrowding: 21,
            housing_crisis: 90,
            overpopulation: 32,
            pollution: 67,
            deforestation: 43,
            overfishing: 76,
            biodiversity_loss: 98,
            water_scarcity: 23,
            energy_crisis: 56,
            food_insecurity: 87,
            infrastructure_inequality: 42,
            power_crisis: 76,
            skill_shortage: 11,
            unemployment: 34,
            job_loss: 98,
            cyber_attack: 67,
            terrorism: 89,
            war_aggresion: 45,
            separatist_groups: 78,
            misinformation_spread: 12,
            media_bias: 54,
            political_instability: 21,
            social_unrest: 90,
            conflicts: 32,
            crime_violence: 43,
            black_market: 76,
            low_investment: 98,
            bankruptcies: 23,
        }
    },
};

/**
 * Sets the level variables to the given level.
 * @param {number} level The level to set the variables to.
 * @param {IRuntime} runtime The runtime scene.
*/  
export function setLevelVariables(level, runtime) {
    initializeStatus(levelVariables[level]['status']);
    initializeCrisis(levelVariables[level]['crisis']);
    
    let statusTexts = runtime.objects.UIText.getAllInstances();
    statusTexts = statusTexts.filter(text => text.instVars['id'].endsWith("_status"));

    for (const statusText of statusTexts) {
        const id = statusText.instVars['id'];
        const statusValue = status[id.substring(0, id.indexOf("_status"))].toString();
        statusText.text = statusValue;
    }

    const statusBars = document.querySelectorAll('.status_bar');
    for (const statusBar of statusBars) {
        statusBar.value = status[statusBar.id];
    }
}