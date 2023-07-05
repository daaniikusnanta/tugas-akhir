import { initializeCrisis, isCrisisMaximized, isExtremeCrisisEmpty, crisis, startingCrisis, experiencedCrisis } from "./crisis-data.js";
import { initializeStatus, status } from "./status-data.js";
import { updateCrisisView, updateStatusView, setupCrisisViews } from "./game.js";
import { addTextToCache, getClickablePanelById, getObjectbyId, getTextById, setScrollableHeight, toTitleCase } from "./utils.js";
import { policyMultiplier } from "./policy-data.js";
import { balance, totalSpending } from "./fiscal-data.js";

const levelData = {
    size: "Large",
    landWater: "More Land",
    governmentType: "Democracy",
    economyType: "Developed",
};

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

const scenarios = {
    "sepnovria": {
        name: "Pandemic on Sepnovria",
        description: "Pandemic",
        parameters: {
            size: "large",
            landWaterValue: 80,
            governmentType: "democratic",
            economyType: "newly_emerging",
        },
        initialValues: {
            "infectious_disease": 90
        }
    },
    "situbondo": {
        name: "Extreme Poverty on Situbondo",
        description: "Extreme Poverty",
        parameters: {
            size: "medium",
            landWaterValue: 50,
            governmentType: "semi_autocratic",
            economyType: "developing",
        },
        initialValues: {
            "poverty": 70
        }
    }
};

export let chosenInitialCrisisName = Object.keys(initialCrisis)[0];

export let chosenScenarioName = Object.keys(scenarios)[0];

export function setInitialCrisisVariables() {
    const initialCrisisData = initialCrisis[chosenInitialCrisisName];
    console.log(chosenInitialCrisisName, initialCrisisData);
    for (const valueName in initialCrisisData.values) {
        let variableData = (levelVariables.status['valueName']) ? levelVariables.status : levelVariables.crisis;
        
        variableData[valueName] = initialCrisisData.values[valueName];
        console.log(levelVariables);
    }

    console.log("setInitialCrisisVariables", levelVariables);
}

export function setScenarioVariables() {
    const scenarioData = scenarios[chosenScenarioName];
    console.log("setScenarioVariables", levelVariables);
    for (const valueName in scenarioData.initialValues) {
        let variableData = (levelVariables.status['valueName']) ? levelVariables.status : levelVariables.crisis;
        
        variableData[valueName] = scenarioData.initialValues[valueName];
        console.log(levelVariables);
    }

    console.log("setScenarioVariables", levelVariables);
}

export function chooseInitialCrisis(initialCrisisName) {
    console.log(initialCrisisName);
    chosenInitialCrisisName = initialCrisisName;
}

export function chooseScenario(scenarioName) {
    console.log(scenarioName);
    chosenScenarioName = scenarioName;
    
    console.log("chooseScenario", levelVariables);
    showScenarioInformation();
}

export function setScenarioSize(runtime) {
    const scenarioData = scenarios[chosenScenarioName];

    runtime.globalVars.layoutSize = scenarioData.parameters.size;
}

export function showScenarioInformation() {
    const scenarioData = scenarios[chosenScenarioName];
    const parameters = scenarioData.parameters;
    
    setupGeographySize(parameters.size);
    setupGeographyLandWater(parameters.landWaterValue);
    setupSituationGovernment(parameters.governmentType);
    setupSituationEconomy(parameters.economyType);

    let crisises = [];
    for (const valueName in scenarioData.initialValues) {
        if (crisis[valueName]) {
            crisises.push(crisis[valueName].name);
        }
    }
    const crisisesText = getTextById("crisis_information");
    crisisesText.text = crisises.join(", ");
    
    console.log("showScenarioInformation", levelVariables);
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

export function createScenarioView(runtime) {
    const scenarioScrollable = getObjectbyId(runtime.objects.ScrollablePanel, "scenario");
    const initialY = scenarioScrollable.y + 30;
    const itemHeight = 160;
    const margin = 10;

    for (const scenarioVariable in scenarios) {
        const scenarioData = scenarios[scenarioVariable];

        const instanceX = scenarioScrollable.x + 30;
        const instanceY = initialY + Object.keys(scenarios).indexOf(scenarioVariable) * (itemHeight + margin*2);

        const scenarioName = runtime.objects.UITextBold.createInstance("ScenarioMG", instanceX, instanceY, true, "scenario_view");
        scenarioName.text = scenarioData.name;
        scenarioName.instVars['id'] = scenarioVariable + "_scenario_name";
        addTextToCache(scenarioName);

        const scenarioDescription = scenarioName.getChildAt(0);
        scenarioDescription.text = scenarioData.description;

        const scenarioClickable = scenarioName.getChildAt(1);
        scenarioClickable.opacity = 0;
        scenarioClickable.instVars['clickable'] = true;
        scenarioClickable.instVars['selectable'] = true;
        scenarioClickable.instVars['panelId'] = scenarioScrollable.instVars['id'];
        scenarioClickable.instVars['id'] = scenarioVariable + "_scenario_clickable";
        scenarioClickable.instVars['hasGroup'] = true;
        scenarioClickable.instVars['groupId'] = "scenario";

        if (scenarioVariable === Object.keys(scenarios)[0]) {
            scenarioClickable.instVars['isSelected'] = true;
            scenarioClickable.opacity = 50;
        }

        console.log(scenarioClickable);

        scenarioScrollable.addChild(scenarioName, { transformX: true, transformY: true });
    }

    setScrollableHeight(runtime, scenarioScrollable, Object.keys(scenarios).length, itemHeight + margin*2, margin);
}

/**
 * Sets the level variables to the given level.
 * @param {number} level The level to set the variables to.
 * @param {IRuntime} runtime The runtime scene.
*/  
export function setLevelVariables(level, runtime) {
    initializeStatus(levelVariables.status, runtime);
    initializeCrisis(levelVariables.crisis, runtime);
    setupCrisisViews(runtime);
    updateStatusView(runtime);
    updateCrisisView(runtime);
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
    levelData.size = toTitleCase(size);

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

    levelData.landWater = landWaterValueInformation.text;

    // console.log("Agriculture: " + levelVariables.status['agriculture']);
    // console.log("Fisheries: " + levelVariables.status['fisheries']);
}

export function setupSituationGovernment(governmentType) {
    switch (governmentType) {
        case "democratic":
            policyMultiplier['implementationDelay'] = 1;
            levelVariables.status['governance'] = 83;
            levelVariables.status['media_neutrality'] = 78;
            levelVariables.crisis['media_bias'] = 12;
            break;
        case "semi_democratic":
            policyMultiplier['implementationDelay'] = 1.2;
            levelVariables.status['governance'] = 80;
            levelVariables.status['media_neutrality'] = 73;
            levelVariables.crisis['media_bias'] = 16;
            break;
        case "semi_autocratic":
            policyMultiplier['implementationDelay'] = 1.5;
            levelVariables.status['governance'] = 75;
            levelVariables.status['media_neutrality'] = 63;
            levelVariables.crisis['media_bias'] = 31;
            break;        
        case "autocratic":
            policyMultiplier['implementationDelay'] = 2;
            levelVariables.status['governance'] = 65;
            levelVariables.status['media_neutrality'] = 56;
            levelVariables.crisis['media_bias'] = 41;
            break;
    }

    const governmentInformation = getTextById("situation_government_information");
    governmentInformation.text = toTitleCase(governmentType.replace("_", " "));
    levelData.governmentType = toTitleCase(governmentType.replace("_", " "));

    // console.log(governmentType);
}

export function setupSituationEconomy(economyType) {
    switch (economyType) {
        case "developed":
            levelVariables.status['research'] = 80;
            levelVariables.status['education_system'] = 87;
            levelVariables.status['healthcare_system'] = 78;
            levelVariables.status['manufacturing'] = 78;
            levelVariables.status['water_land'] = 40;
            levelVariables.status['defense_infrastructure'] = 80;
            levelVariables.crisis['mental_health_crisis'] = 50;
            levelVariables.crisis['discrimination'] = 40;
            levelVariables.crisis['housing_crisis'] = 40;
            levelVariables.crisis['pollution'] = 38;
            levelVariables.crisis['political_instability'] = 42;
            levelVariables.crisis['infrastructure_equality'] = 10;
            break;
        case "newly_emerging":
            levelVariables.status['research'] = 80;
            levelVariables.status['education_system'] = 87;
            levelVariables.status['healthcare_system'] = 78;
            levelVariables.status['manufacturing'] = 78;
            levelVariables.status['water_land'] = 40;
            levelVariables.status['defense_infrastructure'] = 80;
            levelVariables.crisis['mental_health_crisis'] = 50;
            levelVariables.crisis['discrimination'] = 40;
            levelVariables.crisis['housing_crisis'] = 40;
            levelVariables.crisis['pollution'] = 38;
            levelVariables.crisis['political_instability'] = 42;
            levelVariables.crisis['infrastructure_equality'] = 10;
            break;
        case "developing":
            levelVariables.status['research'] = 80;
            levelVariables.status['education_system'] = 87;
            levelVariables.status['healthcare_system'] = 78;
            levelVariables.status['manufacturing'] = 78;
            levelVariables.status['water_land'] = 40;
            levelVariables.status['defense_infrastructure'] = 80;
            levelVariables.crisis['mental_health_crisis'] = 50;
            levelVariables.crisis['discrimination'] = 40;
            levelVariables.crisis['housing_crisis'] = 40;
            levelVariables.crisis['pollution'] = 38;
            levelVariables.crisis['political_instability'] = 42;
            levelVariables.crisis['infrastructure_equality'] = 10;
            break;
    }

    const economyInformation = getTextById("situation_economy_information");
    economyInformation.text = toTitleCase(economyType.replace("_", " "));
    levelData.economyType = toTitleCase(economyType.replace("_", " "));

    // console.log(economyType);
}

/**
 * 
 * @param {IRuntime} runtime 
 */
export function checkGameOverCondition(runtime) {
    console.log("Checking game over condition");
    const winState = isExtremeCrisisEmpty();
    const loseState = isCrisisMaximized();
    const isGameOver = winState || loseState;

    if (isGameOver) {
        stopGame(runtime);
        runtime.layout.getLayer("UI").isVisible = false;
        runtime.layout.getLayer("UI").isInteractive = false;
        runtime.layout.getLayer("Game").isInteractive = false;
        runtime.layout.getLayer("GameOver").isVisible = true;
        runtime.layout.getLayer("GameOver").isInteractive = true;
        runtime.layout.getLayer("Background").isInteractive = false;

        const timeText = getTextById("game_over_time");
        timeText.text = runtime.globalVars['day'] + " Days";
        const totalSpendingText = getTextById("game_over_total_spending");
        totalSpendingText.text = "$" + totalSpending;
        const cashBalanceText = getTextById("game_over_cash_balance");
        cashBalanceText.text = "$" + balance;

        const sizeText = getTextById("game_over_size");
        sizeText.text = levelData.size;
        const landWaterText = getTextById("game_over_land_water");
        landWaterText.text = levelData.landWater;
        const governmentText = getTextById("game_over_government");
        governmentText.text = levelData.governmentType;
        const economyText = getTextById("game_over_economy");
        economyText.text = levelData.economyType;

        const title = getTextById("game_over_title");
        const subtitle = getTextById("game_over_subtitle");
        const overlay = getObjectbyId(runtime.objects.PopUpOverlay, "game_over");
        const retryButton = getObjectbyId(runtime.objects.Button, "retry");
        const exitButton = getObjectbyId(runtime.objects.Button, "exit");

        if (winState) {
            title.text = "You Win!";
            subtitle.text = "You have successfully managed the crisis.";
            overlay.colorRgb = [0, 255/255, 0];
            retryButton.isVisible = false;
            exitButton.x = 1920/2;
        }

        if (loseState) {
            title.text = "You Lose!";
            subtitle.text = "You have failed to manage the crisis.";
            overlay.colorRgb = [255/255, 0, 0];
            retryButton.isVisible = true;
            exitButton.x = 1920/2 + 20 + exitButton.width/2;
        }

        showInitialCrisis(runtime);
        showExperiencedCrisis(runtime);
    }
}

function showInitialCrisis(runtime) {
    const initialCrisisScrollable = getObjectbyId(runtime.objects.ScrollablePanel, "game_over_initial_crisis");
    
    for (const crisisName of startingCrisis) {
        const crisisData = crisis[crisisName];

        const instanceX = initialCrisisScrollable.x + 30;
        const instanceY = initialCrisisScrollable.y + 40 * startingCrisis.indexOf(crisisName);

        const crisisText = runtime.objects.UIText.createInstance("GameOverMG", instanceX, instanceY, true, "game_over_crisis");
        crisisText.text = crisisData.name;

        initialCrisisScrollable.addChild(crisisText, { transformX: true, transformY: true});
    }

    setScrollableHeight(runtime, initialCrisisScrollable, startingCrisis.length, 40, 0);
}

function showExperiencedCrisis(runtime) {
    const experiencedCrisisScrollable = getObjectbyId(runtime.objects.ScrollablePanel, "game_over_other_crisis");
    const experiencedCrisisArr = Array.from(experiencedCrisis).filter(crisisName => !startingCrisis.includes(crisisName));

    if (experiencedCrisisArr.length == 0) {
        const noCrisisText = getTextById("game_over_no_other_crisis");
        noCrisisText.isVisible = true;
        return;
    }

    for (const crisisName of experiencedCrisisArr) {
        const crisisData = crisis[crisisName];
        
        const instanceX = experiencedCrisisScrollable.x + 30;
        const instanceY = experiencedCrisisScrollable.y + 40 * experiencedCrisisArr.indexOf(crisisName);

        const crisisText = runtime.objects.UIText.createInstance("GameOverMG2", instanceX, instanceY, true, "game_over_crisis");
        crisisText.text = crisisData.name;

        experiencedCrisisScrollable.addChild(crisisText, { transformX: true, transformY: true});
    }

    setScrollableHeight(runtime, experiencedCrisisScrollable, experiencedCrisisArr.length, 40, 0);
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