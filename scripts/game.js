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