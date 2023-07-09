import { removeIncomeFromPolicy, removeSpendingFromPolicy, updateIncomeFromPolicy, updateSpendingFromPolicy } from "./fiscal-data.js";
import { status } from "./status-data.js";
import { crisis } from "./crisis-data.js";
import { addTextToCache, clamp, getObjectbyId, getTextById, resetScrollablePosition, setDeltaSliderZOrder, setScrollableHeight, setSliderValue, toCurrencyFormat, toDeltaFormat } from "./utils.js";

export const policyMultiplier = {
    "cost": 0.5,
    "revenue": 0.5,
    "implementationDelay": 0.5,
    "effectDelay": 0.5,
};

/**
 * @typedef {{
*     effectDelay: number,
*     valueType: "positive" | "negative",
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
 *      isImplemented: boolean,
 *      type: "finance" | "health" | "education" | "social" | "environment" | "nature" | "infrastructure" | "industry" | "defense" | "stability" | "labor",
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
        name: "Income Tax", isImplemented: false,
        description: "A cut on personal income.",
        type: "finance", value: 30, finalValue: 30, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 250, maxRevenue: 4500,
        effects: {
            "taxes": {
                effectDelay: 5, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.2 * policyValue},
            },
            "wage_income": {
                effectDelay: 4, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue}
            }
        }
    },
    "corporation_tax": {
        name: "Corporation Tax", isImplemented: true,
        description: "A tax on corporate's revenue.",
        type: "finance", value: 23, finalValue: 23, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 200, maxRevenue: 3200,
        effects: {
            "taxes": {
                effectDelay: 5, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
            "investment": {
                effectDelay: 7, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.2 * policyValue},
            },
        }
    },
    "tobacco_tax": {
        name: "Tobacco Tax", isImplemented: false,
        description: "A tax on tobacco products such as cigarettes.",
        type: "finance", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 120, maxRevenue: 550,
        effects: {
            "taxes": {
                effectDelay: 5, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
            "public_health": {
                effectDelay: 6, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return -0.1 - 0.1 * policyValue},
            },
            "mental_health_crisis": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.15 * policyValue},
            }
        }
    },
    "alcohol_tax": {
        name: "Alcohol Tax", isImplemented: false,
        description: "A tax on alcohol products such as alcohol beverages.",
        type: "finance", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 120, maxRevenue: 480,
        effects: {
            "taxes": {
                effectDelay: 5, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
            "public_health": {
                effectDelay: 4, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.15 * policyValue},
            },
            "mental_health_crisis": {
                effectDelay: 8, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
            "crime_violence": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.1 * policyValue},
            },
        }
    },
    "fuel_tax": {
        name: "Fuel Tax", isImplemented: false,
        description: "Tax on vehicle fuels.",
        type: "finance", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 90, maxRevenue: 500,
        effects: {
            "taxes": {
                effectDelay: 5, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
            "pollution_control": {
                effectDelay: 8, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return -0.1 - 0.1 * policyValue},
            },
            "transportation": {
                effectDelay: 3, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue},
            },
        }
    },
    "property_tax": {
        name: "Property Tax", isImplemented: true,
        description: "Tax on property.",
        type: "finance", value: 32, finalValue: 32, valueDelta: 0,
        implementationCost: 0, implementationDelay: 4, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 123, maxRevenue: 468,
        effects: {
            "taxes": {
                effectDelay: 5, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
            "urban_housing": {
                effectDelay: 5, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return -0.2 - 0.1 * policyValue},
            },
        }
    },
    "vehicle_tax": {
        name: "Vehicle Tax", isImplemented: true,
        description: "Tax on vehicles.",
        type: "finance", value: 45, finalValue: 45, valueDelta: 0,
        implementationCost: 0, implementationDelay: 4, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 70, maxRevenue: 440,
        effects: {
            "taxes": {
                effectDelay: 5, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
            "pollution_control": {
                effectDelay: 4, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.2 * policyValue},
            },
        }
    },
    "value_added_tax": {
        name: "Value Added Tax", isImplemented: true,
        description: "Tax on value added to a product on every manufacturing steps.",
        type: "finance", value: 34, finalValue: 34, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 120, maxRevenue: 520,
        effects: {
            "taxes": {
                effectDelay: 5, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
            "investment": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.15 * policyValue},
            },
            "manufacturing": {
                effectDelay: 3, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return -0.1 - 0.15 * policyValue},
            },
        }
    },
    "customs_duty": {
        name: "Customs Duty", isImplemented: true,
        description: "Fee on imported goods.",
        type: "finance", value: 45, finalValue: 45, valueDelta: 0,
        implementationCost: 0, implementationDelay: 5, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 2, maxRevenue: 100,
        effects: {
            "taxes": {
                effectDelay: 5, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
            "investment": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue},
            },
            "economy": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "tax_amnesty": {
        name: "Tax Amnesty", isImplemented: false,
        description: "Tax amnesty for tax evaders.",
        type: "finance", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 143, maxCost: 650, minRevenue: 0, maxRevenue: 0,
        effects: {
            "taxes": {
                effectDelay: 5, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return -0.1 - 0.4 * policyValue},
            },
            "investment": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
        }
    },
    "debt_payment": {
        name: "Debt Payment", isImplemented: true,
        description: "Pay government borrowings.",
        type: "finance", value: 25, finalValue: 25, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 2, maxCost: 100, minRevenue: 0, maxRevenue: 0,
        effects: {
        }
    },

    // Health
    "mandatory_face_masks": {
        name: "Mandatory Face Masks", isImplemented: false,
        description: "Mandatory face masks in public places.",
        type: "health", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 4, implementationDuration: 0,
        minCost: 40, maxCost: 240, minRevenue: 0, maxRevenue: 0,
        effects: {
            "disease_control": {
                effectDelay: 10, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
        }
    },
    "lockdown": {
        name: "Lockdown & Quarantine", isImplemented: false,
        description: "Lockdown and quarantine measures.",
        type: "health", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 4, implementationDuration: 0,
        minCost: 100, maxCost: 450, minRevenue: 0, maxRevenue: 0,
        effects: {
            "disease_control": {
                effectDelay: 4, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.2 + 0.3 * policyValue},
            },
            "investment": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return -0.05 - 0.15 * policyValue},
            },
            "tourism_creative": {
                effectDelay: 3, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return -0.1 - 0.15 * policyValue},
            },
        }
    },
    "mandatory_vaccination": {
        name: "Mandatory Vaccination", isImplemented: false,
        description: "Mandatory vaccination of the population.",
        type: "health", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 1, implementationDuration: 0,
        minCost: 89, maxCost: 430, minRevenue: 0, maxRevenue: 0,
        effects: {
            "disease_control": {
                effectDelay: 5, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.2 + 0.25 * policyValue},
            },
        }
    },
    "travel_ban": {
        name: "Travel Ban", isImplemented: false,
        description: "Ban on international and domestic travel on land, sea, and air.",
        type: "health", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 76, maxCost: 340, minRevenue: 0, maxRevenue: 0,
        effects: {
            "disease_control": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.15 + 0.25 * policyValue},
            },
            "investment": {
                effectDelay: 4, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return -0.1 - 0.1 * policyValue},
            },
            "tourism_creative":{
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return -0.1 - 0.2 * policyValue},
            },
        }
    },
    "state_healthcare": {
        name: "State Healthcare", isImplemented: true,
        description: "Healthcare system run by the state to ensure accessible medical service for all citizen.",
        type: "health", value: 64, finalValue: 64, valueDelta: 0,
        implementationCost: 0, implementationDelay: 4, implementationDuration: 0,
        minCost: 230, maxCost: 760, minRevenue: 0, maxRevenue: 0,
        effects: {
            "healthcare_system": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.2 + 0.4 * policyValue},
            },
        }
    },
    "state_health_insurance": {
        name: "State Health Insurance", isImplemented: true,
        description: "Mandatory health insurance to minimize financial risk.",
        type: "health", value: 64, finalValue: 64, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "healthcare_system": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.25 * policyValue},
            },
        }
    },
    "food_drug_regulations": {
        name: "Food & Drug Regulations", isImplemented: false,
        description: "Strict food and drug regulation to ensure safety and quality standards.",
        type: "health", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 4, implementationDuration: 0,
        minCost: 120, maxCost: 460, minRevenue: 0, maxRevenue: 0,
        effects: {
            "public_health": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},                
            }
        }
    },
    "public_health_campaign": {
        name: "Public Health Campaign", isImplemented: false,
        description: "Promotion on public health awareness and preventive measures.",
        type: "health", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 90, maxCost: 500, minRevenue: 0, maxRevenue: 0,
        effects: {
            "public_health": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.2 * policyValue},
            }
        }
    },
    "blood_organ_donation": {
        name: "Blood & Organ Donation", isImplemented: false,
        description: "Promotion and service of voluntary blood and organ donation to save lives.",
        type: "health", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 60, maxCost: 250, minRevenue: 0, maxRevenue: 0,
        effects: {
            "public_health": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            }
        }
    },
    "school_meals": {
        name: "School Meals", isImplemented: false,
        description: "Nutritious and subsidized school meals to support children's health and well-being.",
        type: "health", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 4, implementationDuration: 0,
        minCost: 98, maxCost: 340, minRevenue: 0, maxRevenue: 0,
        effects: {
            "public_health": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.25 * policyValue},
            },
            "dropout_crisis": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.2 * policyValue},
            },
        }
    },
    "mandatory_immunization": {
        name: "Mandatory Immunization", isImplemented: false,
        description: "Mandatory and subsidized immunization to prevent diseases.",
        type: "health", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 100, maxCost: 300, minRevenue: 0, maxRevenue: 0,
        effects: {
            "public_health": {
                effectDelay: 4, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.3 * policyValue},
            },
        }
    },
    "health_college": {
        name: "Health College", isImplemented: false,   
        description: "Colleges to train health professionals.",
        type: "health", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 6, implementationDuration: 0,
        minCost: 130, maxCost: 378, minRevenue: 0, maxRevenue: 0,
        effects: {
            "health_workers": {
                effectDelay: 5, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.15 + 0.3 * policyValue},
            },
        }
    },
    "health_worker_volunteers": {
        name: "Health Worker Volunteers", isImplemented: false,
        description: "Recruit health students and civilians to help health professionals.",
        type: "health", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 90, maxCost: 250, minRevenue: 0, maxRevenue: 0,
        effects: {
            "health_workers": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.2 * policyValue},
            },
        }
    },
    "healthcare_privatization": {
        name: "Healthcare Privatization", isImplemented: false,
        description: "Privatize healthcare to increase investment on health services.",
        type: "health", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 4, implementationDuration: 0,
        minCost: 80, maxCost: 240, minRevenue: 0, maxRevenue: 0,
        effects: {
            "healthcare_system": {
                effectDelay: 3, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.2 * policyValue},
            },
            "investment": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.05 + 0.2 * policyValue},
            }
        }
    },    

    // Education
    "scholarships": {
        name: "Scholarships", isImplemented: false,
        description: "Scholarships to provide financial support and opportunities for education.",
        type: "education", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 145, maxCost: 340, minRevenue: 0, maxRevenue: 0,
        effects: {
            "dropout_crisis": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.2 * policyValue},
            }
        }
    },
    "state_schools": {
        name: "State Schools", isImplemented: false,
        description: "State schools offer affordable and equal education.",
        type: "education", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 165, maxCost: 450, minRevenue: 0, maxRevenue: 0,
        effects: {
            "education_system": {
                effectDelay: 4, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.4 * policyValue},
            },
        }
    },
    "standardized_testing": {
        name: "Standardized Testing", isImplemented: false,
        description: "Standardized measure of student performance allowing fair evaluation and comparison.",
        type: "education", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 60, maxCost: 200, minRevenue: 0, maxRevenue: 0,
        effects: {
            "education_system": {
                effectDelay: 4, effectDuration: 0,
                valueType: "postive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.2 * policyValue},
            }
        }
    },
    "vocational_education": {
        name: "Vocational Education", isImplemented: false,
        description: "Education to prepare workforce readiness and practical skills.",
        type: "education", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 50, maxCost: 180, minRevenue: 0, maxRevenue: 0,
        effects: {
            "education_system": {
                effectDelay: 4, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
            "productive_workers": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.25 * policyValue},
            },
        }
    },
    "curriculum_development": {
        name: "Curriculum Development", isImplemented: false,
        description: "Curriculum development fostering critical thinking and interdisciplinary learning.",
        type: "education", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 4, implementationDuration: 0,
        minCost: 35, maxCost: 145, minRevenue: 0, maxRevenue: 0,
        effects: {
            "education_system": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.05 + 0.2 * policyValue},
            },
        }
    },
    "teacher_education": {
        name: "Teacher Education", isImplemented: false,
        description: "Teacher education to ensure high-quality teaching.",
        type: "education", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 40, maxCost: 110, minRevenue: 0, maxRevenue: 0,
        effects: {
            "teachers": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.25 * policyValue},
            },
        }
    },
    "teacher_assessment": {
        name: "Teacher Assessment", isImplemented: false,
        description: "Measure teaching effectiveness and improve instructional practices.",
        type: "education", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 30, maxCost: 100, minRevenue: 0, maxRevenue: 0,
        effects: {
            "teachers": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            }
        }
    },
    "research_grants": {
        name: "Research Grants", isImplemented: false,
        description: "Research grants to support innovation and advancements.",
        type: "education", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 80, maxCost: 280, minRevenue: 0, maxRevenue: 0,
        effects: {
            "research": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.4 * policyValue},
            }
        }
    },
    "university_grants": {
        name: "University Grants", isImplemented: false,
        description: "University grants to support academic institutions.",
        type: "education", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 100, maxCost: 400, minRevenue: 0, maxRevenue: 0,
        effects: {
            "research": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positve", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.05 + 0.25 * policyValue},
            },
            "education_system": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.05 + 0.15 * policyValue},
            },
            "productive_workers": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.15 * policyValue},
            },
        }
    },
    "technology_colleges": {
        name: "Technology Colleges", isImplemented: false,
        description: "Technology colleges  to provide specialized education in technological fields.",
        type: "education", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 50, maxCost: 250, minRevenue: 0, maxRevenue: 0,
        effects: {
            "education_system": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
            "research": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.15 * policyValue},
            },
            "productive_workers": {
                effectDelay: 4, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },

    // Social
    "child_benefit": {
        name: "Child Benefit", isImplemented: false,
        description: "Benefits for children to provide financial assistance to families.",
        type: "social", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 120, maxCost: 430, minRevenue: 0, maxRevenue: 0,
        effects: {
            "social_security": {
                effectDelay: 4, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.3 * policyValue},
            },
            "population_control": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.15 * policyValue},
            },
        }
    },
    "disablity_benefit": {
        name: "Disability Benefit", isImplemented: false,
        description: "Benefits for disabled people to provide financial assistances to disabled people.",
        type: "social", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 30, maxCost: 140, minRevenue: 0, maxRevenue: 0,
        effects: {
            "social_security": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
            "discrimination": {
                effectDelay: 3, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.2 * policyValue},
            },
        }
    },
    "elderly_benefit": {
        name: "Elderly Benefit", isImplemented: false,
        description: "Benefits for elderly people to provide financial support for senior citizens.",
        type: "social", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 80, maxCost: 190, minRevenue: 0, maxRevenue: 0,
        effects: {
            "social_security": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.15 * policyValue},
            },
            "empowerment": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.3 * policyValue},
            },
        }
    },
    "unemployment_benefit": {
        name: "Unemployment Benefit", isImplemented: false,
        description: "Benefits for unemployed people to provide financial assistance.",
        type: "social", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 3, maxCost: 120, minRevenue: 0, maxRevenue: 0,
        effects: {
            "social_security": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.15 * policyValue},
            },
            "unemployment": {
                effectDelay: 4, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
        }
    },
    "family_planning": {
        name: "Family Planning", isImplemented: false,
        description: "Education and support for families about family size.",
        type: "social", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 5, implementationDuration: 0,
        minCost: 30, maxCost: 120, minRevenue: 0, maxRevenue: 0,
        effects: {
            "population_control": {
                effectDelay: 4, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.3 * policyValue},
            },
        }
    },
    "workplace_inclusion": {
        name: "Workplace Inclusion", isImplemented: false,
        description: "Promote equal oppurtunities and treatement on work places.",
        type: "social", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 32, maxCost: 120, minRevenue: 0, maxRevenue: 0,
        effects: {
            "empowerment": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.2 * policyValue},
            },
            "work_environment": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.25 * policyValue},
            },
        }
    },

    // Environment
    "carbon_tax": {
        name: "Carbon Tax", isImplemented: false,
        description: "Tax on carbon emissions.",
        type: "environment", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 4, implementationDuration: 0,
        minCost: 30, maxCost: 80, minRevenue: 50, maxRevenue: 140,
        effects: {
            "taxes": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
            "pollution_control": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.35 * policyValue},
            },
        }
    },
    "recycling_plant": {
        name: "Recycling Plant", isImplemented: false,
        description: "Mandate proper waste management and recycling practices.",
        type: "environment", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 30, maxCost: 90, minRevenue: 0, maxRevenue: 0,
        effects: {
            "pollution_control": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "reforestation": {
        name: "Reforestation", isImplemented: false,
        description: "Reforestation initiatives to restore and expand forest areas.",
        type: "environment", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 20, maxCost: 89, minRevenue: 0, maxRevenue: 0,
        effects: {
            "forest": {
                effectDelay: 5, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.25 * policyValue},
            },
        }
    },
    "ocean_cleanup": {
        name: "Ocean Cleanup", isImplemented: false,
        description: "Ocean cleanup initiatives to preserve ocean and marine life.",
        type: "environment", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 24, maxCost: 98, minRevenue: 0, maxRevenue: 0,
        effects: {
            "marine": {
                effectDelay: 6, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.25 * policyValue},
            },
        }
    },
    "protected_forest": {
        name: "Protected Forest", isImplemented: false,
        description: "Ensure preservation and conservartion of forest areas.",
        type: "environment", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 32, maxCost: 106, minRevenue: 0, maxRevenue: 0,
        effects: {
            "forest": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.05 + 0.15 * policyValue},
            },
            "biodiversity": {
                effectDelay: 4, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.05 + 0.2 * policyValue},
            },
        }
    },
    "national_park": {
        name: "National Park", isImplemented: false,
        description: "Establish national parks for conservation on biomes.",
        type: "environment", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 4, implementationDuration: 0,
        minCost: 40, maxCost: 120, minRevenue: 0, maxRevenue: 0,
        effects: {
            "biodiversity": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.05 + 0.3 * policyValue},
            },
            "tourism_creative": {
                effectDelay: 4, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.05 + 0.2 * policyValue},
            },
        }
    },
    "conservation_effort": {
        name: "Conservation Effort", isImplemented: false,
        description: "Efforts to protect and manage biodiversities.",
        type: "environment", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 5, implementationDuration: 0,
        minCost: 50, maxCost: 180, minRevenue: 0, maxRevenue: 0,
        effects: {
            "biodiversity": {
                effectDelay: 5, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.05 + 0.35 * policyValue},
            },
        }
    },

    // Nature
    "desalination_plant": {
        name: "Desalination Plant", isImplemented: false,
        description: "Desalination plant construction to ptovide freshwater from seawater.",
        type: "nature", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 5, implementationDuration: 0,
        minCost: 34, maxCost: 178, minRevenue: 0, maxRevenue: 0,
        effects: {
            "water_land": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.15 * policyValue},
            },
            "water_scarcity": {
                effectDelay: 4, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.25 * policyValue},
            },
        }
    },
    "state_water_company": {
        name: "State Water Company", isImplemented: true,
        description: "Establish state water company to ensure reliable water supply.",
        type: "nature", value: 65, finalValue: 65, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 10, maxCost: 75, minRevenue: 0, maxRevenue: 0,
        effects: {
            "water_land": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.25 * policyValue},
            },
        }
    },
    "food_import": {
        name: "Food Import", isImplemented: false,
        description: "Food import to handle food insecurity.",
        type: "nature", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 34, maxCost: 130, minRevenue: 0, maxRevenue: 0,
        effects: {
            "food_sources": {
                effectDelay: 4, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.4 * policyValue},
            },
            "agriculture" : {
                effectDelay: 3, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.05 - 0.2 * policyValue},
            },
        }
    },
    "land_reclamation": {
        name: "Land Reclamation", isImplemented: false,
        description: "Repurpose degraded lands and sea to restore productive lands.",
        type: "nature", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 4, implementationDuration: 0,
        minCost: 12, maxCost: 87, minRevenue: 0, maxRevenue: 0,
        effects: {
            "water_land": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
            "marine": {
                effectDelay: 3, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return -0.05 - 0.15 * policyValue},
            }
        }
    },
    "oil_exploration": {
        name: "Oil Exploration", isImplemented: false,
        description: "Explore new oil sources.",
        type: "nature", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 14, maxCost: 62, minRevenue: 0, maxRevenue: 0,
        effects: {
            "mineral_oil": {
                effectDelay: 5, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.05 + 0.35 * policyValue},
            },
            "water_land": {
                effectDelay: 4, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return -0.05 - 0.15 * policyValue},
            },
            "pollution_control": {
                effectDelay: 3, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return -0.05 - 0.1 * policyValue},
            },
        }
    },

    // Infrastructure
    "road_construction": {
        name: "Road Construction", isImplemented: true,
        description: "Construct national highway and regional roads.",
        type: "infrastructure", value: 20, finalValue: 20, valueDelta: 0,
        implementationCost: 0, implementationDelay: 4, implementationDuration: 0,
        minCost: 34, maxCost: 140, minRevenue: 0, maxRevenue: 0,
        effects: {
            "transportation": {
                effectDelay: 4, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.3 * policyValue},
            },
            "forest": {
                effectDelay: 3, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return -0.05 - 0.1 * policyValue},
            }
        }
    },
    "rail_construction": {
        name: "Rail Construction", isImplemented: true,
        description: "Construct railway and train service.",
        type: "infrastructure", value: 18, finalValue: 18, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 43, maxCost: 134, minRevenue: 0, maxRevenue: 0,
        effects: {
            "transportation": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.25 * policyValue}, 
            },
        }
    },
    "airport_construction": {
        name: "Airport Construction", isImplemented: false,
        description: "Construct airport and airline services.",
        type: "infrastructure", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 34, maxCost: 154, minRevenue: 0, maxRevenue: 0,
        effects: {
            "transportation": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
        }
    },
    "telecom_construction": {
        name: "Telecom Construction", isImplemented: true,
        description: "Construct communication network and services.",
        type: "infrastructure", value: 14, finalValue: 14, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 23, maxCost: 123, minRevenue: 0, maxRevenue: 0,
        effects: {
            "communication_information": {
                effectDelay: 4, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.4 * policyValue},
            },
        }
    },
    "sattelite_development": {
        name: "Sattelite Development", isImplemented: false,
        description: "Develop national sattelite for communication and information network.",
        type: "infrastructure", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 4, implementationDuration: 0,
        minCost: 54, maxCost: 178, minRevenue: 0, maxRevenue: 0,
        effects: {
            "communication_information": {
                effectDelay: 4, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.3 * policyValue},
            },
        }
    },
    "car_subsidies": {
        name: "Car Subsidies", isImplemented: false,
        description: "Car subsidies to incentivize the adoption of low-cost cars.",
        type: "infrastructure", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 45, maxCost: 187, minRevenue: 0, maxRevenue: 0,
        effects: {
            "transportation": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.05 + 0.15 * policyValue},
            },
            "pollution_control": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return -0.05 - 0.1 * policyValue},
            },
        }
    },
    "public_transport": {
        name: "Public Transport", isImplemented: false,
        description: "Public transport investment to provide reliable services.",
        type: "infrastructure", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 4, implementationDuration: 0,
        minCost: 56, maxCost: 189, minRevenue: 0, maxRevenue: 0,
        effects: {
            "transportation": {
                effectDelay: 5, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.3 * policyValue},
            },
        }
    },
    "coal_plant": {
        name: "Coal Plant", isImplemented: true,
        description: "Construct coal power plants.",
        type: "infrastructure", value: 45, finalValue: 45, valueDelta: 0,
        implementationCost: 100, implementationDelay: 3, implementationDuration: 0,
        minCost: 60, maxCost: 130, minRevenue: 0, maxRevenue: 0,
        effects: {
            "pollution_control": {
                effectDelay: 4, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return -0.1 - 0.2 * policyValue},
            },
            "power_energy": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.25 * policyValue},
            },
            "sustainability": {
                effectDelay: 4, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return -0.1 - 0.1 * policyValue},
            }
        }
    },
    "nuclear_plant": {
        name: "Nuclear Plant", isImplemented: false,
        description: "Construct nuclear power plants.",
        type: "infrastructure", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 5, implementationDuration: 0,
        minCost: 120, maxCost: 240, minRevenue: 0, maxRevenue: 0,
        effects: {
            "power_energy": {
                effectDelay: 5, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.2 + 0.3 * policyValue},
            },
        }
    },
    "state_housing": {
        name: "State Housing", isImplemented: true,
        description: "State housing to provide affordable and accessible housing.",
        type: "infrastructure", value: 56, finalValue: 56, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 34, maxCost: 170, minRevenue: 0, maxRevenue: 0,
        effects: {
            "urban_housing": {
                effectDelay: 4, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.2 * policyValue},
            },
        }
    },
    "building_codes": {
        name: "Building Codes", isImplemented: false,
        description: "Building codes to ensure safety and standards.",
        type: "infrastructure", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 50, maxCost: 180, minRevenue: 0, maxRevenue: 0,
        effects: {
            "urban_housing": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.05 + 0.1 * policyValue},
            },
        }
    },
    "city_planning_regulations": {
        name: "City Planning Regulations", isImplemented: true,
        description: "City planning regulations to guide urban development.",
        type: "infrastructure", value: 45, finalValue: 45, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 23, maxCost: 120, minRevenue: 0, maxRevenue: 0,
        effects: {
            "urban_housing": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.05 + 0.15 * policyValue},
            },
        }
    },
    
    // Labor
    "maternity_leave": {
        name: "Maternity Leave", isImplemented: false,
        description: "Paid maternity leave for new mothers.",
        type: "labor", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 21, maxCost: 87, minRevenue: 0, maxRevenue: 0,
        effects: {
            "work_environment": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
        }
    },
    "paternity_leave": {
        name: "Paternity Leave", isImplemented: false,
        description: "Paid paternity leave for new fathers.",
        type: "labor", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 21, maxCost: 87, minRevenue: 0, maxRevenue: 0,
        effects: {
            "work_environment": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
        }
    },
    "work_safety": {
        name: "Work Safety", isImplemented: true,
        description: "Work safety regulations maintain safe and healthy work environment.",
        type: "labor", value: 20, finalValue: 20, valueDelta: 0,
        implementationCost: 0, implementationDelay: 4, implementationDuration: 0,
        minCost: 31, maxCost: 98, minRevenue: 0, maxRevenue: 0,
        effects: {
            "work_environment": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "minimum_wage": {
        name: "Minimum Wage", isImplemented: true,
        description: "Set a minimum wage to establish a baseline income level.",
        type: "labor", value: 32, finalValue: 32, valueDelta: 0,
        implementationCost: 0, implementationDelay: 4, implementationDuration: 0,
        minCost: 43, maxCost: 145, minRevenue: 0, maxRevenue: 0,
        effects: {
            "wage_income": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.3 * policyValue},
            },
            "jobs": {
                effectDelay: 3, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.2 * policyValue},
            },
        }
    },
    "labor_union": {
        name: "Labor Union", isImplemented: false,
        description: "Labor unions to protect workers' rights.",
        type: "labor", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 23, maxCost: 99, minRevenue: 0, maxRevenue: 0,
        effects: {
            "work_environment": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.15 * policyValue},
            },
            "jobs": {
                effectDelay: 3, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue},
            },
        }
    },

    // Defense
    "diplomatic_service": {
        name: "Diplomatic Service", isImplemented: true,
        description: "Diplomatic service for effective international relations.",
        type: "defense", value: 43, finalValue: 43, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 12, maxCost: 90, minRevenue: 0, maxRevenue: 0,
        effects: {
            "foreign_relations": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.4 * policyValue},
            },
        }
    },
    "foreign_aid": {
        name: "Foreign Aid", isImplemented: false,
        description: "Foreign aid to support development and foster international solidarity.",
        type: "defense", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 14, maxCost: 89, minRevenue: 0, maxRevenue: 0,
        effects: {
            "foreign_relations": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.05 + 0.2 * policyValue},
            },
        }
    },
    "military_training": {
        name: "Military Training", isImplemented: true,
        description: "Military training to enhance defense capabilities.",
        type: "defense", value: 20, finalValue: 20, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 240, maxCost: 650, minRevenue: 0, maxRevenue: 0,
        effects: {
            "defense_force": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.2 + 0.6 * policyValue},
            },
        }
    },
    "intelligence_agency": {
        name: "Intelligence Agency", isImplemented: false,
        description: "Intelligence agency for effective national security measures.",
        type: "defense", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 12, maxCost: 67, minRevenue: 0, maxRevenue: 0,
        effects: {
            "defense_infrastructure": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
        }
    },
    "border_control": {
        name: "Border Control", isImplemented: true,
        description: "Border control measures to ensure national security.",
        type: "defense", value: 34, finalValue: 34, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 18, maxCost: 76, minRevenue: 0, maxRevenue: 0,
        effects: {
            "defense_infrastructure": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "nuclear_weapons": {
        name: "Nuclear Weapons", isImplemented: false,
        description: "Nuclear weapons.",
        type: "defense", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 5, implementationDuration: 0,
        minCost: 123, maxCost: 450, minRevenue: 0, maxRevenue: 0,
        effects: {
            "defense_infrastructure": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.2 + 0.3 * policyValue},
            },
            "foreign_relations": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return -0.1 - 0.25 * policyValue},
            },
        }
    },
    "arm_imports": {
        name: "Arm Imports", isImplemented: false,
        description: "Regulate arms import to maintain national security.",
        type: "defense", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 4, implementationDuration: 0,
        minCost: 120, maxCost: 560, minRevenue: 0, maxRevenue: 0,
        effects: {
            "defense_infrastructure": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.3 * policyValue},
            },
        }
    },

    // Stability
    "legal_aid": {
        name: "Legal Aid", isImplemented: true,
        description: "Provide legal aid services to ensure equal access to justice.",
        type: "stability", value: 32, finalValue: 32, valueDelta: 0,
        implementationCost: 0, implementationDelay: 4, implementationDuration: 0,
        minCost: 12, maxCost: 76, minRevenue: 0, maxRevenue: 0,
        effects: {
            "justice_system": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.25 * policyValue},
            },
        }
    },
    "death_penalty": {
        name: "Death Penalty", isImplemented: false,
        description: "Enforce death penalty for extreme crimes.",
        type: "stability", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 13, maxCost: 87, minRevenue: 0, maxRevenue: 0,
        effects: {
            "justice_system": {
                effectDelay: 2, effectDuration: 0,
                valueType: "postive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.35 * policyValue},
            },
            "governance": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return -0.1 - 0.25 * policyValue},
            },
        }
    },
    "anti_corruption_agency": {
        name: "Anti-Corruption Agency", isImplemented: true,
        description: "Anti-corruption agency to prevent, investigate, and prosecute corruption.",
        type: "stability", value: 18, finalValue: 18, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 14, maxCost: 98, minRevenue: 0, maxRevenue: 0,
        effects: {
            "governance": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.25 * policyValue},
            },
        }
    },
    "internet_censorship": {
        name: "Internet Censorship", isImplemented: false,
        description: "Internet censorship to prevent hoaxes and misinformation spread.",
        type: "stability", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 14, maxCost: 80, minRevenue: 0, maxRevenue: 0,
        effects: {
            "media_neutrality": {
                effectDelay:3, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 - 0.2 * policyValue},
            },
            "misinformation_spread": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return -0.1 - 0.2 * policyValue},
            },
            "political_instability": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return -0.05 - 0.1 * policyValue},
            },
        }
    },
    "police_force": {
        name: "Police Force", isImplemented: true,
        description: "Police force to ensure public safety.",
        type: "stability", value: 56, finalValue: 56, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 21, maxCost: 98, minRevenue: 0, maxRevenue: 0,
        effects: {
            "security": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.4 * policyValue},
            },
        }
    },
    "press_freedom": {
        name: "Press Freedom", isImplemented: false,
        description: "Protect and promote press freedom.",
        type: "stability", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 12, maxCost: 68, minRevenue: 0, maxRevenue: 0,
        effects: {
            "media_neutrality": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.2 * policyValue},
            },
        }
    },

    // Industry
    "mining_subsidies": {
        name: "Mining Subsidies", isImplemented: false,
        description: "Mining subsidies to increase mining industries.",
        type: "industry", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 14, maxCost: 78, minRevenue: 0, maxRevenue: 0,
        effects: {
            "mineral_oil_industry": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.05 + 0.25 * policyValue},
            },
        }
    },
    "agricultural_subsidies": {
        name: "Agricultural Subsidies", isImplemented: false,
        description: "Agricultural subsidies to increase agriculture industries.",
        type: "industry", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 12, maxCost: 80, minRevenue: 0, maxRevenue: 0,
        effects: {
            "agriculture": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.3 * policyValue},
            },
        }
    },
    "fisheries_subsidies": {
        name: "Fisheries Subsidies", isImplemented: false,
        description: "Fisheries subsidies to increase fishery industries.",
        type: "industry", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 12, maxCost: 80, minRevenue: 0, maxRevenue: 0,
        effects: {
            "fisheries": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.3 * policyValue},
            },
        }
    },
    "intellectual_rights": {
        name: "Intellectual Rights", isImplemented: false,
        description: "Intellectual property rights to promote innovation in industries.",
        type: "industry", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 12, maxCost: 68, minRevenue: 0, maxRevenue: 0,
        effects: {
            "manufacturing": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.2 * policyValue},
            },
            "tourism_creative": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.25 * policyValue},
            },
        }
    },
    "tourism_campaign": {
        name: "Tourism Campaign", isImplemented: false,
        description: "Tourism campaign to boost visits.",
        type: "industry", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 4, implementationDuration: 0,
        minCost: 15, maxCost: 67, minRevenue: 0, maxRevenue: 0,
        effects: {
            "tourism_creative": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.2 * policyValue},
            },
        }
    },
    "international_connections": {
        name: "International Connections", isImplemented: true,
        description: "Allows international visits and connections.",
        type: "industry", value: 67, finalValue: 67, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 24, maxCost: 98, minRevenue: 0, maxRevenue: 0,
        effects: {
            "economy": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.2 * policyValue},
            },
            "tourism_creative": {
                effectDelay: 4, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.05 + 0.2 * policyValue},
            },
            "security": {
                effectDelay: 4, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return -0.05 - 0.15 * policyValue},
            },
            "transportation": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.15 * policyValue},
            },
        }
    },
    "sustainable_harvesting": {
        name: "Sustainable Harvesting", isImplemented: false,
        description: "Sustainable harvesting practices to ensure long-term viability of resources.",
        type: "industry", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 23, maxCost: 97, minRevenue: 0, maxRevenue: 0,
        effects: {
            "sustainability": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.1 + 0.4 * policyValue},
            },
            "mineral_oil_industry": {
                effectDelay: 3, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return -0.1 - 0.2 * policyValue},
            },
            "agriculture": {
                effectDelay: 3, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return -0.1 - 0.2 * policyValue},
            },
            "fisheries": {
                effectDelay: 3, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return -0.05 - 0.15 * policyValue},
            },
        }
    },
    "green_energy": {
        name: "Green Energy", isImplemented: false,
        description: "Promote green energy sources adoption.",
        type: "industry", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 4, implementationDuration: 0,
        minCost: 14, maxCost: 87, minRevenue: 0, maxRevenue: 0,
        effects: {
            "power_energy": {
                effectDelay: 4, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return -0.05 - 0.2 * policyValue},
            },
            "sustainability": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.05 + 0.2 * policyValue},
            },
        }
    },
    "small_business_grants": {
        name: "Small Business Grants", isImplemented: false,
        description: "Grants for small businesses.",
        type: "industry", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 14, maxCost: 76, minRevenue: 0, maxRevenue: 0,
        effects: {
            "economy": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
           "jobs": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.05 + 0.25 * policyValue},
            }, 
        }
    },
    "international_trade": {
        name: "International Trade", isImplemented: true,
        description: "Trade agreements with other countries.",
        type: "industry", value: 65, finalValue: 65, valueDelta: 0,
        implementationCost: 0, implementationDelay: 3, implementationDuration: 0,
        minCost: 14, maxCost: 67, minRevenue: 0, maxRevenue: 0,
        effects: {
            "economy": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.05 + 0.2 * policyValue},
            },
            "foreign_relations": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.15 * policyValue},
            },
        }
    },
    "entrepreneur_support": {
        name: "Entrepreneur Support", isImplemented: false,
        description: "Support for new entrepreneurs to create new jobs and economy.",
        type: "industry", value: 0, finalValue: 0, valueDelta: 0,
        implementationCost: 0, implementationDelay: 2, implementationDuration: 0,
        minCost: 16, maxCost: 62, minRevenue: 0, maxRevenue: 0,
        effects: {
            "economy": {
                effectDelay: 3, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.25 * policyValue},
            },
            "jobs": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0.05 + 0.15 * policyValue},
            },
        }
    },
}

export function initializePolicy(policies) {
    for (const policyName in policies) {
        const policyData = policy[policyName];
        const policyLevelData  = policies[policyName];

        policyData.value = policyLevelData.value;
        policyData.finalValue = policyLevelData.value;
        policyData.isImplemented = policyLevelData.isImplemented;
    }
}

export function applyPolicyChange(policyName, newValue) {
    console.log("Applying policy change: " + policyName + " to " + newValue);
    let policyData = policy[policyName];
    if (policyData) {
        policyData.finalValue = clamp(newValue, 0, 100);
        let { finalValue } = policyData;

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
    let { finalValue, implementationDelay, implementationDuration } = policyData;
    
    // If the delay duration has passed, update the policy value
    if (implementationDuration >= implementationDelay) {
        policyData.value = finalValue;
        updatePolicyEffects(policyName);
    }

    policyData.implementationDuration++;
}

export function updatePolicyEffects(policyName) {
    const policyData = policy[policyName];

    if (!policyData) {
        throw new Error("Policy does not exist: " + policyName);
    }

    if (!policyData.isImplemented) {
        return;
    }
    
    for (const effect in policyData.effects) {
        const policyEffectData = policyData.effects[effect];
        const { effectDelay, effectDuration, valueDelta } = policyEffectData;

        // If the change is not complete yet, update the effect value
        if (effectDuration <= effectDelay) {
            const effectData = status[effect] ?? crisis[effect];
            
            if (!effectData) {
                throw new Error("Effect does not exist in the status or crisis: " + effect);
            }

            effectData.value += valueDelta;
            effectData.policyValue += valueDelta;
            policyEffectData.value += valueDelta;
            // console.log("updated", effectData);
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
    const policyImplementationDelatText = getTextById("policy_pop_up_implementation_delay");
    policyImplementationDelatText.text = "Implementation Delay: " + policyData.implementationDelay ?? 0;

    const slider = runtime.objects.Slider.getPickedInstances()[0];
    const sliderFinal = getObjectbyId(runtime.objects.Slider, "policy_pop_up_final_slider");

    // console.log("setupPolicyPopUp", policyName, policyData, slider, sliderFinal);
    if (policyData.value != policyData.finalValue) {
        sliderFinal.isVisible = true;
        setSliderValue(sliderFinal, null, policyData.finalValue, null);
    } else {
        sliderFinal.isVisible = false;
    }

    slider.instVars['isDraggable'] = policyData.isImplemented;
    slider.behaviors.DragDrop.isEnabled = policyData.isImplemented;

    const costText = getTextById("policy_pop_up_cost_slider");
    const cost = policyData.minCost + (policyData.value / 100 * (policyData.maxCost - policyData.minCost));
    setSliderValue(slider, costText, policyData.value, toCurrencyFormat(cost));

    const revenueText = getTextById("policy_pop_up_revenue_slider");
    const revenue = policyData.minRevenue + (policyData.value / 100 * (policyData.maxRevenue - policyData.minRevenue));
    setSliderValue(slider, revenueText, policyData.value, toCurrencyFormat(revenue));

    const stateText = getTextById("policy_pop_up_state");
    stateText.text = policyData.isImplemented ? "Active" : "Inactive";

    const activateButton = getObjectbyId(runtime.objects.Button, "policy_pop_up_activate");
    activateButton.animationFrame = policyData.isImplemented ? 3 : 2;

    const applyButton = getObjectbyId(runtime.objects.Button, "policy_pop_up_apply");
    applyButton.instVars['isDisabled'] = !policyData.isImplemented;

    const sliderBG = getObjectbyId(runtime.objects.SliderBarBG2, "policy_pop_up");
    sliderBG.effects[0].isActive = !policyData.isImplemented;
}

export function togglePolicyActive(policyName, runtime) {
    const policyData = policy[policyName];
    policyData.isImplemented = !policyData.isImplemented;

    const stateText = getTextById("policy_pop_up_state");
    stateText.text = policyData.isImplemented ? "Active" : "Inactive";

    const activateButton = getObjectbyId(runtime.objects.Button, "policy_pop_up_activate");
    activateButton.animationFrame = policyData.isImplemented ? 3 : 2;

    const applyButton = getObjectbyId(runtime.objects.Button, "policy_pop_up_apply");
    applyButton.instVars['isDisabled'] = !policyData.isImplemented;
    console.log("toggle ", policyData.value == policyData.finalValue || !policyData.isImplemented, policyData.isImplemented);

    const sliderBG = getObjectbyId(runtime.objects.SliderBarBG2, "policy_pop_up");
    sliderBG.effects[0].isActive = !policyData.isImplemented;

    const slider = getObjectbyId(runtime.objects.Slider, "policy_pop_up_slider");
    slider.instVars['isDraggable'] = policyData.isImplemented;
    slider.behaviors.DragDrop.isEnabled = policyData.isImplemented;

    if (policyData.isImplemented) {
        updateIncomeFromPolicy(policyName);
        updateSpendingFromPolicy(policyName);
    } else {
        removeIncomeFromPolicy(policyName);
        removeSpendingFromPolicy(policyName);
    }
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
            console.log("create effect", policyName, effect, effectData);
            const effectVariableData = status[effect] ?? crisis[effect];
    
            const effectName = runtime.objects.UIText.createInstance("PolicyPopUpMG", instanceX, instanceY, true, "policy_effect_view");
            effectName.text = effectVariableData.name + " (" + Math.ceil(effectData.effectDelay) + " Delay)";
            effectName.instVars['id'] = effect + "_" + policyName + "_effects_name";
            addTextToCache(effectName);
        
            const effectValue = effectName.getChildAt(0);
            effectValue.text = toDeltaFormat(effectData.value);
        
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
        effectValue.text = toDeltaFormat(effectData.value);

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

export function updatePolicyFiscalView(policyName, slider) {
    const policyData = policy[policyName];

    const costText = getTextById("policy_pop_up_cost_slider");
    const cost = policyData.minCost + (slider.instVars['value'] / 100 * (policyData.maxCost - policyData.minCost));
    setSliderValue(slider, costText, slider.instVars['value'], toCurrencyFormat(cost));

    const revenueText = getTextById("policy_pop_up_revenue_slider");
    const revenue = policyData.minRevenue + (slider.instVars['value'] / 100 * (policyData.maxRevenue - policyData.minRevenue));
    setSliderValue(slider, revenueText, slider.instVars['value'], toCurrencyFormat(revenue));
}

export function updatePolicyEffectViews(policyName, newPolicyValue) {
    const policyData = policy[policyName];

    for (const effect in policyData.effects) {
        // console.log("update", effect + "_" + policyName + "_effects_name", newPolicyValue)
        const effectData = policyData.effects[effect];
        
        const effectName = getTextById(effect + "_" + policyName + "_effects_name");
        const newValue = effectData.formula(newPolicyValue);

        const effectValue = effectName.getChildAt(0);
        effectValue.text = toDeltaFormat(newValue);

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
