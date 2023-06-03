import { setLevelVariables } from "./level-data.js";
import { status } from "./status-data.js";
import { initializeTileBiome } from "./tile-data.js";
import { deleteTextFromCache, setupTextCache } from "./utils.js";

runOnStartup(async runtime => {
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});

async function OnBeforeProjectStart(runtime) {
	runtime.addEventListener("tick", () => Tick(runtime));
	runtime.getLayout("Game Layout").addEventListener(
		"beforelayoutstart", () => GameLayoutBeforeLayoutStartHandler(runtime));
	runtime.getLayout("Game Layout").addEventListener(
		"afterlayoutstart", () => GameLayoutAfterLayoutStartHandler(runtime));

	runtime.objects.UIText.addEventListener("instancedestroy", ({ instance: text }) => {
		deleteTextFromCache(text.instVars['id']);
	});
}

function Tick(runtime) {
	// runs every tick
}

function GameLayoutBeforeLayoutStartHandler(runtime) {
	setupTextCache(runtime);

	// document.getElementById("inflation_slider").addEventListener("input", e => changeStatus(e.target.value, runtime));

	const statusBars = document.querySelectorAll('.status_bar');
	for (const statusBar of statusBars) {
		statusBar.addEventListener("input", e => {
			status[statusBar.id].value = parseFloat(e.target.value);
		});
	}
}

function GameLayoutAfterLayoutStartHandler(runtime) {
	setLevelVariables(0, runtime);
	initializeTileBiome(runtime);
}