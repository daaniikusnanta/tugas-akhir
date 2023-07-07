import { removeIncomeFromPolicy, removeSpendingFromPolicy, updateIncomeFromPolicy, updateSpendingFromPolicy } from "./fiscal-data.js";
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
 *      isImplemented: boolean,
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
        name: "Income Tax", isImplemented: true,
        description: "A cut on personal income.",
        type: "finance", value: 10, finalValue: 10, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 2, maxRevenue: 100,
        effects: {
            "taxes": {
                effectDelay: 5, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
            "wage_income": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue}
            }
        }
    },
    "corporation_tax": {
        name: "Corporation Tax", isImplemented: false,
        description: "A tax on corporate's revenue.",
        type: "finance", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 2, maxRevenue: 100,
        effects: {
            "taxes": {
                effectDelay: 5, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
            "investment": {
                effectDelay: 3, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.2 * policyValue},
            },
        }
    },
    "tobacco_tax": {
        name: "Tobacco Tax", isImplemented: false,
        description: "A tax on tobacco products.",
        type: "finance", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 2, maxRevenue: 100,
        effects: {
            "taxes": {
                effectDelay: 5, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
            "chronic_disease": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue},
            },
            "mental_health_crisis": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            }
        }
    },
    "alcohol_tax": {
        name: "Alcohol Tax", isImplemented: false,
        description: "A tax on alcohol products.",
        type: "finance", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 2, maxRevenue: 100,
        effects: {
            "taxes": {
                effectDelay: 5, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
            "chronic_disease": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue},
            },
            "mental_health_crisis": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
            "crime_violence": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "fuel_tax": {
        name: "Fuel Tax", isImplemented: false,
        description: "Tax on fuel.",
        type: "finance", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 2, maxRevenue: 100,
        effects: {
            "taxes": {
                effectDelay: 5, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
            "pollution_control": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue},
            },
            "transportation": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "property_tax": {
        name: "Property Tax", isImplemented: false,
        description: "Tax on property.",
        type: "finance", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 2, maxRevenue: 100,
        effects: {
            "taxes": {
                effectDelay: 5, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
            "urban_housing": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue},
            },
        }
    },
    "vehicle_tax": {
        name: "Vehicle Tax", isImplemented: false,
        description: "Tax on vehicles.",
        type: "finance", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 2, maxRevenue: 100,
        effects: {
            "taxes": {
                effectDelay: 5, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
            "pollution_control": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue},
            },
        }
    },
    "value_added_tax": {
        name: "Value Added Tax", isImplemented: false,
        description: "Tax on value added to a product.",
        type: "finance", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 2, maxRevenue: 100,
        effects: {
            "taxes": {
                effectDelay: 5, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
            "investment": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
            "manufacturing": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "customs_duty": {
        name: "Customs Duty", isImplemented: false,
        description: "Tax on imported goods.",
        type: "finance", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 2, maxRevenue: 100,
        effects: {
            "taxes": {
                effectDelay: 5, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
            "investment": {
                 effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "tax_amnesty": {
        name: "Tax Amnesty", isImplemented: false,
        description: "Tax amnesty for tax evaders.",
        type: "finance", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 2, maxRevenue: 100,
        effects: {
            "taxes": {
                effectDelay: 5, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.2 * policyValue},
            },
            "investment": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },

    // HEALTH
    "mandatory_face_masks": {
        name: "Mandatory Face Masks", isImplemented: false,
        description: "Mandatory face masks in public places.",
        type: "health", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "disease_control": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue},
            },
        }
    },
    "lockdown": {
        name: "Lockdown & Quarantine", isImplemented: false,
        description: "Lockdown and quarantine measures.",
        type: "health", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "disease_control": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue},
            },
        }
    },
    "mandatory_vaccination": {
        name: "Mandatory Vaccination", isImplemented: false,
        description: "Mandatory vaccination of the population.",
        type: "health", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "disease_control": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue},
            },
        }
    },
    "travel_ban": {
        name: "Travel Ban", isImplemented: false,
        description: "Ban on international and domestic travel.",
        type: "health", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "disease_control": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue},
            },
            "investment": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
            "tourism_creative":{
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "state_healthcare": {
        name: "State Healthcare", isImplemented: false,
        description: "State healthcare system.",
        type: "health", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "healthcare_system": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "health_insurance": {
        name: "Health Insurance", isImplemented: false,
        description: "State health insurance.",
        type: "health", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "healthcare_system": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "food_drug_regulations": {
        name: "Food & Drug Regulations", isImplemented: false,
        description: "Food and drug regulations.",
        type: "health", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 200, minRevenue: 0, maxRevenue: 0,
        effects: {
            "public_health": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},                
            }
        }
    },
    "public_health_campaign": {
        name: "Public Health Campaign", isImplemented: false,
        description: "Public health campaign.",
        type: "health", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 200, minRevenue: 0, maxRevenue: 0,
        effects: {
            "public_health": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            }
        }
    },
    "blood_organ_donation": {
        name: "Blood & Organ Donation", isImplemented: false,
        description: "Blood and organ donation.",
        type: "health", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
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
        description: "School meals.",
        type: "health", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "public_health": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            }
        }
    },

    // Education
    "scholarships": {
        name: "Scholarships", isImplemented: false,
        description: "Scholarships.",
        type: "education", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "dropout_crisis": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            }
        }
    },
    "state_schools": {
        name: "State Schools", isImplemented: false,
        description: "State schools.",
        type: "education", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "education_system": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "standardized_testing": {
        name: "Standardized Testing", isImplemented: false,
        description: "Standardized testing.",
        type: "education", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "education_system": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue},
            }
        }
    },
    "vocational_education": {
        name: "Vocational Education", isImplemented: false,
        description: "Vocational education.",
        type: "education", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "education_system": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
            "productive_workers": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "curriculum_development": {
        name: "Curriculum Development", isImplemented: false,
        description: "Curriculum development.",
        type: "education", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "education_system": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "teacher_education": {
        name: "Teacher Education", isImplemented: false,
        description: "Teacher education.",
        type: "education", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "teachers": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "competency_assessment": {
        name: "Competency Assessment", isImplemented: false,
        description: "Competency assessment.",
        type: "education", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "teachers": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue},
            }
        }
    },
    "research_grants": {
        name: "Research Grants", isImplemented: false,
        description: "Research grants.",
        type: "education", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "research": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            }
        }
    },
    "university_grants": {
        name: "University Grants", isImplemented: false,
        description: "University grants.",
        type: "education", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "research": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue},
            },
            "education_system": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
            "productive_workers": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "technology_colleges": {
        name: "Technology Colleges", isImplemented: false,
        description: "Technology colleges.",
        type: "education", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "education_system": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue},
            },
            "research": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
            "productive_workers": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue},
            },
        }
    },

    // Social
    "child_benefit": {
        name: "Child Benefit", isImplemented: false,
        description: "Benefits for children.",
        type: "social", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "social_security": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue},
            },
            "population_control": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue},
            },
        }
    },
    "disablity_benefit": {
        name: "Disability Benefit", isImplemented: false,
        description: "Benefits for disabled people.",
        type: "social", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "social_security": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
            "discrimination": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue},
            },
        }
    },
    "elderly_benefit": {
        name: "Elderly Benefit", isImplemented: false,
        description: "Benefits for elderly people.",
        type: "social", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "social_security": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
            "empowerment": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "unemployment_benefit": {
        name: "Unemployment Benefit", isImplemented: false,
        description: "Benefits for unemployed people.",
        type: "social", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "social_security": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
            "unemployment": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "family_planning": {
        name: "Family Planning", isImplemented: false,
        description: "Family planning.",
        type: "social", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "population_control": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },

    // Environment
    "carbon_tax": {
        name: "Carbon Tax", isImplemented: false,
        description: "Tax on carbon emissions.",
        type: "environment", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "pollution_control": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue},
            },
        }
    },
    "recycling_plant": {
        name: "Recycling Plant", isImplemented: false,
        description: "Recycling plant.",
        type: "environment", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "pollution_control": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue},
            },
        }
    },
    "reforestation": {
        name: "Reforestation", isImplemented: false,
        description: "Reforestation.",
        type: "environment", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "forest": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "ocean_cleanup": {
        name: "Ocean Cleanup", isImplemented: false,
        description: "Ocean cleanup.",
        type: "environment", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "marine": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },

    // Nature
    "desalination_plant": {
        name: "Desalination Plant", isImplemented: false,
        description: "Desalination plant.",
        type: "nature", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "water_land": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "state_water_company": {
        name: "State Water Company", isImplemented: false,
        description: "State water company.",
        type: "nature", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "water_land": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "food_import": {
        name: "Food Import", isImplemented: false,
        description: "Food import.",
        type: "nature", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "food_sources": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },

    // Infrastructure
    "road_construction": {
        name: "Road Construction", isImplemented: false,
        description: "Road construction.",
        type: "infrastructure", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "transportation": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "rail_construction": {
        name: "Rail Construction", isImplemented: false,
        description: "Rail construction.",
        type: "infrastructure", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "transportation": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue}, 
            },
        }
    },
    "public_transport": {
        name: "Public Transport", isImplemented: false,
        description: "Public transport.",
        type: "infrastructure", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "transportation": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    
    // Labor
    "maternity_leave": {
        name: "Maternity Leave", isImplemented: false,
        description: "Maternity leave.",
        type: "labor", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "work_environment": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "work_safety_inspection": {
        name: "Work Safety Inspection", isImplemented: false,
        description: "Work safety inspection.",
        type: "labor", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "work_environment": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },

    // Defense
    "diplomatic_service": {
        name: "Diplomatic Service", isImplemented: false,
        description: "Diplomatic service.",
        type: "defense", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "foreign_relations": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "foreign_aid": {
        name: "Foreign Aid", isImplemented: false,
        description: "Foreign aid.",
        type: "defense", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "foreign_relations": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "military_training": {
        name: "Military Training", isImplemented: false,
        description: "Military training.",
        type: "defense", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "defense_force": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "intelligence_agency": {
        name: "Intelligence Agency", isImplemented: false,
        description: "Intelligence agency.",
        type: "defense", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "defense_infrastructure": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "border_control": {
        name: "Border Control", isImplemented: false,
        description: "Border control.",
        type: "defense", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "defense_infrastructure": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },

    // Stability
    "legal_aid": {
        name: "Legal Aid", isImplemented: false,
        description: "Legal aid.",
        type: "stability", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "justice_system": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "death_penalty": {
        name: "Death Penalty", isImplemented: false,
        description: "Death penalty.",
        type: "stability", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "justice_system": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue},
            },
        }
    },
    "anti_corruption_agency": {
        name: "Anti-Corruption Agency", isImplemented: false,
        description: "Anti-corruption agency.",
        type: "stability", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "governance": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "internet_censorship": {
        name: "Internet Censorship", isImplemented: false,
        description: "Internet censorship.",
        type: "stability", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "media_neutrality": {
                effectDelay: 2, effectDuration: 0,
                valueType: "negative", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 - 0.1 * policyValue},
            },
        }
    },
    "police_force": {
        name: "Police Force", isImplemented: false,
        description: "Police force.",
        type: "stability", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "security": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },

    // Industry
    "small_business_grants": {
        name: "Small Business Grants", isImplemented: false,
        description: "Small business grants.",
        type: "industry", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "economy": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "agricultural_subsidies": {
        name: "Agricultural Subsidies", isImplemented: false,
        description: "Agricultural subsidies.",
        type: "industry", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "agriculture": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
    "tourism_campaign": {
        name: "Tourism Campaign", isImplemented: false,
        description: "Tourism campaign.",
        type: "industry", value: 50, finalValue: 50, valueDelta: 0,
        implementationCost: 0, implementationDelay: 0, implementationDuration: 0,
        minCost: 0, maxCost: 0, minRevenue: 0, maxRevenue: 0,
        effects: {
            "tourism_creative": {
                effectDelay: 2, effectDuration: 0,
                valueType: "positive", value: 0, valueDelta: 0,
                formula: function (policyValue) {return 0 + 0.1 * policyValue},
            },
        }
    },
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

    if (!policyData.isImplemented) {
        return;
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

    const stateText = getTextById("policy_pop_up_state");
    stateText.text = policyData.isImplemented ? "Active" : "Inactive";

    const activateButton = getObjectbyId(runtime.objects.Button, "policy_pop_up_activate");
    activateButton.animationFrame = policyData.isImplemented ? 3 : 2;

    const applyButton = getObjectbyId(runtime.objects.Button, "policy_pop_up_apply");
    applyButton.instVars['isDisabled'] = !policyData.isImplemented;
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
            effectName.text = effectVariableData.name + " (" + effectData.effectDelay + " Delay)";
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
