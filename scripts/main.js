import { createMachine } from "./fsm.js";
import { setLevelVariables } from "./level-data.js";
import { status, updateStatus } from "./status-data.js";
import { crisisFsms } from "./crisis-data.js";

runOnStartup(async runtime => {
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});

function changeStatus(value, runtime) {
	console.log("Changing status to " + value);
	inflation = value;
	console.log("Inflation is now " + inflation);
	runtime.objects.InflationStatus.getFirstInstance().text = value.toString();
}

async function OnBeforeProjectStart(runtime) {
	runtime.addEventListener("tick", () => Tick(runtime));
	runtime.getLayout("Game Layout").addEventListener (
		"afterlayoutstart", () => GameLayoutAfterLayoutStartHandler(runtime));

	setLevelVariables(0, runtime);
}

function Tick(runtime) {
	updateFSM();
	updateStatusText(runtime);
}

function updateFSM() {
	const result = crisisFsms.some(fsm => fsm.updateState());

	if (result) {
		updateFSM();
		return;
	}

	crisisFsms.forEach(fsm => fsm.tick());
}

function GameLayoutAfterLayoutStartHandler(runtime)
{
	document.getElementById("inflation_slider").addEventListener("input", e => changeStatus(e.target.value, runtime));
	
	const statusBars = document.querySelectorAll('.status_bar');
    for (const statusBar of statusBars) {
        statusBar.addEventListener("input", e => {
			updateStatus(e.target.id, e.target.value);
		});
    }
}

function updateStatusText(runtime) {
	let statusTexts = runtime.objects.UIText.getAllInstances();
    statusTexts = statusTexts.filter(text => text.instVars['id'].endsWith("_status"));

    for (const statusText of statusTexts) {
        const id = statusText.instVars['id'];
        const statusValue = status[id.substring(0, id.indexOf("_status"))].toString();
        statusText.text = statusValue;
    }
}