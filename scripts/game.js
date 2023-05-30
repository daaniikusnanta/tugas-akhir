import { status, updateStatus } from "./status-data.js";
import { crisis, updateCrisis } from "./crisis-data.js";

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

function setupCrisisViews(runtime) {
	const margin = 40;
	const crisisScrollable = runtime.objects.ScrollablePanel.getAllInstances().filter(scrollable => scrollable.instVars['id'] == "crisis")[0];
	const x = crisisScrollable.x + crisisScrollable.width/2;
	const xText = crisisScrollable.x + margin;
	let y = crisisScrollable.y + margin/2;
	
	for (const variable in crisis) {
		let sliderBarBG = runtime.objects.SliderBarBG.createInstance("panelcrisisbackground", x, y + 30);
		
		let sliderBar = runtime.objects.SliderBar.createInstance("panelcrisisbackground", x, y + 25);
		console.log("Slider", sliderBar);
		sliderBar.instVars['minX'] = x - sliderBarBG.width/2;
		sliderBar.instVars['maxX'] = x + sliderBarBG.width/2;
		sliderBar.instVars['maxValue'] = 100;
		sliderBar.instVars['value'] = 0;
		sliderBar.instVars['id'] = variable + "_crisis_slider";
		sliderBar.blendMode = "source-atop"
		crisisScrollable.addChild(sliderBar, { transformX: true, transformY: true });
		sliderBarBG.blendMode = "source-atop"
		crisisScrollable.addChild(sliderBarBG, { transformX: true, transformY: true });
		
		let titleText = runtime.objects.UIText.createInstance("panelcrisisbackground", xText, y);
		titleText.colorRgb = [255, 255, 255];
		titleText.text = variable
		titleText.blendMode = "source-atop"
		crisisScrollable.addChild(titleText, { transformX: true, transformY: true });
		
		let valueText = runtime.objects.UIText.createInstance("panelcrisisbackground", xText + 20, y + 40);
		valueText.instVars['id'] = variable + "_crisis_value_text";
		valueText.colorRgb = [255, 255, 255];
		valueText.text = "0";		
		valueText.blendMode = "source-atop"
		crisisScrollable.addChild(valueText, { transformX: true, transformY: true });
		
		y += 40 + margin;
	}
	console.log(crisisScrollable.height, Object.keys(crisis).length);
	
	const crisisPanel = runtime.objects.UIPanel.getAllInstances().filter(panel => panel.instVars['id'] == "crisis")[0];
	crisisScrollable.height = Object.keys(crisis).length * (margin + 40) + margin / 2;
	crisisScrollable.instVars['min'] = crisisScrollable.y - crisisScrollable.height + crisisPanel.height;
	crisisScrollable.instVars['max'] = crisisScrollable.y;
}