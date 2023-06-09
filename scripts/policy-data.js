import { updateIncomeFromPolicy, updateSpendingFromPolicy } from "./fiscal-data.js";

/**
 * @typedef {{
*     effect: string,
*     type: string,
*     yIntercept: number,
*     inertia: number,
*     factor: number,
*     formula: function(),
* }} Effect
*/

/**
 * @type {{
 *   [key: string]: {
 *      name: string,
 *      description: string,
 *      type: string,
 *      value: number,
 *      finalValue: number,
 *      implementationCost: number,
 *      implementationDelay: number,
 *      valueDelta: number,
 *      minCost: number,
 *      maxCost: number,
 *      minRevenue: number,
 *      maxRevenue: number,
 *      effects: Effect[]
 * }}}
 */
export let policy = {
    "income_tax": {
        name: "Income Tax",
        description: "A tax on income.",
        type: "finance",
        value: 0,
        finalValue: 0,
        implementationCost: 0,
        implementationDelay: 0,
        valueDelta: 0,
        minCost: 0,
        maxCost: 0,
        minRevenue: 2,
        maxRevenue: 100,
        effects: [
        ]
    },
    "research_grants": {
        name: "Research Grants",
        description: "A grant to fund research.",
        type: "education",
        value: 50,
        finalValue: 0,
        implementationCost: 0,
        implementationDelay: 0,
        valueDelta: 0,
        minCost: 0,
        maxCost: 100,
        minRevenue: 0,
        maxRevenue: 0,
        effects: [
        ]
    }
}

export function implementPolicy(policyName) {
    let policyToImplement = policy[policyName];
    let { value, finalValue, implementationDelay } = policyToImplement;
    if (policyToImplement) {
        policyToImplement.currentImplementationDuration = 0;
        policyToImplement.currentValueDelta = (finalValue - value) / implementationDelay;

        updateIncomeFromPolicy(policyToImplement);
        updateSpendingFromPolicy(policyToImplement);
    }
}

export function updatePolicy(policyName) {
    let policyToUpdate = policy[policyName];
    let { value, finalValue } = policyToUpdate;
    if (policyToUpdate && value != finalValue) {
        policyToUpdate.value += policyToUpdate.currentValueDelta;
        policyToUpdate.currentImplementationDuration++;
    }
}
