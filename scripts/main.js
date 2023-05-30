import { setLevelVariables } from "./level-data.js";
import { status, updateStatus } from "./status-data.js";
import { crisis, crisisFsms, updateCrisis } from "./crisis-data.js";
import "./utils.js";
import { setSliderValue } from "./utils.js";

runOnStartup(async runtime => {
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});

async function OnBeforeProjectStart(runtime) {
	runtime.addEventListener("tick", () => Tick(runtime));
	runtime.getLayout("Game Layout").addEventListener (
		"afterlayoutstart", () => GameLayoutAfterLayoutStartHandler(runtime));

	setLevelVariables(0, runtime);
}

function Tick(runtime) {
	// updateFSM();
	// updateStatusView(runtime);
	// updateCrisisView(runtime);
}

function GameLayoutAfterLayoutStartHandler(runtime)
{
	// document.getElementById("inflation_slider").addEventListener("input", e => changeStatus(e.target.value, runtime));
	
	const statusBars = document.querySelectorAll('.status_bar');
    for (const statusBar of statusBars) {
        statusBar.addEventListener("input", e => {
			status[statusBar.id].value = parseFloat(e.target.value);
		});
    }
}

// function updateFSM() {
// 	const result = Object.values(crisisFsms).some(fsm => fsm.updateState());

// 	if (result) {
// 		updateFSM();
// 		return;
// 	}

// 	Object.values(crisisFsms).forEach(fsm => fsm.tick());
// }

// function updateStatusView(runtime) {
// 	let statusTexts = runtime.objects.UIText2.getAllInstances();
//     statusTexts = statusTexts.filter(text => text.instVars['id'].endsWith("_status"));

//     for (const statusText of statusTexts) {
//         const id = statusText.instVars['id'];
// 		let update = status[id.substring(0, id.indexOf("_status"))].lastUpdate.toFixed(2);
// 		if (update > 0) {
// 			update = "+" + update;
// 		}
//         const statusValue = status[id.substring(0, id.indexOf("_status"))].value.toString().substring(0, 4) + " (" + update + ")";
//         statusText.text = statusValue;
//     }
	
// 	let statusSliders = runtime.objects.SliderBar.getAllInstances();
// 	statusSliders = statusSliders.filter(slider => slider.instVars['id'].endsWith("status_slider"));

//     for (const statusSlider of statusSliders) {
// 		const id = statusSlider.instVars['id'].replace("_status_slider", "");
// 		const value = status[id].value;

// 		const statusText = runtime.objects.UIText.getAllInstances().filter(text => text.instVars['id'] === id + "_status_text")[0];
// 		const update = (status[id].lastUpdate >= 0) ? "+" + status[id].lastUpdate.toFixed(2) : status[id].lastUpdate.toFixed(2);
// 		const text = value.toFixed(2).toString() + " (" + update + ")";
// 		setSliderValue(statusSlider, statusText, value, text);
//     }

// 	const statusBars = document.querySelectorAll('.status_bar');
//     for (const statusBar of statusBars) {
//         statusBar.value = status[statusBar.id].value;
//     }
// }

// function updateCrisisView(runtime) {
// 	let crisisSliders = runtime.objects.SliderBar.getAllInstances();
// 	crisisSliders = crisisSliders.filter(slider => slider.instVars['id'].endsWith("crisis_slider"));

// 	for (const crisisSlider of crisisSliders) {
// 		const id = crisisSlider.instVars['id'].replace("_crisis_slider", "");
// 		const value = crisis[id].value;

// 		const crisisText = runtime.objects.UIText.getAllInstances().filter(text => text.instVars['id'] === id + "_crisis_text")[0];
// 		const update = (crisis[id].lastUpdate >= 0) ? "+" + crisis[id].lastUpdate.toFixed(2) : crisis[id].lastUpdate.toFixed(2);
// 		const text = value.toFixed(2).toString() + " (" + update + ")";
// 		setSliderValue(crisisSlider, crisisText, value, text);
// 	}
// }