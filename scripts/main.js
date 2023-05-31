import { setLevelVariables } from "./level-data.js";
import { status, updateStatus } from "./status-data.js";
import { crisis, crisisFsms, updateCrisis } from "./crisis-data.js";
import "./utils.js";
import { setupTextCache } from "./utils.js";

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
	// runs every tick
}

function GameLayoutAfterLayoutStartHandler(runtime)
{
	setupTextCache(runtime);
	// document.getElementById("inflation_slider").addEventListener("input", e => changeStatus(e.target.value, runtime));
	
	const statusBars = document.querySelectorAll('.status_bar');
    for (const statusBar of statusBars) {
        statusBar.addEventListener("input", e => {
			status[statusBar.id].value = parseFloat(e.target.value);
		});
    }
}