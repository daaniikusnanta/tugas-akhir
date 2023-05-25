import { createMachine } from "./fsm.js";
import { setLevelVariables } from "./level-data.js";

/**
 * @typedef {import('./fsm.js').StateMachine} StateMachine
 */

/**
 * @type {StateMachine}
 */
let fsmInflation = null;
let inflation = 0;

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

	fsmInflation = createMachine({
		initialState: "0",
		states: {
			"0": {
				actions: {
					onEnter: () => {
						runtime.objects.InflationState.getFirstInstance().text = "Low";
						console.log("Inflation LOW is now " + inflation);
					}
				},
				transitions: [
					{
						target: "1",
						condition: {
							evaluate: () => 
								inflation >= 30,
						}
					}
				]
			},
			"1": {
				actions: {
					onEnter: () => {
						runtime.objects.InflationState.getFirstInstance().text = "Medium";
						console.log("Inflation MEDIUM is now " + inflation);
					}
				},
				transitions: [
					{
						target: "2",
						condition: {
							evaluate: () => 
								inflation >= 60,
						}
					},
					{
						target: "0",
						condition: {
							evaluate: () => 
								inflation < 30,
						}
					}
				]
			},
			"2": {
				actions: {
					onEnter: () => {
						runtime.objects.InflationState.getFirstInstance().text = "High";
						console.log("Inflation HIGH is now " + inflation);
					}
				},
				transitions: [
					{
						target: "1",
						condition: {
							evaluate: () => 
								inflation < 60,
						}
					},
					{
						target: "3",
						condition: {
							evaluate: () => 
								inflation >= 90,
						}
					}
				]
			},
			"3": {
				actions: {
					onEnter: () => {
						runtime.objects.InflationState.getFirstInstance().text = "Extreme";
						console.log("Inflation EXTREME is now " + inflation);
					}
				},
				transitions: [
					{
						target: "2",
						condition: {
							evaluate: () => 
								inflation < 90,
						}
					}
				]
			}
		}
	})

	setLevelVariables(0, runtime);
}

function Tick(runtime) {
	updateFSM();
}

function updateFSM() {
	
	const fsms = [fsmInflation];

	const result = fsms.some(fsm => fsm.updateState());

	if (result) {
		updateFSM
		return;
	}

	fsms.forEach(fsm => fsm.tick());
}

function GameLayoutAfterLayoutStartHandler(runtime)
{
	document.getElementById("inflation_slider").addEventListener("input", e => changeStatus(e.target.value, runtime));
}

// function updateStatus(runtime) {
// 	 const statusSliders = runtime.objects.StatusSlider.instances();
// 	 statusSliders.forEach(slider => {
// 		slider.value = Status[slider.id];
// 	 });
// }