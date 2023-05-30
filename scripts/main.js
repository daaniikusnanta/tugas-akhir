import { setLevelVariables } from "./level-data.js";
import { status, updateStatus } from "./status-data.js";
import { crisis, crisisFsms, updateCrisis } from "./crisis-data.js";

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
	updateFSM();
	updateStatusView(runtime);

	for (const crisisVariable in crisis) {
		let crisisText = runtime.objects.UIText2.getAllInstances();
    	crisisText = crisisText.filter(text => text.instVars['id'] === crisisVariable)[0];

		let update = crisis[crisisVariable].lastUpdate.toFixed(2);
		if (update > 0) {
			update = "+" + update;
		}
		crisisText.text = crisisVariable.split('_')[0].substring(0, 4) + " " + crisis[crisisVariable].value.toString().substring(0, 4) + " (" + update + ")";
	}
}

function updateFSM() {
	const result = Object.values(crisisFsms).some(fsm => fsm.updateState());

	if (result) {
		updateFSM();
		return;
	}

	Object.values(crisisFsms).forEach(fsm => fsm.tick());
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

function updateStatusView(runtime) {
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

	const statusBars = document.querySelectorAll('.status_bar');
    for (const statusBar of statusBars) {
        statusBar.value = status[statusBar.id].value;
    }
}