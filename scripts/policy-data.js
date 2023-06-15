import { updateIncomeFromPolicy, updateSpendingFromPolicy } from "./fiscal-data.js";
import { status } from "./status-data.js";
import { crisis } from "./crisis-data.js";
import { addTextToCache, clamp, getTextById } from "./utils.js";

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
        value: 50,
        finalValue: 0,
        implementationCost: 0,
        implementationDelay: 0,
        implementationDuration: 0,
        valueDelta: 0,
        minCost: 0,
        maxCost: 0,
        minRevenue: 2,
        maxRevenue: 100,
        effects: {
            "taxes": {
                name: "Taxes",
                type: "status",
                effectDelay: 0,
                valueType: "positive",
                value: 0,
                valueDelta: 0,
                effectDuration: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
            "discrimination": {
                name: "Discrimination",
                type: "crisis",
                effectDelay: 0,
                valueType: "positive",
                value: 0,
                valueDelta: 0,
                effectDuration: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
            "public_health": {
                name: "Public Health",
                type: "status",
                effectDelay: 0,
                valueType: "negative",
                value: 0,
                valueDelta: 0,
                effectDuration: 0,
                formula: function (policyValue) {return 0 - 0.2 * policyValue},
            },
            "investment": {
                name: "Investment",
                type: "status",
                effectDelay: 0,
                valueType: "negative",
                value: 0,
                valueDelta: 0,
                effectDuration: 0,
                formula: function (policyValue) {return 0 - 0.2 * policyValue},
            },
            "poverty": {
                name: "Poverty",
                type: "crisis",
                effectDelay: 0,
                valueType: "positive",
                value: 0,
                valueDelta: 0,
                effectDuration: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
            "economy": {
                name: "Economy",
                type: "status",
                effectDelay: 0,
                valueType: "positive",
                value: 0,
                valueDelta: 0,
                effectDuration: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
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
        implementationDuration: 0,
        valueDelta: 0,
        minCost: 0,
        maxCost: 100,
        minRevenue: 0,
        maxRevenue: 0,
        effects: {
            "research": {
                name: "Research",
                type: "status",
                effectDelay: 0,
                valueType: "positive",
                value: 0,
                valueDelta: 0,
                value: 0,
                effectDuration: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            }
        }
    }
}

export function implementPolicyChange(policyName, newValue) {
    let policyData = policy[policyName];
    if (policyData) {
        policyData.finalValue = clamp(newValue, 0, 100);
        let { value, finalValue, implementationDelay } = policyData;

        policyData.implementationDuration = 0;

        for (const effect in policyData.effects) {
            let effectData = policyData.effects[effect];
            effectData.effectDuration = 0;
            effectData.valueDelta = (effectData.formula(finalValue) - value) / implementationDelay;
        }

        updateIncomeFromPolicy(policyData);
        updateSpendingFromPolicy(policyData);
    }
}

export function updatePolicy(policyName) {
    let policyData = policy[policyName];
    let { value, finalValue, implementationDelay, implementationDuration } = policyData;

    // If the delay duration has passed, update the policy value
    if (policyData, implementationDuration >= implementationDelay) {
        policyData.value == finalValue;

        updatePolicyEffects(policyName);
    }

    policyData.implementationDuration++;
}

export function updatePolicyEffects(policyName) {
    let policyData = policy[policyName];
    
    if (policyData) {
        for (const effect in policyData.effects) {
            let policyEffectData = policyData.effects[effect];
            let { effectDelay, effectDuration } = policyEffectData;

            // If the change is not complete yet, update the effect value
            if (effectDuration <= effectDelay) {
                let effectData = status[effect] ?? crisis[effect];

                if (effectData) {
                    const update = - 0.3 + policyData.value * 0.2;
                    effectData.value += effectData.valueDelta;
                    effectData.policyValue += effectData.valueDelta;
                    // effectData.lastUpdatePolicy += update;
                }
            }
            policyEffectData.effectDuration++;
        }
    }
}

export function setupPolicyPopUp(policyName, runtime) {
    const policyData = policy[policyName];
    const policyNameText = getTextById("policy_pop_up_name");
    policyNameText.text = policyData.name ?? policyName;
    const policyDescText = getTextById("policy_pop_up_description");
    policyDescText.text = policyData.description ?? "";

    const slider = runtime.objects.Slider.getPickedInstances()[0];

    const costText = getTextById("policy_pop_up_cost_slider");
    const cost = policyData.minCost + (policyData.value / 100 * (policyData.maxCost - policyData.minCost));
    setSliderValue(slider, costText, policyData.value, cost.toString());

    const revenueText = getTextById("policy_pop_up_revenue_slider");
    const revenue = policyData.minRevenue + (policyData.value / 100 * (policyData.maxRevenue - policyData.minRevenue));
    setSliderValue(slider, revenueText, policyData.value, revenue.toString());
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

            const effectData = policyData.effects[effect];
            effectData.value = effectData.formula(policyData.value);
    
            const effectName = runtime.objects.UIText.createInstance("PolicyPopUpMG", instanceX, instanceY, true, "policy_effect_view");
            effectName.text = effectData.name;
            effectName.instVars['id'] = effect + "_" + policyName + "_effects_name";
            addTextToCache(effectName);
        
            const effectValue = effectName.getChildAt(0);
            effectValue.text = effectData.value.toString();
            effectValue.instVars['id'] = effect + "_" + policyName + "_effects_value";
        
            const effectSliderPositive = effectName.getChildAt(2);
            effectSliderPositive.instVars['id'] = effect + "_" + policyName + "_positive_effects_slider";

            const effectSliderNegative = effectName.getChildAt(3);
            effectSliderNegative.instVars['id'] = effect + "_" + policyName + "_negative_effects_slider";

            if (effectData.valueType === "positive") {
                effectSliderPositive.isVisible = true;
                effectSliderNegative.isVisible = false;
            } else {
                effectSliderPositive.isVisible = false;
                effectSliderNegative.isVisible = true;
            }
            console.log("create type", policyName, effect);
            console.log("create type", effectData.valueType, effectName.getChildAt(0), effectName.getChildAt(1), effectName.getChildAt(2), effectName.getChildAt(3));

            scrollableEffects.addChild(effectName, { transformX: true, transformY: true });
        
            instanceY += 120;
        }    
    }
}

export function showPolicyEffectViews(policyName, runtime) {
    const policyData = policy[policyName];
    console.log("showing", policyName, policyData);
    const scrollableEffects = runtime.objects.ScrollablePanel.getAllInstances().filter(s => s.instVars['id'] === "pop_up_policy_effects")[0];
    scrollableEffects.y = scrollableEffects.instVars['initialY'];

    for (const otherPolicyName in policy) {
        let otherPolicyData = policy[otherPolicyName];
        console.log("other", otherPolicyName, policyName);
        if (otherPolicyName === policyName) continue;

        for (const effect in otherPolicyData.effects) {
            console.log("hide", effect + "_" + otherPolicyName + "_effects_name");
            const effectName = getTextById(effect + "_" + otherPolicyName + "_effects_name");
            effectName.isVisible = false;

            console.log("children", effectName.getChildAt(0), effectName.getChildAt(1), effectName.getChildAt(2), effectName.getChildAt(3));
        }
    }

    for (const effect in policyData.effects) {
        const effectData = policyData.effects[effect];

        const effectName = getTextById(effect + "_" + policyName + "_effects_name");
        console.log("text", effectName.instVars['id'], effectName.text, effectName.isVisible);
        effectName.isVisible = true;

        const effectValue = effectName.getChildAt(0);
        effectValue.text = effectData.value.toString();
        const value = Math.abs(effectData.value)
        const newValue = Math.abs(effectData.formula(policyData.value));
        const valueChange = newValue - value;

        const effectSliderPositive = effectName.getChildAt(2);
        effectSliderPositive.isVisible = effectData.valueType === "positive";
        const effectSliderNegative = effectName.getChildAt(3);
        effectSliderNegative.isVisible = effectData.valueType === "negative";

        const effectSlider = effectData.valueType === "negative" ? effectSliderNegative : effectSliderPositive;
        const effectSliderChange = effectSlider.getChildAt(0);
        
        effectSlider.width = value / 100 * effectSlider.instVars['maxWidth'];
        effectSliderChange.width = newValue / 100 * effectSliderChange.instVars['maxWidth'];
        
        if (valueChange > 0) {
            effectSliderChange.moveAdjacentToInstance(effectSlider, false);
            effectSliderChange.isVisible = true;
        } else if (valueChange < 0) {
            effectSliderChange.moveAdjacentToInstance(effectSlider, true);
            effectSliderChange.isVisible = true;
        } else {
            effectSliderChange.isVisible = false;
        }
    }

    const popUpPolicyEffectsPanel = runtime.objects.UIPanel2.getAllInstances().filter(p => p.instVars['id'] == "pop_up_policy_effects")[0];
    scrollableEffects.height = Object.keys(policyData.effects).length * 120 + 40 / 2;
	scrollableEffects.instVars['min'] = scrollableEffects.y - scrollableEffects.height + popUpPolicyEffectsPanel.height;
	scrollableEffects.instVars['max'] = scrollableEffects.y;
}

export function updatePolicyEffectViews(policyName, newPolicyValue) {
    const policyData = policy[policyName];

    for (const effect in policyData.effects) {
        console.log("update", effect + "_" + policyName + "_effects_name", newPolicyValue)
        const effectData = policyData.effects[effect];
        
        // TODO: should use formula

        const effectName = getTextById(effect + "_" + policyName + "_effects_name");
        const value = Math.abs(effectData.value);

        const newValue = effectData.formula(newPolicyValue);
        const newValueAbs = Math.abs(effectData.formula(newPolicyValue));

        const valueChange = newValueAbs - value;

        const effectValue = effectName.getChildAt(0);
        effectValue.text = newValue.toString();

        const effectSliderPositive = effectName.getChildAt(2);
        const effectSliderNegative = effectName.getChildAt(3);

        const effectSlider = effectData.valueType === "negative" ? effectSliderNegative : effectSliderPositive;
        const effectSliderChange = effectSlider.getChildAt(0);
        
        effectSliderChange.width = newValueAbs / 100 * effectSliderChange.instVars['maxWidth'];
        
        if (valueChange > 0) {
            effectSliderChange.moveAdjacentToInstance(effectSlider, false);
            effectSliderChange.isVisible = true;
        } else if (valueChange < 0) {
            effectSliderChange.moveAdjacentToInstance(effectSlider, true);
            effectSliderChange.isVisible = true;
        } else {
            effectSliderChange.isVisible = false;
        }
    }
}