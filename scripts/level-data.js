import { initializeStatus, status } from "./status-data.js";

/**
 * @type {{[level: number]: {[variable: string]: number}}}
 */
const levelVariables = {
    0: { // test level
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
};

/**
 * Sets the level variables to the given level.
 * @param {number} level The level to set the variables to.
 * @param {IRuntime} runtime The runtime scene.
*/  
export function setLevelVariables(level, runtime) {
    initializeStatus(levelVariables[level])
    
    let statusTexts = runtime.objects.UIText.getAllInstances();
    statusTexts = statusTexts.filter(text => text.instVars['id'].endsWith("_status"));

    // const statusTexts = document.querySelectorAll('[id$="_status"]');
    for (const statusText of statusTexts) {
        const id = statusText.instVars['id'];
        console.log(id.substring(0, id.indexOf("_status")));
        const statusValue = status[id.substring(0, id.indexOf("_status"))].toString();
        console.log(statusValue);
        statusText.text = statusValue;
    }

    const statusBars = document.querySelectorAll('.status_bar');
    for (const statusBar of statusBars) {
        statusBar.value = status[statusBar.id];
    }
}