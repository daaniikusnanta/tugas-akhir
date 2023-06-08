import { status, updateStatus } from "./status-data.js";
import { crisis, crisisFsms, updateCrisis } from "./crisis-data.js";
import { addTextToCache, getTextById, addClickablePanelToCache, getClickablePanelById, setSliderValue, clamp } from "./utils.js";
import { expandCrisisTiles } from "./tile-data.js";
import { policy } from "./policy-data.js";
import { updateIncome, updateSpending } from "./fiscal-data.js";

function updateAllStatus() {
	for (const statusVariable in status) {
        // console.log("Updating status " + statusVariable);
		updateStatus(statusVariable)
	}
}

function updateAllCrisis() {
	for (const crisisVariable in crisis) {
        // console.log("Updating crisis " + crisisVariable);
		updateCrisis(crisisVariable);
	}
}

function updateFiscalViews(runtime) {
	updateIncome(runtime);
	updateSpending(runtime);
}

export function setupCrisisViews(runtime) {
	const margin = 40;
	const crisisScrollable = runtime.objects.ScrollablePanel.getAllInstances().filter(scrollable => scrollable.instVars['id'] == "crisis")[0];
	const x = crisisScrollable.x + crisisScrollable.width/2;
	let y = crisisScrollable.y + margin/2;
	
	for (const variable in crisis) {
		const clickablePanelX = crisisScrollable.x + 10;
		const clickablePanelY = y - 5;
		let clickablePanel = runtime.objects.ClickablePanel.createInstance("panelcrisisbackground", clickablePanelX, clickablePanelY);
		clickablePanel.instVars['id'] = variable + "_clickable_panel_crisis";
		clickablePanel.instVars['clickable'] = true;
		clickablePanel.instVars['panelId'] = "crisis";
		clickablePanel.blendMode = "source-atop";
		clickablePanel.width = crisisScrollable.width - 20;
		clickablePanel.height = 80;
		addClickablePanelToCache(clickablePanel);
		crisisScrollable.addChild(clickablePanel, { transformX: true, transformY: true });

		let sliderBarBG = runtime.objects.SliderBarBG.createInstance("panelcrisisbackground", x, y + 40);
		sliderBarBG.blendMode = "source-atop"
		sliderBarBG.animationFrame = 1;
		crisisScrollable.addChild(sliderBarBG, { transformX: true, transformY: true });
		
		let sliderBar = runtime.objects.SliderBar.createInstance("panelcrisisbackground", x, y + 34);
		
		sliderBar.instVars['minX'] = x - sliderBarBG.width/2;
		sliderBar.instVars['maxX'] = x + sliderBarBG.width/2;
		sliderBar.instVars['maxValue'] = 100;
		sliderBar.instVars['value'] = 0;
		sliderBar.instVars['id'] = variable + "_crisis_slider";
		sliderBar.blendMode = "source-atop"
		crisisScrollable.addChild(sliderBar, { transformX: true, transformY: true });

		let xText = x - sliderBarBG.width/2;
		
		let titleText = runtime.objects.UIText.createInstance("panelcrisisbackground", xText, y);
		titleText.colorRgb = [255, 255, 255];
		titleText.blendMode = "source-atop";
		titleText.characterScale = 0.3;
		addTextToCache(titleText);

		const words = variable.replace("_", " ").split(" ");
		for (let i = 0; i < words.length; i++) {
		  words[i] = words[i][0].toUpperCase() + words[i].substr(1);
		}
		titleText.text = words.join(" ");

		crisisScrollable.addChild(titleText, { transformX: true, transformY: true });
		
		let valueText = runtime.objects.UIText.createInstance("panelcrisisbackground", xText, y + 52);
		valueText.instVars['id'] = variable + "_crisis_text";
		valueText.colorRgb = [193, 200, 220];
		valueText.text = "0";		
		valueText.blendMode = "source-atop";
		valueText.characterScale = 0.25;
		crisisScrollable.addChild(valueText, { transformX: true, transformY: true });
		addTextToCache(valueText);
		
		y += 52 + margin;
	}
	
	const crisisPanel = runtime.objects.UIPanel.getAllInstances().filter(panel => panel.instVars['id'] == "crisis")[0];
	crisisScrollable.height = Object.keys(crisis).length * (margin + 52) + margin / 2;
	crisisScrollable.instVars['min'] = crisisScrollable.y - crisisScrollable.height + crisisPanel.height;
	crisisScrollable.instVars['max'] = crisisScrollable.y;
}

export function updateStatusView(runtime) {	
	let statusSliders = runtime.objects.SliderBar.getAllInstances();
	statusSliders = statusSliders.filter(slider => slider.instVars['id'].endsWith("status_slider"));

    for (const statusSlider of statusSliders) {
		const id = statusSlider.instVars['id'].replace("_status_slider", "");
		const value = status[id].value;

		const statusText = getTextById(id + "_status_text");
		const update = (status[id].lastUpdate >= 0) ? "+" + status[id].lastUpdate.toFixed(2) : status[id].lastUpdate.toFixed(2);
		const text = value.toFixed(2).toString() + " (" + update + ")";
		setSliderValue(statusSlider, statusText, value, text);
    }
}

export function updateCrisisView(runtime) {
	let crisisSliders = runtime.objects.SliderBar.getAllInstances();
	crisisSliders = crisisSliders.filter(slider => slider.instVars['id'].endsWith("crisis_slider"));

	for (const crisisSlider of crisisSliders) {
		const id = crisisSlider.instVars['id'].replace("_crisis_slider", "");
		const value = crisis[id].value;

		const crisisText = getTextById(id + "_crisis_text");
		const update = (crisis[id].lastUpdate >= 0) ? "+" + crisis[id].lastUpdate.toFixed(2) : crisis[id].lastUpdate.toFixed(2);
		const text = value.toFixed(2).toString() + " (" + update + ")";
		setSliderValue(crisisSlider, crisisText, value, text);

		if (crisisFsms[id].value === crisis[id].states[2] || crisisFsms[id].value === crisis[id].states[3] && !crisis[id].isGlobal) {
			console.log("Expanding", id)
			expandCrisisTiles(runtime, id);
		}
	}
}

/**
 * Updates the FSM of every crisis.
 */
function updateFSM() {
	const result = Object.values(crisisFsms).some(fsm => fsm.updateState());

	if (result) {
		updateFSM();
		return;
	}

	Object.values(crisisFsms).forEach(fsm => fsm.tick());
}

export function setCrisisValue(crisisVariable, value) {
	crisis[crisisVariable].value = value;
}

export function setStatusValue(statusVariable, value) {
	status[statusVariable].value = value;
}

function initializePolicyViews(runtime) {
	let policyData = {};
	const policiesScrollable = runtime.objects.ScrollablePanel.getAllInstances().filter(scrollable => scrollable.instVars['id'] == "policy")[0];
	const x = policiesScrollable.x + policiesScrollable.width/2;
	let initialY = policiesScrollable.y + 40/2;
	console.log("Policy", policy);
	
	for (const variable in policy) {
		const policyName = policy[variable];
		if (!policyData[policyName.type]) {
			console.log("adding policy");
			policyData[policyName.type] = {
				count : 0,
				y : initialY,
				policies: []
			};
		}
		console.log("Policy name", policyName);
		
		const instanceY = policyData[policyName.type].y;

		const clickablePanelX = policiesScrollable.x + 40;
		const clickablePanelY = instanceY - 10;
		let clickablePanel = runtime.objects.ClickablePanel.createInstance("PanelPolicy", clickablePanelX, clickablePanelY);
		clickablePanel.instVars['id'] = variable + "_clickable_panel_policy";
		clickablePanel.instVars['clickable'] = true;
		clickablePanel.instVars['isDisabled'] = true;
		clickablePanel.width = policiesScrollable.width - 40;
		clickablePanel.height = 100;
		clickablePanel.isVisible = false;
		addClickablePanelToCache(clickablePanel);
		policiesScrollable.addChild(clickablePanel);
		
		let policyNameText = runtime.objects.UIText.createInstance("PanelPolicy", x, instanceY);
		policyNameText.instVars['id'] = variable + "_policy_title";
		policyNameText.colorRgb = [1, 1, 1];
		policyNameText.text = policyName.name;		
		policyNameText.blendMode = "source-atop";
		policyNameText.characterScale = 0.25;
		policyNameText.isVisible = false;
		addTextToCache(policyNameText);
		policiesScrollable.addChild(policyNameText);
		
		let policyValueText = runtime.objects.UIText.createInstance("PanelPolicy", x, instanceY + 30);
		policyValueText.instVars['id'] = variable + "_policy_value";
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

	console.log("Policy data", policyData)
	
	for (const variable in policyData) {
		
		const data = policyData[variable];
		console.log("Data", data);
		policyScrollableData[variable] = {
			height: data.count * 90 + 20,
			policies: data.policies,
		};
	}
}

let policyScrollableData = {}

function showPolicyPanel(policyType, runtime) {
	console.log("Policy scrollable data", policyScrollableData);
	console.log("Policy type", policyType);
	let policiesScrollable = runtime.objects.ScrollablePanel.getAllInstances().filter(scrollable => scrollable.instVars['id'] == "policy")[0];
	const policyPanel = runtime.objects.UIPanel.getAllInstances().filter(panel => panel.instVars['id'] == "policy")[0];

	for (const policyName in policy) {
		console.log("Policy name invisible", policyName);
		const policyNameText = getTextById(policyName + "_policy_title");
		policyNameText.isVisible = false;
		const policyValueText = getTextById(policyName + "_policy_value");
		policyValueText.isVisible = false;
		const clickablePanel = getClickablePanelById(policyName + "_clickable_panel_policy");
		clickablePanel.instVars['isDisabled'] = true;
	}

	if (policyScrollableData[policyType]) {
		console.log("Setting height", policyType, policyScrollableData[policyType]);
		const scrollableHeight = policyScrollableData[policyType].height;
		policiesScrollable.height = scrollableHeight;
		policiesScrollable.instVars['min'] = policiesScrollable.y - policiesScrollable.height + policyPanel.height;
		policiesScrollable.instVars['max'] = policiesScrollable.y;

		for (const policyName of policyScrollableData[policyType].policies) {
			console.log("Policy name visible", policyName);
			const policyNameText = getTextById(policyName + "_policy_title");
			policyNameText.isVisible = true;
			const policyValueText = getTextById(policyName + "_policy_value");
			policyValueText.isVisible = true;
			const clickablePanel = getClickablePanelById(policyName + "_clickable_panel_policy");
			clickablePanel.instVars['isDisabled'] = false;
		}
	} else {
		policiesScrollable.height = 0;
		policiesScrollable.instVars['min'] = policiesScrollable.y - policiesScrollable.height + policyPanel.height;
		policiesScrollable.instVars['max'] = policiesScrollable.y;
	}
}