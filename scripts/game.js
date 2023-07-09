import { status, updateStatus, setupStatusPopUp } from "./status-data.js";
import {
  crisis,
  crisisFsms,
  updateCrisis,
  setupCrisisPopUp,
} from "./crisis-data.js";
import {
  addTextToCache,
  getTextById,
  addClickablePanelToCache,
  getClickablePanelById,
  setSliderValue,
  clamp,
  getObjectbyId,
  setScrollableHeight,
  toTitleCase,
  resetScrollablePosition,
  toDeltaFormat,
  toPercentageFormat,
} from "./utils.js";
import { expandCrisisTiles, initializeTileBiome, resetTileData } from "./tile-data.js";
import {
  policy,
  createPolicyEffectViews,
  showPolicyEffectViews,
  updatePolicyEffectViews,
  applyPolicyChange,
  setupPolicyPopUp,
  updatePolicy,
  setupPolicyMultiplier,
  togglePolicyActive,
  updatePolicyFiscalView,
} from "./policy-data.js";
import {
  updateBalance,
  updateDebt,
  updateIncomeFromPolicy,
  updateSpendingFromPolicy,
  removeIncomeBubbleTileIndex,
  spawnIncomeBubble,
  setupSpawnIncomeBubble,
  incomes,
  addBalance,
  showFiscalPopUp,
  updateIncomeFromIndustry,
  resetDailyCollectibleIncome,
  resetFiscalData,
} from "./fiscal-data.js";
import {
  setLevelVariables,
  createInitialCrisisViews,
  chooseInitialCrisis,
  setInitialCrisisVariables,
  checkGameOverCondition,
  setupGeographySize,
  setupGeographyLandWater,
  setupSituationGovernment,
  setupSituationEconomy,
  createScenarioView,
  chooseScenario,
  showScenarioInformation,
  setScenarioVariables,
  setScenarioSize,
  levelVariables,
  levelData,
  chosenInitialCrisisName,
  initialCrisis,
  scenarios,
  chosenScenarioName,
  resetChosenVariables,
} from "./level-data.js";

function updateAllStatus() {
  for (const statusName in status) {
    updateStatus(statusName);
  }
}

function updateAllCrisis() {
  for (const crisisName in crisis) {
    updateCrisis(crisisName);
  }
}

function updateAllPolicies() {
  for (const policyName in policy) {
    updatePolicy(policyName);
  }
}

function updateFiscal(runtime) {
  updateBalance();
  updateDebt();
  
  resetDailyCollectibleIncome();
}

function initializeFiscalData(runtime) {
  for (const policyName in policy) {
    updateIncomeFromPolicy(policyName);
    updateSpendingFromPolicy(policyName);
  }

  for (const statusName in status) {
    if (status[statusName].affectsIncome) {
      updateIncomeFromIndustry(statusName);
    }
  }
}

export function setupCrisisViews(runtime) {
  const margin = 40;
  const crisisScrollable = getObjectbyId(
    runtime.objects.ScrollablePanel,
    "crisis"
  );
  setScrollableHeight(
    runtime,
    crisisScrollable,
    Object.keys(crisis).length,
    105,
    20
  );

  let initialY = crisisScrollable.y + 5;

  for (const crisisName in crisis) {
    const crisisData = crisis[crisisName];

    const instanceX = crisisScrollable.x + 40;
    const instanceY = initialY + Object.keys(crisis).indexOf(crisisName) * 105;

    const crisisView = runtime.objects.UIText.createInstance(
      "panelCrisisBackground",
      instanceX,
      instanceY,
      true,
      "crisis_view"
    );
    crisisView.instVars["id"] = crisisName + "_crisis_name";
    crisisView.text = crisisData.name;
    addTextToCache(crisisView);
    crisisScrollable.addChild(crisisView, {
      transformX: true,
      transformY: true,
    });

    const crisisState = crisisView.getChildAt(0);
    const crisisValue = crisisView.getChildAt(1);
    crisisValue.instVars["id"] = crisisName + "_crisis_slider";

    const crisisSliderBG = crisisView.getChildAt(3);
    const crisisSlider = crisisView.getChildAt(2);
    crisisSlider.instVars["id"] = crisisName + "_crisis_slider";
    crisisSlider.instVars["minX"] = crisisSliderBG.x - crisisSliderBG.width / 2;
    crisisSlider.instVars["maxX"] = crisisSliderBG.x + crisisSliderBG.width / 2;

    const crisisClickablePanel = crisisView.getChildAt(4);
    crisisClickablePanel.instVars["id"] =
      crisisName + "_clickable_panel_crisis";
    crisisClickablePanel.instVars["panelId"] = "crisis";
    crisisClickablePanel.instVars["clickable"] = true;
    addClickablePanelToCache(crisisClickablePanel);
    // const clickablePanelX = crisisScrollable.x + 10;
    // const clickablePanelY = y - 5;
    // let clickablePanel = runtime.objects.ClickablePanel.createInstance(
    //   "panelcrisisbackground",
    //   clickablePanelX,
    //   clickablePanelY
    // );
    // clickablePanel.instVars["id"] = variable + "_clickable_panel_crisis";
    // clickablePanel.instVars["clickable"] = true;
    // clickablePanel.instVars["panelId"] = "crisis";
    // clickablePanel.blendMode = "source-atop";
    // clickablePanel.width = crisisScrollable.width - 20;
    // clickablePanel.height = 80;
    // addClickablePanelToCache(clickablePanel);
    // crisisScrollable.addChild(clickablePanel, {
    //   transformX: true,
    //   transformY: true,
    // });

    // let sliderBarBG = runtime.objects.SliderBarBG.createInstance(
    //   "panelcrisisbackground",
    //   x,
    //   y + 40
    // );
    // sliderBarBG.blendMode = "source-atop";
    // sliderBarBG.animationFrame = 1;
    // crisisScrollable.addChild(sliderBarBG, {
    //   transformX: true,
    //   transformY: true,
    // });

    // let sliderBar = runtime.objects.SliderBar.createInstance(
    //   "panelcrisisbackground",
    //   x,
    //   y + 34
    // );

    // sliderBar.instVars["minX"] = x - sliderBarBG.width / 2;
    // sliderBar.instVars["maxX"] = x + sliderBarBG.width / 2;
    // sliderBar.instVars["maxValue"] = 100;
    // sliderBar.instVars["value"] = 0;
    // sliderBar.instVars["id"] = variable + "_crisis_slider";
    // sliderBar.blendMode = "source-atop";
    // crisisScrollable.addChild(sliderBar, {
    //   transformX: true,
    //   transformY: true,
    // });

    // let xText = x - sliderBarBG.width / 2;

    // let titleText = runtime.objects.UIText.createInstance(
    //   "panelcrisisbackground",
    //   xText,
    //   y
    // );
    // titleText.colorRgb = [255, 255, 255];
    // titleText.blendMode = "source-atop";
    // titleText.characterScale = 0.3;
    // addTextToCache(titleText);

    // const words = variable.replace("_", " ").split(" ");
    // for (let i = 0; i < words.length; i++) {
    //   words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    // }
    // titleText.text = words.join(" ");

    // crisisScrollable.addChild(titleText, {
    //   transformX: true,
    //   transformY: true,
    // });

    // let valueText = runtime.objects.UIText.createInstance(
    //   "panelcrisisbackground",
    //   xText,
    //   y + 52
    // );
    // valueText.instVars["id"] = variable + "_crisis_text";
    // valueText.colorRgb = [193, 200, 220];
    // valueText.text = "0";
    // valueText.blendMode = "source-atop";
    // valueText.characterScale = 0.25;
    // crisisScrollable.addChild(valueText, {
    //   transformX: true,
    //   transformY: true,
    // });
    // addTextToCache(valueText);
  }

  // const crisisPanel = runtime.objects.UIPanel.getAllInstances().filter(
  //   (panel) => panel.instVars["id"] == "crisis"
  // )[0];
  // crisisScrollable.height =
  //   Object.keys(crisis).length * (margin + 52) + margin / 2;
  // crisisScrollable.instVars["min"] =
  //   crisisScrollable.y - crisisScrollable.height + crisisPanel.height;
  // crisisScrollable.instVars["max"] = crisisScrollable.y;
}

export function updateStatusView(runtime) {
  let statusSliders = runtime.objects.SliderBar.getAllInstances();
  statusSliders = statusSliders.filter((slider) =>
    slider.instVars["id"].endsWith("status_slider")
  );

  for (const statusSlider of statusSliders) {
    const id = statusSlider.instVars["id"].replace("_status_slider", "");
    const value = status[id].value;
    // console.log("/updateStatusViewid", status[id].name, value);

    const statusText = getTextById(id + "_status_text");
    const totalLastUpdate =
      status[id].lastUpdateCause + status[id].lastUpdatePolicy;
    const text = toPercentageFormat(value) + " (" + toDeltaFormat(totalLastUpdate) + ")";
    setSliderValue(statusSlider, statusText, value, text);
  }
}

export function updateCrisisView(runtime) {
  for (const crisisName in crisis) {
    const crisisData = crisis[crisisName];

    const crisisView = getTextById(crisisName + "_crisis_name");

    const crisisState = crisisView.getChildAt(0);
    crisisState.text = toTitleCase(crisisFsms[crisisName].value);

    const crisisValue = crisisView.getChildAt(1);
    const crisisSlider = crisisView.getChildAt(2);
    const totalLastUpdate =
      crisisData.lastUpdateCause + crisisData.lastUpdatePolicy;
    const text = toPercentageFormat(crisisData.value) + " (" + toDeltaFormat(totalLastUpdate) + ")";
    setSliderValue(
      crisisSlider,
      crisisValue,
      crisisData.value,
      text
    );

    const crisisExtremeValue = getTextById(crisisName + "_crisis_extreme").getChildAt(1);
    crisisExtremeValue.text = toPercentageFormat(crisisData.value);
    

    if (
      crisisFsms[crisisName].value === crisisData.states[2] ||
      (crisisFsms[crisisName].value === crisisData.states[3] &&
        !crisisData.isGlobal)
    ) {
      expandCrisisTiles(runtime, crisisName);
    }
  }
}

/**
 * Updates the FSM of every crisis.
 */
function updateFSM() {
  const result = Object.values(crisisFsms).some((fsm) => fsm.updateState());

  if (result) {
    updateFSM();
    return;
  }

  Object.values(crisisFsms).forEach((fsm) => fsm.tick());
}

export function setCrisisValue(crisisVariable, value) {
  crisis[crisisVariable].value = value;
}

export function setStatusValue(statusVariable, value) {
  status[statusVariable].value = value;
}

function initializePolicyViews(runtime) {
  let policyViewData = {};

  const policiesScrollable = getObjectbyId(
    runtime.objects.ScrollablePanel,
    "policy"
  );
  const initialY = policiesScrollable.y + 10;
  const initialX = (policiesScrollable.width - 345.5 * 2) / 3;

  console.log("Policy", policy);

  for (const policyName in policy) {
    const policyData = policy[policyName];

    if (!policyViewData[policyData.type]) {
      policyViewData[policyData.type] = {
        policies: [],
      };
    }
    console.log("Policy name", policyName);

    const policyViewDataType = policyViewData[policyData.type];
    policyViewDataType.policies.push(policyName);
    // console.log("Policy view data type", policyViewDataType, policyViewDataType.policies.indexOf(policyName));
    const columnX =
      policyViewDataType.policies.indexOf(policyName) % 2 == 0
        ? initialX
        : initialX * 2 + 345.5;
    const instanceX = policiesScrollable.x + columnX + 15;
    const instanceY =
      initialY +
      Math.floor(policyViewDataType.policies.indexOf(policyName) / 2) * 100;

    const policyView = runtime.objects.UIText.createInstance(
      "PanelPolicyMG",
      instanceX,
      instanceY,
      true,
      "policy_view"
    );
    policyView.instVars["id"] = policyName + "_policy_view";
    policyView.isVisible = false;
    policyView.text = policyData.name;
    addTextToCache(policyView);

    const policySliderBG = policyView.getChildAt(0);
    const policySlider = policyView.getChildAt(1);
    policySlider.instVars["minX"] = policySliderBG.x - policySliderBG.width / 2;
    policySlider.instVars["maxX"] = policySliderBG.x + policySliderBG.width / 2;

    const policyClickable = policyView.getChildAt(3);
    policyClickable.instVars["id"] = policyName + "_clickable_panel_policy";
    policyClickable.instVars["clickable"] = true;
    policyClickable.instVars["isDisabled"] = true;
    policyClickable.instVars["panelId"] = "policy";
    policyClickable.opacity = 0;
    addClickablePanelToCache(policyClickable);

    policiesScrollable.addChild(policyView, { transformX: true, transformY: true });
  }

  // console.log("Policy data", policyData);

  for (const policyType in policyViewData) {
    const data = policyViewData[policyType];
    // console.log("Data", data);
    policyScrollableData[policyType] = {
      policies: data.policies,
    };
  }
}

let policyScrollableData = {};

function showPolicyPanel(policyType, runtime) {
  console.log("Policy scrollable data", policyScrollableData);
  console.log("Policy type", policyType);

  for (const policyName in policy) {
    // console.log("Policy name invisible", policyName);
    const policyView = getTextById(policyName + "_policy_view");
    policyView.isVisible = false;

    const policyClickable = policyView.getChildAt(3);
    policyClickable.instVars["isDisabled"] = true;
  }

  if (policyScrollableData[policyType]) {
    for (const policyName of policyScrollableData[policyType].policies) {
      const policyData = policy[policyName];
      const policyView = getTextById(policyName + "_policy_view");
      policyView.isVisible = true;

      const panelTitle = getTextById("policy_panel_title");
      panelTitle.text = toTitleCase(policyType) + " Policies";

      const policySlider = policyView.getChildAt(1);
      const policyValueText = policyView.getChildAt(2);
      console.log("slider ", policySlider);
      setSliderValue(policySlider, policyValueText, policyData.value, toPercentageFormat(policyData.value));

      const policyClickable = policyView.getChildAt(3);
      policyClickable.instVars["isDisabled"] = false;

      const policyStateText = policyView.getChildAt(4);
      policyStateText.text = policyData.isImplemented ? "Active" : "Inactive";

      const policySliderBG = policyView.getChildAt(0);
      policySliderBG.effects[0].isActive = !policyData.isImplemented;
    }

    const policiesScrollable = getObjectbyId(
      runtime.objects.ScrollablePanel,
      "policy"
    );
    resetScrollablePosition(policiesScrollable);
    setScrollableHeight(
      runtime,
      policiesScrollable,
      Math.ceil(policyScrollableData[policyType].policies.length / 2),
      100,
      0
    );
  }
}

function initializeStatusViews(runtime) {
  let statusData = {};
  const panelStatus = getObjectbyId(runtime.objects.Panel, "status_panel");
  const panelStatusBlur = getObjectbyId(
    runtime.objects.UIPanelBlur,
    "status_panel"
  );
  let initialY = panelStatus.y + 20;
  let initialX = panelStatus.x + panelStatus.width / 6;

  console.log("Status", status);

  for (const variable in status) {
    const statusName = status[variable];
    if (!statusData[statusName.type]) {
      console.log("adding status Type");
      statusData[statusName.type] = {
        statuses: [],
      };
    }
    statusData[statusName.type].statuses.push(variable);

    const row = Math.ceil(statusData[statusName.type].statuses.length / 3) - 1;
    const column = (statusData[statusName.type].statuses.length - 1) % 3;
    const instanceY = initialY + row * 100;
    const instanceX = initialX + (column * panelStatus.width) / 3;

    // console.log("Status name", statusName, initialY, row, instanceY, instanceX);

    let statusNameText = runtime.objects.UIText.createInstance(
      "PanelStatus",
      instanceX,
      instanceY,
      true,
      "status_name"
    );
    statusNameText.instVars["id"] = variable + "_status_title";
    statusNameText.text = statusName.name;
    statusNameText.isVisible = false;
    addTextToCache(statusNameText);

    // console.log(
    //   "Status name text",
    //   statusNameText.getChildCount(),
    //   statusNameText.getChildAt(0),
    //   statusNameText.getChildAt(1),
    //   statusNameText.getChildAt(2)
    // );

    // let sliderBarBG = runtime.objects.SliderBarBG.createInstance("PanelStatus", instanceX, instanceY + 40);
    let sliderBarBG = statusNameText.getChildAt(1);
    sliderBarBG.instVars["id"] = variable + "_status_slider_bg";
    // console.log("Slider bar bg", sliderBarBG.instVars["id"]);
    sliderBarBG.isVisible = false;

    // let sliderBar = runtime.objects.SliderBar.createInstance("PanelStatus", instanceX, instanceY + 34);
    let sliderBar = statusNameText.getChildAt(0);
    sliderBar.instVars["minX"] = instanceX - sliderBarBG.width / 2;
    sliderBar.instVars["maxX"] = instanceX + sliderBarBG.width / 2;
    sliderBar.instVars["maxValue"] = 100;
    sliderBar.instVars["value"] = 0;
    sliderBar.instVars["id"] = variable + "_status_slider";
    sliderBar.isVisible = false;

    // let statusValueText = runtime.objects.UIText.createInstance("PanelStatus", instanceX, instanceY + 30);
    let statusValueText = statusNameText.getChildAt(2);
    statusValueText.instVars["id"] = variable + "_status_text";
    statusValueText.colorRgb = [1, 1, 1];
    statusValueText.isVisible = false;
    addTextToCache(statusValueText);

    // const clickablePanelX = instanceX + 50;
    // const clickablePanelY = instanceY - 10;
    // let clickablePanel = runtime.objects.ClickablePanel.createInstance("PanelStatus", instanceX, instanceY - 10);
    let clickablePanel = statusNameText.getChildAt(3);
    clickablePanel.instVars["id"] = variable + "_clickable_panel_status";
    clickablePanel.instVars["clickable"] = true;
    // clickablePanel.instVars["isDisabled"] = true;
    clickablePanel.instVars["panelId"] = "status_panel";
    addClickablePanelToCache(clickablePanel);
  }

  for (const variable in statusData) {
    const data = statusData[variable];
    console.log("Data", data);
    statusViewData[variable] = {
      statuses: data.statuses,
    };
  }
}

let statusViewData = {};

function showStatusPanel(statusType, runtime) {
  console.log("Status type ", statusType);
  const statusPanel = getObjectbyId(runtime.objects.Panel, "status_panel");
  const statusPanelBlur = getObjectbyId(
    runtime.objects.UIPanelBlur,
    "status_panel"
  );

  for (const statusName in status) {
    console.log("Status name invisible", statusName);
    const statusNameText = getTextById(statusName + "_status_title");
    statusNameText.isVisible = false;
    const statusValueText = getTextById(statusName + "_status_text");
    statusValueText.isVisible = false;
    const sliderBarBG = runtime.objects.SliderBarBG.getAllInstances().filter(
      (s) => s.instVars["id"] == statusName + "_status_slider_bg"
    )[0];
    sliderBarBG.isVisible = false;
    const sliderBar = runtime.objects.SliderBar.getAllInstances().filter(
      (s) => s.instVars["id"] == statusName + "_status_slider"
    )[0];
    sliderBar.isVisible = false;
    const clickablePanel = getClickablePanelById(
      statusName + "_clickable_panel_status"
    );
    clickablePanel.instVars["isDisabled"] = true;
  }

  if (statusViewData[statusType]) {
    console.log("Setting height", statusType, statusViewData[statusType]);

    for (const statusName of statusViewData[statusType].statuses) {
      console.log("Status name visible", statusName);
      const statusNameText = getTextById(statusName + "_status_title");
      statusNameText.isVisible = true;
      const statusValueText = getTextById(statusName + "_status_text");
      statusValueText.isVisible = true;
      const sliderBarBG = runtime.objects.SliderBarBG.getAllInstances().filter(
        (s) => s.instVars["id"] == statusName + "_status_slider_bg"
      )[0];
      sliderBarBG.isVisible = true;
      const sliderBar = runtime.objects.SliderBar.getAllInstances().filter(
        (s) => s.instVars["id"] == statusName + "_status_slider"
      )[0];
      sliderBar.isVisible = true;
      const clickablePanel = getClickablePanelById(
        statusName + "_clickable_panel_status"
      );
      clickablePanel.instVars["isDisabled"] = false;

      // setSliderValue(sliderBar, statusValueText, status[statusName].value, to(status[statusName].value).toString());
    }

    statusPanel.height =
      20 + Math.ceil(statusViewData[statusType].statuses.length / 3) * 100;
    statusPanelBlur.height =
      20 + Math.ceil(statusViewData[statusType].statuses.length / 3) * 100;
  }
}

const initialLevelVariables = {
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
  },
  policy: {
      agricultural_subsidies: {isImplemented: false,value: 0},
        airport_construction: {isImplemented: false,value: 0},
        alcohol_tax: {isImplemented: false,value: 50},
        anti_corruption_agency: {isImplemented: true,value: 18},
        arm_imports: {isImplemented: false,value: 0},
        blood_organ_donation: {isImplemented: false,value: 0},
        border_control: {isImplemented: true,value: 34},
        building_codes: {isImplemented: false,value: 0},
        car_subsidies: {isImplemented: false,value: 0},
        carbon_tax: {isImplemented: false,value: 0},
        child_benefit: {isImplemented: false,value: 0},
        city_planning_regulations: {isImplemented: true,value: 45},
        coal_plant: {isImplemented: true,value: 45},
        conservation_effort: {isImplemented: false,value: 0},
        corporation_tax: {isImplemented: true,value: 23},
        curriculum_development: {isImplemented: false,value: 0},
        customs_duty: {isImplemented: true,value: 45},
        death_penalty: {isImplemented: false,value: 0},
        debt_payment: {isImplemented: true,value: 25},
        desalination_plant: {isImplemented: false,value: 0},
        diplomatic_service: {isImplemented: true,value: 43},
        disablity_benefit: {isImplemented: false,value: 0},
        elderly_benefit: {isImplemented: false,value: 0},
        entrepreneur_support: {isImplemented: false,value: 0},
        family_planning: {isImplemented: false,value: 0},
        fisheries_subsidies: {isImplemented: false,value: 0},
        food_drug_regulations: {isImplemented: false,value: 0},
        food_import: {isImplemented: false,value: 0},
        foreign_aid: {isImplemented: false,value: 0},
        fuel_tax: {isImplemented: false,value: 0},
        green_energy: {isImplemented: false,value: 0},
        health_college: {isImplemented: false,value: 0},
        health_worker_volunteers: {isImplemented: false,value: 0},
        healthcare_privatization: {isImplemented: false,value: 0},
        income_tax: {isImplemented: true,value: 30},
        intellectual_rights: {isImplemented: false,value: 0},
        intelligence_agency: {isImplemented: false,value: 0},
        international_connections: {isImplemented: true,value: 67},
        international_trade: {isImplemented: true,value: 65},
        internet_censorship: {isImplemented: false,value: 0},
        labor_union: {isImplemented: false,value: 0},
        land_reclamation: {isImplemented: false,value: 0},
        legal_aid: {isImplemented: true,value: 32},
        lockdown: {isImplemented: false,value: 0},
        mandatory_face_masks: {isImplemented: false,value: 0},
        mandatory_immunization: {isImplemented: false,value: 0},
        mandatory_vaccination: {isImplemented: false,value: 0},
        maternity_leave: {isImplemented: false,value: 0},
        military_training: {isImplemented: true,value: 20},
        minimum_wage: {isImplemented: true,value: 32},
        mining_subsidies: {isImplemented: false,value: 0},
        national_park: {isImplemented: false,value: 0},
        nuclear_plant: {isImplemented: false,value: 0},
        nuclear_weapons: {isImplemented: false,value: 0},
        ocean_cleanup: {isImplemented: false,value: 0},
        oil_exploration: {isImplemented: false,value: 0},
        paternity_leave: {isImplemented: false,value: 0},
        police_force: {isImplemented: true,value: 56},
        press_freedom: {isImplemented: false,value: 0},
        property_tax: {isImplemented: true,value: 32},
        protected_forest: {isImplemented: false,value: 0},
        public_health_campaign: {isImplemented: false,value: 0},
        public_transport: {isImplemented: false,value: 0},
        rail_construction: {isImplemented: true,value: 18},
        recycling_plant: {isImplemented: false,value: 0},
        reforestation: {isImplemented: false,value: 0},
        research_grants: {isImplemented: false,value: 0},
        road_construction: {isImplemented: true,value: 20},
        sattelite_development: {isImplemented: false,value: 0},
        scholarships: {isImplemented: false,value: 0},
        school_meals: {isImplemented: false,value: 0},
        small_business_grants: {isImplemented: false,value: 0},
        standardized_testing: {isImplemented: false,value: 0},
        state_health_insurance: {isImplemented: true,value: 64},
        state_healthcare: {isImplemented: true,value: 64},
        state_housing: {isImplemented: true,value: 56},
        state_schools: {isImplemented: false,value: 50},
        state_water_company: {isImplemented: true,value: 65},
        sustainable_harvesting: {isImplemented: false,value: 0},
        tax_amnesty: {isImplemented: false,value: 0},
        teacher_assessment: {isImplemented: false,value: 0},
        teacher_education: {isImplemented: false,value: 0},
        technology_colleges: {isImplemented: false,value: 0},
        telecom_construction: {isImplemented: true,value: 14},
        tobacco_tax: {isImplemented: false,value: 0},
        tourism_campaign: {isImplemented: false,value: 0},
        travel_ban: {isImplemented: false,value: 0},
        unemployment_benefit: {isImplemented: false,value: 0},
        university_grants: {isImplemented: false,value: 0},
        value_added_tax: {isImplemented: true,value: 34},
        vehicle_tax: {isImplemented: true,value: 45},
        vocational_education: {isImplemented: false,value: 0},
        work_safety: {isImplemented: true,value: 20},
        workplace_inclusion: {isImplemented: false,value: 0},
  }
};

function resetInitialLevelVariables() {
  for (const initialLevelStatusName in initialLevelVariables.status) {
    levelVariables.status[initialLevelStatusName] = initialLevelVariables.status[initialLevelStatusName];
  };

  for (const initialLevelCrisisName in initialLevelVariables.crisis) {
    levelVariables.crisis[initialLevelCrisisName] = initialLevelVariables.crisis[initialLevelCrisisName];
  }

  for (const initialLevelPolicyName in initialLevelVariables.policy) {
    levelVariables.policy[initialLevelPolicyName] = initialLevelVariables.policy[initialLevelPolicyName];
  }

  levelData.size = "Large";
  levelData.landWater = "More Land";
  levelData.governmentType = "Democracy";
  levelData.economyType = "Developed";

  resetChosenVariables();
}

function resetLevelVariables() {
  resetTileData();
  resetFiscalData();
}