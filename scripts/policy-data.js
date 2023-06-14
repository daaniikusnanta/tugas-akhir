import { updateIncomeFromPolicy, updateSpendingFromPolicy } from "./fiscal-data.js";
import { status } from "./status-data.js";
import { crisis } from "./crisis-data.js";
import { addTextToCache, getTextById } from "./utils.js";

/**
 * @typedef {{
*     name: string,
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
        effects: {
            "taxes": {
                name: "Taxes",
                type: "status",
            },
            "discrimination": {
                name: "Discrimination",
                type: "crisis",
            },
            "public_health": {
                name: "Public Health",
                type: "status",
            },
            "investment": {
                name: "Investment",
                type: "status",
            },
            "poverty": {
                name: "Poverty",
                type: "crisis",
            },
            "economy": {
                name: "Economy",
                type: "status",
            },
        }
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
        effects: {
            "taxes": {
                name: "Taxes",
                type: "status",
            }
        }
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

export function createPolicyEffectViews(runtime) {
    const scrollableEffects = runtime.objects.ScrollablePanel.getAllInstances().filter(s => s.instVars['id'] === "pop_up_policy_effects")[0];
    let initialY = scrollableEffects.y + 10;

    const policyEffectPositions = {};

    for (const policyName in policy) {
        let policyData = policy[policyName];

        for (const effect in policyData.effects) {
            let instanceY = initialY + Object.keys(policyData.effects).indexOf(effect) * 120;
            const instanceX = scrollableEffects.x + 30;

            const effectData = status[effect] ?? crisis [effect];
    
            const effectName = runtime.objects.UIText.createInstance("PolicyPopUpMG", instanceX, instanceY, true, "policy_effect_view");
            effectName.text = effectData.name;
            effectName.instVars['id'] = effect + "_" + policyName + "_effects_name";
            effectName.isVisible = false;
            addTextToCache(effectName);

            console.log("create", effect + "_" + policyName + "_effects_name");
        
            const effectValue = effectName.getChildAt(0);
            effectValue.text = effectData.value.toString();
            effectValue.instVars['id'] = effect + "_" + policyName + "_effects_value";
        
            const effectSliderBg = effectName.getChildAt(1);
        
            const effectSlider = effectName.getChildAt(2);
            effectSlider.width = effectData.value / 100 * effectSliderBg.width;
            effectSlider.instVars['id'] = effect + "_" + policyName + "_effects_slider";
        
            const effectSliderChange = effectName.getChildAt(3);
            effectSliderChange.instVars['id'] = effect + "_" + policyName + "_effects_slider_change";
        
            scrollableEffects.addChild(effectName, { transformX: true, transformY: true });
        
            instanceY += 120;
        }    
    }
}

export function showPolicyEffectViews(policyName, runtime) {
    const policyData = policy[policyName];

    const scrollableEffects = runtime.objects.ScrollablePanel.getAllInstances().filter(s => s.instVars['id'] === "pop_up_policy_effects")[0];
    scrollableEffects.y = scrollableEffects.instVars['initialY'];
    
    for (const otherPolicyName in policy) {
        let otherPolicyData = policy[otherPolicyName];

        if (otherPolicyName === policyName) continue;

        for (const effect in otherPolicyData.effects) {
            const effectName = getTextById(effect + "_" + otherPolicyName + "_effects_name");
            effectName.isVisible = false;
        }
    }

    for (const effect in policyData.effects) {
        console.log("show", effect + "_" + policyName + "_effects_name")
        const effectName = getTextById(effect + "_" + policyName + "_effects_name");
        effectName.isVisible = true;
    }

    const popUpPolicyEffectsPanel = runtime.objects.UIPanel2.getAllInstances().filter(p => p.instVars['id'] == "pop_up_policy_effects")[0];
    scrollableEffects.height = Object.keys(policyData.effects).length * 120 + 40 / 2;
	scrollableEffects.instVars['min'] = scrollableEffects.y - scrollableEffects.height + popUpPolicyEffectsPanel.height;
	scrollableEffects.instVars['max'] = scrollableEffects.y;
}