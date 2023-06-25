import { initializeCrisis, isCrisisMaximized, isExtremeCrisisEmpty } from "./crisis-data.js";
import { initializeStatus, status } from "./status-data.js";
import { updateCrisisView, updateStatusView, setupCrisisViews } from "./game.js";
import { addTextToCache, getClickablePanelById, getObjectbyId, getTextById, setScrollableHeight, toTitleCase } from "./utils.js";
import { policyMultiplier } from "./policy-data.js";

/**
 * @type {{[level: number]: {[variable: string]: number}}}
 */
const levelVariables = {
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
        agriculture: 56,
        fisheries: 56,
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
};

const initialCrisis = {
    "pandemic": {
        name: "Pandemic",
        description: "A very infectious disease has plagued the world. Focus on your country's condition to prevent more spread.",
        values: {
            "infectious_disease": 90
        }
    },
    "extreme_poverty": {
        name: "Extreme Poverty",
        description: "A majority of population in your country lives below the poverty line. Try to improve their wellbeing.",
        values: {
            "poverty": 70
        }
    }
};

const situationLevel = {
    
};

export let chosenInitialCrisisName = Object.keys(initialCrisis)[0];

export function setInitialCrisisVariables() {
    const initialCrisisData = initialCrisis[chosenInitialCrisisName];
    console.log(chosenInitialCrisisName, initialCrisisData);
    for (const valueName in initialCrisisData.values) {
        let variableData = (levelVariables.status['valueName']) ? levelVariables.status : levelVariables.crisis;
        
        variableData[valueName] = initialCrisisData.values[valueName];
        console.log(levelVariables);
    }
}

export function chooseInitialCrisis(initialCrisisName) {
    console.log(initialCrisisName);
    chosenInitialCrisisName = initialCrisisName;
}

/**
 * 
 * @param {*} runtime 
 */
export function createInitialCrisisViews(runtime) {
    const initialCrisisScrollable = getObjectbyId(runtime.objects.ScrollablePanel, "initial_crisis");
    const initialY = initialCrisisScrollable.y + 30;
    const itemHeight = 160;
    const margin = 10;

    for (const initialCrisisVariable in initialCrisis) {
        const initialCrisisData = initialCrisis[initialCrisisVariable];

        const instanceX = initialCrisisScrollable.x + 30;
        const instanceY = initialY + Object.keys(initialCrisis).indexOf(initialCrisisVariable) * (itemHeight + margin*2);

        const initialCrisisName = runtime.objects.UITextBold.createInstance("CreateCrisisMG", instanceX, instanceY, true, "initial_crisis_view");
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

    setScrollableHeight(runtime, initialCrisisScrollable, Object.keys(initialCrisis).length, itemHeight + margin*2, margin);
}


/**
 * Sets the level variables to the given level.
 * @param {number} level The level to set the variables to.
 * @param {IRuntime} runtime The runtime scene.
*/  
export function setLevelVariables(level, runtime) {
    initializeStatus(levelVariables['status'], runtime);
    initializeCrisis(levelVariables['crisis'], runtime);
    setupCrisisViews(runtime);
    updateStatusView(runtime);
    updateCrisisView(runtime);
}

/**
 * 
 * @param {IRuntime} runtime 
 */
export function checkGameOverCondition(runtime) {
    console.log("Checking game over condition");
    // Win
    if (isExtremeCrisisEmpty()) {
        console.log("Win");
        stopGame(runtime);
        runtime.layout.getLayer("UI").isVisible = false;
        runtime.layout.getLayer("Win").isVisible = true;
    }

    // Lose
    if (isCrisisMaximized()) {
        console.log("Lose");
        stopGame(runtime);
        runtime.layout.getLayer("UI").isVisible = false;
        runtime.layout.getLayer("Lose").isVisible = true;
    }
}

/**
 * 
 * @param {IRuntime} runtime 
 */
function stopGame(runtime) {
    const gameManager = runtime.objects.GameManager.getAllInstances()[0];
    gameManager.behaviors.Timer.stopTimer("Tick");
    runtime.globalVars['isRunning'] = false;
}

export function setupGeographySize(size) {
    switch (size) {
        case "small":
            policyMultiplier['effectDelay'] = 0.5;
            policyMultiplier['cost'] = 0.5;
            policyMultiplier['revenue'] = 0.5;
            break;
        case "medium":
            policyMultiplier['effectDelay'] = 1;
            policyMultiplier['cost'] = 1;
            policyMultiplier['revenue'] = 1;
            break;
        case "large":
            policyMultiplier['effectDelay'] = 1.7;
            policyMultiplier['cost'] = 1.7;
            policyMultiplier['revenue'] = 1.7;
            break;
    }

    const sizeInformation = getTextById("geography_size_information");
    sizeInformation.text = toTitleCase(size);

    // console.log(policyMultiplier);
}

export function setupGeographyLandWater(landWaterValue) {
    const minFisheriesValue = 12;
    const maxFisheriesValue = 87;
    const minAgricultureValue = 12;
    const maxAgricultureValue = 87;

    levelVariables.status['agriculture'] = minAgricultureValue + Math.round(landWaterValue / 100 * (maxAgricultureValue - minAgricultureValue));
    levelVariables.status['fisheries'] = minFisheriesValue + Math.round((100 - landWaterValue) / 100 * (maxFisheriesValue - minFisheriesValue));

    const landWaterValueInformation = getTextById("geography_land_water_information");
    if (landWaterValue < 40) landWaterValueInformation.text = "More Water";
    else if (landWaterValue < 60) landWaterValueInformation.text = "Balanced";
    else landWaterValueInformation.text = "More Land";

    // console.log("Agriculture: " + levelVariables.status['agriculture']);
    // console.log("Fisheries: " + levelVariables.status['fisheries']);
}

export function setupSituationGovernment(governmentType) {
    switch(governmentType) {
        case "democratic":
            policyMultiplier['implementationDelay'] = 1;
            levelVariables.status['governance'] = 83;
            levelVariables.status['media_neutrality'] = 78;
            levelVariables.crisis['media_bias'] = 12;
            break;
        case "semi_democratic":
            policyMultiplier['implementationDelay'] = 1;
            levelVariables.status['governance'] = 83;
            levelVariables.status['media_neutrality'] = 78;
            levelVariables.crisis['media_bias'] = 12;
            break;
        case "semi_autocratic":
            policyMultiplier['implementationDelay'] = 1;
            levelVariables.status['governance'] = 83;
            levelVariables.status['media_neutrality'] = 78;
            levelVariables.crisis['media_bias'] = 12;
            break;        
        case "autocratic":
            policyMultiplier['implementationDelay'] = 1;
            levelVariables.status['governance'] = 83;
            levelVariables.status['media_neutrality'] = 78;
            levelVariables.crisis['media_bias'] = 12;
            break;
    }

    
    const governmentInformation = getTextById("situation_government_information");
    governmentInformation.text = toTitleCase(governmentType.replace("_", " "));

    console.log(governmentType);
}