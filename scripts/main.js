import { setLevelVariables } from "./level-data.js";
import { status } from "./status-data.js";
import { initializeTileBiome } from "./tile-data.js";
import { deleteTextFromCache, setupClickablePanelCache, setupTextCache } from "./utils.js";

runOnStartup(async runtime => {
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});

async function OnBeforeProjectStart(runtime) {
	runtime.addEventListener("tick", () => Tick(runtime));
	runtime.getLayout("SmallMapLayout").addEventListener(
		"beforelayoutstart", () => GameLayoutBeforeLayoutStartHandler(runtime));
	runtime.getLayout("MediumMapLayout").addEventListener(
		"beforelayoutstart", () => GameLayoutBeforeLayoutStartHandler(runtime));
	runtime.getLayout("LargeMapLayout").addEventListener(
		"beforelayoutstart", () => GameLayoutBeforeLayoutStartHandler(runtime));
	runtime.getLayout("CreateLevelLayout").addEventListener(
		"beforelayoutstart", () => GameLayoutBeforeLayoutStartHandler(runtime));

	runtime.objects.UIText.addEventListener("instancedestroy", ({ instance: text }) => {
		deleteTextFromCache(text.instVars['id']);
	});
	runtime.objects.ClickablePanel.addEventListener("instancedestroy", ({ instance: clickablePanel }) => {
		deleteTextFromCache(clickablePanel.instVars['id']);
	});
}

function Tick(runtime) {
	// runs every tick
}

function GameLayoutBeforeLayoutStartHandler(runtime) {
	setupTextCache(runtime);
	setupClickablePanelCache(runtime);
}