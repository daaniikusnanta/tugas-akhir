import { status, updateStatus } from "./status-data.js";
import { crisis, crisisFsms, updateCrisis } from "./crisis-data.js";
import {
  addTextToCache,
  getTextById,
  addClickablePanelToCache,
  getClickablePanelById,
  setSliderValue,
  clamp,
} from "./utils.js";
import { expandCrisisTiles } from "./tile-data.js";
import {
  policy,
  createPolicyEffectViews,
  showPolicyEffectViews,
  updatePolicyEffectViews,
  implementPolicyChange,
  updatePolicy,
} from "./policy-data.js";
import { updateIncome, updateSpending } from "./fiscal-data.js";

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

function updateFiscalViews(runtime) {
  updateIncome(runtime);
  updateSpending(runtime);
}

export function setupCrisisViews(runtime) {
  const margin = 40;
  const crisisScrollable =
    runtime.objects.ScrollablePanel.getAllInstances().filter(
      (scrollable) => scrollable.instVars["id"] == "crisis"
    )[0];
  const x = crisisScrollable.x + crisisScrollable.width / 2;
  let y = crisisScrollable.y + margin / 2;

  for (const variable in crisis) {
    const clickablePanelX = crisisScrollable.x + 10;
    const clickablePanelY = y - 5;
    let clickablePanel = runtime.objects.ClickablePanel.createInstance(
      "panelcrisisbackground",
      clickablePanelX,
      clickablePanelY
    );
    clickablePanel.instVars["id"] = variable + "_clickable_panel_crisis";
    clickablePanel.instVars["clickable"] = true;
    clickablePanel.instVars["panelId"] = "crisis";
    clickablePanel.blendMode = "source-atop";
    clickablePanel.width = crisisScrollable.width - 20;
    clickablePanel.height = 80;
    addClickablePanelToCache(clickablePanel);
    crisisScrollable.addChild(clickablePanel, {
      transformX: true,
      transformY: true,
    });

    let sliderBarBG = runtime.objects.SliderBarBG.createInstance(
      "panelcrisisbackground",
      x,
      y + 40
    );
    sliderBarBG.blendMode = "source-atop";
    sliderBarBG.animationFrame = 1;
    crisisScrollable.addChild(sliderBarBG, {
      transformX: true,
      transformY: true,
    });

    let sliderBar = runtime.objects.SliderBar.createInstance(
      "panelcrisisbackground",
      x,
      y + 34
    );

    sliderBar.instVars["minX"] = x - sliderBarBG.width / 2;
    sliderBar.instVars["maxX"] = x + sliderBarBG.width / 2;
    sliderBar.instVars["maxValue"] = 100;
    sliderBar.instVars["value"] = 0;
    sliderBar.instVars["id"] = variable + "_crisis_slider";
    sliderBar.blendMode = "source-atop";
    crisisScrollable.addChild(sliderBar, {
      transformX: true,
      transformY: true,
    });

    let xText = x - sliderBarBG.width / 2;

    let titleText = runtime.objects.UIText.createInstance(
      "panelcrisisbackground",
      xText,
      y
    );
    titleText.colorRgb = [255, 255, 255];
    titleText.blendMode = "source-atop";
    titleText.characterScale = 0.3;
    addTextToCache(titleText);

    const words = variable.replace("_", " ").split(" ");
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    titleText.text = words.join(" ");

    crisisScrollable.addChild(titleText, {
      transformX: true,
      transformY: true,
    });

    let valueText = runtime.objects.UIText.createInstance(
      "panelcrisisbackground",
      xText,
      y + 52
    );
    valueText.instVars["id"] = variable + "_crisis_text";
    valueText.colorRgb = [193, 200, 220];
    valueText.text = "0";
    valueText.blendMode = "source-atop";
    valueText.characterScale = 0.25;
    crisisScrollable.addChild(valueText, {
      transformX: true,
      transformY: true,
    });
    addTextToCache(valueText);

    y += 52 + margin;
  }

  const crisisPanel = runtime.objects.UIPanel.getAllInstances().filter(
    (panel) => panel.instVars["id"] == "crisis"
  )[0];
  crisisScrollable.height =
    Object.keys(crisis).length * (margin + 52) + margin / 2;
  crisisScrollable.instVars["min"] =
    crisisScrollable.y - crisisScrollable.height + crisisPanel.height;
  crisisScrollable.instVars["max"] = crisisScrollable.y;
}

export function updateStatusView(runtime) {
  let statusSliders = runtime.objects.SliderBar.getAllInstances();
  statusSliders = statusSliders.filter((slider) =>
    slider.instVars["id"].endsWith("status_slider")
  );

  for (const statusSlider of statusSliders) {
    const id = statusSlider.instVars["id"].replace("_status_slider", "");
    const value = status[id].value;

    const statusText = getTextById(id + "_status_text");
	const totalLastUpdate = status[id].lastUpdateCause + status[id].lastUpdatePolicy;
    const update =
	totalLastUpdate >= 0
        ? "+" + totalLastUpdate.toFixed(2)
        : totalLastUpdate.toFixed(2);
    const text = value.toFixed(2).toString() + " (" + update + ")";
    setSliderValue(statusSlider, statusText, value, text);
  }
}

export function updateCrisisView(runtime) {
  let crisisSliders = runtime.objects.SliderBar.getAllInstances();
  crisisSliders = crisisSliders.filter((slider) =>
    slider.instVars["id"].endsWith("crisis_slider")
  );

  for (const crisisSlider of crisisSliders) {
    const id = crisisSlider.instVars["id"].replace("_crisis_slider", "");
    const value = crisis[id].value;

    const crisisText = getTextById(id + "_crisis_text");
	const totalLastUpdate = crisis[id].lastUpdateCause + crisis[id].lastUpdatePolicy;
    const update =
      totalLastUpdate >= 0
        ? "+" + totalLastUpdate.toFixed(2)
        : totalLastUpdate.toFixed(2);
    const text = value.toFixed(2).toString() + " (" + update + ")";
    setSliderValue(crisisSlider, crisisText, value, text);

    if (
      crisisFsms[id].value === crisis[id].states[2] ||
      (crisisFsms[id].value === crisis[id].states[3] && !crisis[id].isGlobal)
    ) {
      console.log("Expanding", id);
      expandCrisisTiles(runtime, id);
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
  let policyData = {};
  const policiesScrollable =
    runtime.objects.ScrollablePanel.getAllInstances().filter(
      (scrollable) => scrollable.instVars["id"] == "policy"
    )[0];
  const x = policiesScrollable.x + policiesScrollable.width / 2;
  let initialY = policiesScrollable.y + 40 / 2;
  console.log("Policy", policy);

  for (const variable in policy) {
    const policyName = policy[variable];
    if (!policyData[policyName.type]) {
      console.log("adding policy");
      policyData[policyName.type] = {
        count: 0,
        y: initialY,
        policies: [],
      };
    }
    console.log("Policy name", policyName);

    const instanceY = policyData[policyName.type].y;

    const clickablePanelX = policiesScrollable.x + 40;
    const clickablePanelY = instanceY - 10;
    let clickablePanel = runtime.objects.ClickablePanel.createInstance(
      "PanelPolicy",
      clickablePanelX,
      clickablePanelY
    );
    clickablePanel.instVars["id"] = variable + "_clickable_panel_policy";
    clickablePanel.instVars["clickable"] = true;
    clickablePanel.instVars["isDisabled"] = true;
    clickablePanel.instVars["panelId"] = "policy";
    clickablePanel.width = policiesScrollable.width - 40;
    clickablePanel.height = 100;
    clickablePanel.isVisible = false;
    addClickablePanelToCache(clickablePanel);
    policiesScrollable.addChild(clickablePanel);

    let policyNameText = runtime.objects.UIText.createInstance(
      "PanelPolicy",
      x,
      instanceY
    );
    policyNameText.instVars["id"] = variable + "_policy_title";
    policyNameText.colorRgb = [1, 1, 1];
    policyNameText.text = policyName.name;
    policyNameText.blendMode = "source-atop";
    policyNameText.characterScale = 0.25;
    policyNameText.isVisible = false;
    addTextToCache(policyNameText);
    policiesScrollable.addChild(policyNameText);

    let policyValueText = runtime.objects.UIText.createInstance(
      "PanelPolicy",
      x,
      instanceY + 30
    );
    policyValueText.instVars["id"] = variable + "_policy_value";
    policyValueText.colorRgb = [1, 1, 1];
    policyValueText.text = policyName.value.toString();
    policyValueText.blendMode = "source-atop";
    policyValueText.characterScale = 0.25;
    policyValueText.isVisible = false;
    addTextToCache(policyValueText);
    policiesScrollable.addChild(policyValueText);

    policyData[policyName.type].y += 50;
    policyData[policyName.type].count++;
    policyData[policyName.type].policies.push(variable);
  }

  console.log("Policy data", policyData);

  for (const variable in policyData) {
    const data = policyData[variable];
    console.log("Data", data);
    policyScrollableData[variable] = {
      height: data.count * 90 + 20,
      policies: data.policies,
    };
  }
}

let policyScrollableData = {};

function showPolicyPanel(policyType, runtime) {
  console.log("Policy scrollable data", policyScrollableData);
  console.log("Policy type", policyType);
  let policiesScrollable =
    runtime.objects.ScrollablePanel.getAllInstances().filter(
      (scrollable) => scrollable.instVars["id"] == "policy"
    )[0];
  const policyPanel = runtime.objects.UIPanel.getAllInstances().filter(
    (panel) => panel.instVars["id"] == "policy"
  )[0];

  for (const policyName in policy) {
    console.log("Policy name invisible", policyName);
    const policyNameText = getTextById(policyName + "_policy_title");
    policyNameText.isVisible = false;
    const policyValueText = getTextById(policyName + "_policy_value");
    policyValueText.isVisible = false;
    const clickablePanel = getClickablePanelById(
      policyName + "_clickable_panel_policy"
    );
    clickablePanel.instVars["isDisabled"] = true;
  }

  if (policyScrollableData[policyType]) {
    console.log("Setting height", policyType, policyScrollableData[policyType]);
    const scrollableHeight = policyScrollableData[policyType].height;
    policiesScrollable.height = scrollableHeight;
    policiesScrollable.instVars["min"] =
      policiesScrollable.y - policiesScrollable.height + policyPanel.height;
    policiesScrollable.instVars["max"] = policiesScrollable.y;

    for (const policyName of policyScrollableData[policyType].policies) {
      console.log("Policy name visible", policyName);
      const policyNameText = getTextById(policyName + "_policy_title");
      policyNameText.isVisible = true;
      const policyValueText = getTextById(policyName + "_policy_value");
      policyValueText.isVisible = true;
      const clickablePanel = getClickablePanelById(
        policyName + "_clickable_panel_policy"
      );
      clickablePanel.instVars["isDisabled"] = false;
    }
  } else {
    policiesScrollable.height = 0;
    policiesScrollable.instVars["min"] =
      policiesScrollable.y - policiesScrollable.height + policyPanel.height;
    policiesScrollable.instVars["max"] = policiesScrollable.y;
  }
}

function initializeStatusViews(runtime) {
  let statusData = {};
  const panelStatus = runtime.objects.UIPanel.getAllInstances().filter(
    (panel) => panel.instVars["id"] == "status_panel"
  )[0];
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

    console.log("Status name", statusName, initialY, row, instanceY, instanceX);

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

    console.log(
      "Status name text",
      statusNameText.getChildCount(),
      statusNameText.getChildAt(0),
      statusNameText.getChildAt(1),
      statusNameText.getChildAt(2)
    );

    // let sliderBarBG = runtime.objects.SliderBarBG.createInstance("PanelStatus", instanceX, instanceY + 40);
    let sliderBarBG = statusNameText.getChildAt(1);
    sliderBarBG.instVars["id"] = variable + "_status_slider_bg";
    console.log("Slider bar bg", sliderBarBG.instVars["id"]);
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

    const clickablePanelX = instanceX + 50;
    const clickablePanelY = instanceY - 10;
    // let clickablePanel = runtime.objects.ClickablePanel.createInstance("PanelStatus", instanceX, instanceY - 10);
    let clickablePanel = statusNameText.getChildAt(3);
    clickablePanel.instVars["id"] = variable + "_clickable_panel_status";
    clickablePanel.instVars["clickable"] = true;
    clickablePanel.instVars["isDisabled"] = true;
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
  const statusPanel = runtime.objects.UIPanel.getAllInstances().filter(
    (panel) => panel.instVars["id"] == "status_panel"
  )[0];

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

      // setSliderValue(sliderBar, statusValueText, status[statusName].value, status[statusName].value.toString());
    }

    statusPanel.height =
      20 + Math.ceil(statusViewData[statusType].statuses.length / 3) * 100;
  }
}
