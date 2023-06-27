import { updateIncomeFromPolicy, updateSpendingFromPolicy } from "./fiscal-data.js";
import { status } from "./status-data.js";
import { crisis } from "./crisis-data.js";
import { addTextToCache, clamp, getObjectbyId, getTextById, resetScrollablePosition, setDeltaSliderZOrder, setScrollableHeight, setSliderValue } from "./utils.js";

export const policyMultiplier = {
    "cost": 0.5,
    "revenue": 0.5,
    "implementationDelay": 0.5,
    "effectDelay": 0.5,
};

/**
 * @typedef {{
*     name: string,
*     type: string,
*     effectDelay: number,
*     valueType: string,
*     value: number,
*     valueDelta: number,
*     effectDuration: number,
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
        description: "A cut on personal income.",
        type: "finance",
        value: 10,
        finalValue: 10,
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
                effectDelay: 5,
                valueType: "positive",
                value: 0,
                valueDelta: 0,
                effectDuration: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
            "wage_income": {
                name: "Wage & Income",
                type: "status",
                effectDelay: 2,
                valueType: "negative",
                value: 0,
                valueDelta: 0,
                effectDuration: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue}
            }
        }
    },
    "corporate_tax": {
        name: "Corporate Tax",
        description: "A tax on corporate's revenue.",
        type: "finance",
        value: 50,
        finalValue: 50,
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
                effectDelay: 5,
                valueType: "positive",
                value: 0,
                valueDelta: 0,
                effectDuration: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
            "investment": {
                name: "Investment",
                type: "status",
                effectDelay: 3,
                valueType: "negative",
                value: 0,
                valueDelta: 0,
                effectDuration: 0,
                formula: function (policyValue) {return 0 - 0.2 * policyValue},
            },
        }
    },
    "research_grants": {
        name: "Research Grants",
        description: "A grant to fund research.",
        type: "education",
        value: 50,
        finalValue: 50,
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
                effectDuration: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            }
        }
    }
}

export function applyPolicyChange(policyName, newValue) {
    console.log("Applying policy change: " + policyName + " to " + newValue);
    let policyData = policy[policyName];
    if (policyData) {
        policyData.finalValue = clamp(newValue, 0, 100);
        let { value, finalValue, implementationDelay } = policyData;

        policyData.implementationDuration = 0;

        for (const effect in policyData.effects) {
            let effectData = policyData.effects[effect];
            effectData.effectDuration = 0;
            effectData.valueDelta = (effectData.formula(finalValue) - effectData.value) / (effectData.effectDelay + 1);
        }

        updateIncomeFromPolicy(policyData);
        updateSpendingFromPolicy(policyData);
    }
}

export function updatePolicy(policyName) {
    let policyData = policy[policyName];
    let { value, finalValue, implementationDelay, implementationDuration } = policyData;
    console.log("update policy", policyData, value, finalValue, implementationDelay, implementationDuration);
    // If the delay duration has passed, update the policy value
    if (policyData && implementationDuration >= implementationDelay) {
        policyData.value = finalValue;
        console.log("updated", policyData);
        updatePolicyEffects(policyName);
    }

    policyData.implementationDuration++;
}

export function updatePolicyEffects(policyName) {
    const policyData = policy[policyName];

    if (!policyData) {
        throw new Error("Policy does not exist: " + policyName);
    }
    
    for (const effect in policyData.effects) {
        const policyEffectData = policyData.effects[effect];
        const { effectDelay, effectDuration, valueDelta } = policyEffectData;

        // If the change is not complete yet, update the effect value
        if (effectDuration <= effectDelay) {
            const effectData = status[effect] ?? crisis[effect];
            
            // console.log("update policy effect", effect, effectDelay, effectDuration, valueDelta, effectData);
            if (!effectData) {
                throw new Error("Effect does not exist in the status or crisis: " + effect);
            }

            effectData.value += valueDelta;
            effectData.policyValue += valueDelta;
            policyEffectData.value += valueDelta;
            console.log("updated", effectData);
            // effectData.lastUpdatePolicy += update;
        }
        policyEffectData.effectDuration++;
    }
}

export function setupPolicyMultiplier() {
    for (const policyName in policy) {
        const policyData = policy[policyName];

        policyData.minCost = policyData.minCost * policyMultiplier['cost'];
        policyData.maxCost = policyData.maxCost * policyMultiplier['cost'];

        policyData.minRevenue = policyData.minRevenue * policyMultiplier['revenue'];
        policyData.maxRevenue = policyData.maxRevenue * policyMultiplier['revenue'];

        policyData.implementationCost = policyData.implementationCost * policyMultiplier['cost'];

        policyData.implementationDelay = policyData.implementationDelay * policyMultiplier['implementationDelay'];

        for (const effectName in policyData.effects) {
            const effectData = policyData.effects[effectName];

            effectData.effectDelay = effectData.effectDelay * policyMultiplier['effectDelay'];
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
    const sliderFinal = getObjectbyId(runtime.objects.Slider, "policy_pop_up_final_slider");

    // console.log("setupPolicyPopUp", policyName, policyData, slider, sliderFinal);
    if (policyData.value != policyData.finalValue) {
        sliderFinal.isVisible = true;
        setSliderValue(sliderFinal, null, policyData.finalValue, null);
    } else {
        sliderFinal.isVisible = false;
    }

    const costText = getTextById("policy_pop_up_cost_slider");
    const cost = policyData.minCost + (policyData.value / 100 * (policyData.maxCost - policyData.minCost));
    setSliderValue(slider, costText, policyData.value, cost.toString());

    const revenueText = getTextById("policy_pop_up_revenue_slider");
    const revenue = policyData.minRevenue + (policyData.value / 100 * (policyData.maxRevenue - policyData.minRevenue));
    setSliderValue(slider, revenueText, policyData.value, revenue.toString());
}

export function createPolicyEffectViews(runtime) {
    const scrollableEffects = getObjectbyId(runtime.objects.ScrollablePanel, "pop_up_policy_effects");
    let initialY = scrollableEffects.y + 10;

    for (const policyName in policy) {
        let policyData = policy[policyName];

        for (const effect in policyData.effects) {
            let instanceY = initialY + Object.keys(policyData.effects).indexOf(effect) * 100;
            const instanceX = scrollableEffects.x + (scrollableEffects.width - 1042) / 2;

            const effectData = policyData.effects[effect];
            effectData.value = effectData.formula(policyData.value);
    
            const effectName = runtime.objects.UIText.createInstance("PolicyPopUpMG", instanceX, instanceY, true, "policy_effect_view");
            effectName.text = effectData.name + " (" + effectData.effectDelay + " Delay)";
            effectName.instVars['id'] = effect + "_" + policyName + "_effects_name";
            addTextToCache(effectName);
        
            const effectValue = effectName.getChildAt(0);
            effectValue.text = effectData.value.toFixed(2).toString();
        
            const effectSliderPositive = effectName.getChildAt(2);
            const effectSliderNegative = effectName.getChildAt(3);

            effectSliderPositive.isVisible = effectData.valueType === "positive";
            effectSliderNegative.isVisible = !effectSliderPositive.isVisible;

            // console.log("create type", policyName, effect);
            // console.log("create type", effectData.valueType, effectName.getChildAt(0), effectName.getChildAt(1), effectName.getChildAt(2), effectName.getChildAt(3));

            scrollableEffects.addChild(effectName, { transformX: true, transformY: true });
        }    
    }
}

export function showPolicyEffectViews(policyName, runtime) {
    const policyData = policy[policyName];

    hideOtherPolicyViews(policyName);

    for (const effect in policyData.effects) {
        const effectData = policyData.effects[effect];

        const effectName = getTextById(effect + "_" + policyName + "_effects_name");
        // console.log("text", effectName.instVars['id'], effectName.text, effectName.isVisible);
        effectName.isVisible = true;

        const effectValue = effectName.getChildAt(0);
        effectValue.text = effectData.value.toString();

        const effectSliderPositive = effectName.getChildAt(2);
        const effectSliderNegative = effectName.getChildAt(3);
        effectSliderPositive.isVisible = effectData.valueType === "positive";
        effectSliderNegative.isVisible = !effectSliderPositive.isVisible;

        const effectSlider = effectData.valueType === "negative" ? effectSliderNegative : effectSliderPositive;
        const effectSliderChange = effectSlider.getChildAt(0);

        const value = Math.abs(effectData.value)
        const newValue = Math.abs(effectData.formula(policyData.finalValue));
        const valueChange = newValue - value;
        
        effectSlider.width = value / 100 * effectSlider.instVars['maxWidth'];
        effectSliderChange.width = newValue / 100 * effectSliderChange.instVars['maxWidth'];
        
        setDeltaSliderZOrder(valueChange, effectSliderChange, effectSlider);
    }
    
    const scrollableEffects = getObjectbyId(runtime.objects.ScrollablePanel, "pop_up_policy_effects");
    resetScrollablePosition(scrollableEffects);
    setScrollableHeight(runtime, scrollableEffects, Object.keys(policyData.effects).length, 100, 0);
}

export function updatePolicyEffectViews(policyName, newPolicyValue) {
    const policyData = policy[policyName];

    for (const effect in policyData.effects) {
        // console.log("update", effect + "_" + policyName + "_effects_name", newPolicyValue)
        const effectData = policyData.effects[effect];
        
        const effectName = getTextById(effect + "_" + policyName + "_effects_name");
        const newValue = effectData.formula(newPolicyValue);

        const effectValue = effectName.getChildAt(0);
        effectValue.text = newValue.toFixed(2).toString();

        const effectSliderPositive = effectName.getChildAt(2);
        const effectSliderNegative = effectName.getChildAt(3);

        const effectSlider = effectData.valueType === "negative" ? effectSliderNegative : effectSliderPositive;
        const effectSliderChange = effectSlider.getChildAt(0);
        
        effectSliderChange.width = Math.abs(newValue) / 100 * effectSliderChange.instVars['maxWidth'];

        const valueChange = Math.abs(newValue) - Math.abs(effectData.value);
        setDeltaSliderZOrder(valueChange, effectSliderChange, effectSlider);
    }
}

/**
 * Hide all policy effect views except the one excluded
 * @param {string} excludedPolicyName Policy name to exclude
 */
export function hideOtherPolicyViews(excludedPolicyName) {
    for (const otherPolicyName in policy) {
        let otherPolicyData = policy[otherPolicyName];
        // console.log("other", otherPolicyName, policyName);

        if (otherPolicyName === excludedPolicyName) continue;

        for (const effect in otherPolicyData.effects) {
            // console.log("hide", effect + "_" + otherPolicyName + "_effects_name");
            const effectName = getTextById(effect + "_" + otherPolicyName + "_effects_name");
            effectName.isVisible = false;

            // console.log("children", effectName.getChildAt(0), effectName.getChildAt(1), effectName.getChildAt(2), effectName.getChildAt(3));
        }
    }
}
