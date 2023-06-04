import { status, updateStatus } from "./status-data.js";
import { crisis, crisisFsms, updateCrisis } from "./crisis-data.js";
import { addTextToCache, getTextById, setSliderValue } from "./utils.js";
import { expandCrisisTiles } from "./tile-data.js";

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

export function setupCrisisViews(runtime) {
	const margin = 40;
	const crisisScrollable = runtime.objects.ScrollablePanel.getAllInstances().filter(scrollable => scrollable.instVars['id'] == "crisis")[0];
	const x = crisisScrollable.x + crisisScrollable.width/2;
	let y = crisisScrollable.y + margin/2;
	
	for (const variable in crisis) {
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
	let statusTexts = runtime.objects.UIText2.getAllInstances();
    statusTexts = statusTexts.filter(text => text.instVars['id'].endsWith("_status"));

    for (const statusText of statusTexts) {
        const id = statusText.instVars['id'];
		let update = status[id.substring(0, id.indexOf("_status"))].lastUpdate.toFixed(2);
		if (update > 0) {
			update = "+" + update;
		}
        const statusValue = status[id.substring(0, id.indexOf("_status"))].value.toString().substring(0, 4) + " (" + update + ")";
        statusText.text = statusValue;
    }
	
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

	const statusBars = document.querySelectorAll('.status_bar');
    for (const statusBar of statusBars) {
        statusBar.value = status[statusBar.id].value;
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