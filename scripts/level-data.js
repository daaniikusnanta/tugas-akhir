import { initializeCrisis } from "./crisis-data.js";
import { initializeStatus, status } from "./status-data.js";
import { updateCrisisView, updateStatusView, setupCrisisViews } from "./game.js";
import { addTextToCache, getObjectbyId, setScrollableHeight } from "./utils.js";

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
            public_health: 67,
            healthcare_system: 68,
            education_system: 75,
            teachers: 94,
            research: 61,
            social_security: 47,
            empowerment: 83,
            population_control: 48,
            wage_income: 72,
            work_environment: 89,
            productive_workers: 99,
            jobs: 78,
            justice_system: 81,
            governance: 78,
            media_neutrality: 93,
            security: 89,
            communication_information: 80,
            transportation: 80,
            power_energy: 79,
            urban_housing: 77,
            pollution_control: 64,
            forest: 98,
            biodiversity: 94,
            marine: 99,
            investment: 79,
            mineral_oil_industry: 75,
            manufacturing: 96,
            agriculture: 80,
            fisheries: 85,
            tourism_creative: 75,
            sustainability: 67,
            foreign_relations: 88,
            defense_force: 84,
            defense_infrastructure: 83,
            mineral_oil: 69,
            water_land: 90,
            food_sources: 98,
        },
        crisis: {
            inflation: 23,
            recession: 1,
            debt_crisis: 3,
            tax_evasion: 4,
            infectious_disease: 12,
            chronic_disease: 11,
            mental_health_crisis: 13,
            healthcare_collapse: 3,
            health_worker_shortage: 7,
            dropout_crisis: 16,
            low_education: 19,
            technology_lag: 23,
            teacher_shortage: 20,
            poverty: 14,
            discrimination: 14,
            urban_overcrowding: 21,
            housing_crisis: 4,
            overpopulation: 24,
            pollution: 18,
            deforestation: 21,
            overfishing: 11,
            biodiversity_loss: 11,
            water_scarcity: 5,
            mineral_scarcity: 4,
            food_insecurity: 5,
            energy_crisis: 8,
            infrastructure_inequality: 10,
            skill_shortage: 11,
            unemployment: 9,
            job_loss: 7,
            cyber_attack: 13,
            terrorism: 10,
            war_aggression: 1,
            separatist_groups: 8,
            misinformation_spread: 12,
            media_bias: 13,
            political_instability: 15,
            social_unrest: 6,
            conflicts: 5,
            crime_violence: 12,
            black_market: 9,
            low_investment: 13,
            bankruptcies: 4,
        }
    },
};

const initialCrisis = {
    "pandemic": {
        name: "Pandemic",
        description: "Pandemic description",
        values: {
            "infectious_disease": 90
        }
    },
    "extreme_poverty": {
        name: "Extreme Poverty",
        description: "Extreme poverty",
        values: {
            "poverty": 70
        }
    }
};

const situationLevel = {
    
};

export let chosenInitialCrisis = initialCrisis[Object.keys(initialCrisis)[0]];

export function setInitialCrisisVariables() {
    const initialCrisisData = initialCrisis[chosenInitialCrisis];

    for (const valueName in initialCrisisData.values) {
        const valueData = status[valueName] ?? crisis[valueName];
        
        valueData.value = initialCrisisData.values[valueName];
    }
}

export function chooseInitialCrisis(initialCrisisName) {
    chosenInitialCrisis = initialCrisisName;
}

/**
 * 
 * @param {*} runtime 
 */
export function createInitialCrisisViews(runtime) {
    const initialCrisisScrollable = getObjectbyId(runtime.objects.ScrollablePanel, "initial_crisis");
    const initialY = initialCrisisScrollable.y + 10;

    for (const initialCrisisVariable in initialCrisis) {
        const initialCrisisData = initialCrisis[initialCrisisVariable];

        const instanceX = initialCrisisScrollable.x + 17;
        const instanceY = initialY + Object.keys(initialCrisis).indexOf(initialCrisisVariable) * 150;

        const initialCrisisName = runtime.objects.UIText.createInstance("CreateCrisisMG", instanceX, instanceY, true, "initial_crisis");
        initialCrisisName.text = initialCrisisData.name;
        initialCrisisName.instVars['id'] = initialCrisisVariable + "_initial_crisis_name";
        addTextToCache(initialCrisisName);

        const initialCrisisDescription = initialCrisisName.getChildAt(0);
        initialCrisisDescription.text = initialCrisisData.description;

        const initialCrisisClickable = initialCrisisName.getChildAt(1);
        initialCrisisClickable.opacity = 0;
        initialCrisisClickable.instVars['clickable'] = true;
        initialCrisisClickable.instVars['selectable'] = true;
        initialCrisisClickable.instVars['panelId'] = initialCrisisScrollable.instVars['id'];
        initialCrisisClickable.instVars['id'] = initialCrisisVariable + "_initial_crisis_clickable";
        initialCrisisClickable.instVars['hasGroup'] = true;
        initialCrisisClickable.instVars['groupId'] = "initial_crisis";

        if (initialCrisisVariable === Object.keys(initialCrisis)[0]) {
            initialCrisisClickable.instVars['isSelected'] = true;
            initialCrisisClickable.opacity = 50;
        }

        console.log(initialCrisisClickable);

        initialCrisisScrollable.addChild(initialCrisisName, { transformX: true, transformY: true });
    }

    setScrollableHeight(runtime, initialCrisisScrollable, Object.keys(initialCrisis).length, 150, 20);
}


/**
 * Sets the level variables to the given level.
 * @param {number} level The level to set the variables to.
 * @param {IRuntime} runtime The runtime scene.
*/  
export function setLevelVariables(level, runtime) {
    initializeStatus(levelVariables[level]['status'], runtime);
    initializeCrisis(levelVariables[level]['crisis'], runtime);
    setupCrisisViews(runtime);
    updateStatusView(runtime);
    updateCrisisView(runtime);
}