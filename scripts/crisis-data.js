import { createMachine } from "./fsm.js";
import { status } from "./status-data.js";
import { addTextToCache, getTextById } from "./utils.js";

/**
 * @typedef {{
 *      [key: string]: () => boolean,
 * }} Transition
 */

/**
 * @typedef {
 *     cause: string,
 *     yIntercept: number,
 *     inertia: number,
 *     factor: number,
 *     formula: function(),
 * } Cause
 */

/**
 * @type {
 * [key: string]: {
 *      value: number,
 *      type: string,
 *      isGlobal: boolean,
 *      threshholds: number[],
 *      states: State[],
 *      transitions: Transition[],
 *      causes: Cause[],
 *      lastUpdate: number
 * }}
 */
export let crisis = {
  inflation: {
    value: 0,
    lastUpdate: 0,
    type: "finance",
    isGlobal: true,
    thresholds: [30, 50, 70],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => crisisFsms["recession"].value != crisis["recession"].states[2] &&
                    crisisFsms["recession"].value != crisis["recession"].states[3],
      "hyperinflation": () => crisisFsms["recession"].value != crisis["recession"].states[3]
    },
    causes: [
      {
        cause: "taxes",
        yIntercept: -0.2,
        factor: 0.1,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["taxes"].value / 100) * this.factor},
      },
      {
        cause: "economy",
        yIntercept: -0.2,
        factor: 0.1,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["economy"].value / 100) * this.factor},
      },
      {
        cause: "wage_income",
        yIntercept: -0.15,
        factor: 0.3,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["wage_income"].value / 100) * this.factor},
      },
      {
        cause: "security",
        yIntercept: 0.1,
        factor: -0.2,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["security"].value / 100) * this.factor},
      },
      {
        cause: "debt_crisis",
        yIntercept: 0,
        factor: 0.1,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["debt_crisis"].value / 100) * this.factor},
      },
    ],
  },
  recession: {
    value: 0,
    lastUpdate: 0,
    type: "finance",
    isGlobal: true,
    thresholds: [35, 60, 80],
    states: ["low", "medium", "recession", "depression"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => true,
      "extreme": () => true,
    },
    causes: [
      {
        cause: "investment",
        yIntercept: 0.1,
        factor: -0.25,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["investment"].value / 100) * this.factor},
      },
      {
        cause: "inflation",
        yIntercept: 0.2,
        factor: 0.2,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["inflation"].value / 100) * this.factor},
      },
    ],
  },
  debt_crisis: {
    value: 0,
    lastUpdate: 0,
    type: "finance",
    isGlobal: true,
    thresholds: [25, 50, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => crisisFsms["recession"].value != crisis["recession"].states[2] &&
                    crisisFsms["recession"].value != crisis["recession"].states[3],
      "extreme": () => crisisFsms["recession"].value != crisis["recession"].states[3]
    },
    causes: [
      {
        cause: "debt",
        yIntercept: -0.5,
        factor: 0.7,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["debt"].value / 100) * this.factor},
      },
    ],
  },
  tax_evasion: {
    value: 0,
    lastUpdate: 0,
    type: "finance",
    isGlobal: true,
    thresholds: [30, 50, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => true,
      "extreme": () => true,
    },
    causes: [
      {
        cause: "taxes",
        yIntercept: -0.3,
        factor: 0.6,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["taxes"].value / 100) * this.factor},
      },
    ],
  },
  infectious_disease: {
    value: 0,
    lastUpdate: 0,
    type: "health",
    isGlobal: false,
    thresholds: [25, 50, 70],
    states: ["endemic", "medium", "epidemic", "pandemic"],
    transitions: {
      "endemic": () => true,
      "medium": () => true,
      "epidemic": () => true,
      "pandemic": () => true,
    },
    causes: [
      {
        cause: "disease_control",
        yIntercept: 0,
        factor: -0.5,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["disease_control"].value / 100) * this.factor},
      },
      {
        cause: "healthcare_system",
        yIntercept: 0.1,
        factor: -0.3,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["healthcare_system"].value / 100) * this.factor},
      },
      {
        cause: "mental_health_crisis",
        yIntercept: 0,
        factor: 0.05,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["mental_health_crisis"].value / 100) * this.factor},
      },
      {
        cause: "urban_overcrowding",
        yIntercept: -0.2,
        factor: 0.15,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["urban_overcrowding"].value / 100) * this.factor},
      },
      {
        cause: "pollution",
        yIntercept: -0.2,
        factor: 0.2,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["pollution"].value / 100) * this.factor},
      },
      {
        cause: "water_scarcity",
        yIntercept: -0.1,
        factor: 0.15,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["water_scarcity"].value / 100) * this.factor},
      },
      {
        cause: "food_insecurity",
        yIntercept: -0.1,
        factor: 0.15,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["food_insecurity"].value / 100) * this.factor},
      },
    ],
  },
  chronic_disease: {
    value: 0,
    lastUpdate: 0,
    type: "health",
    isGlobal: false,
    thresholds: [25, 55, 75],
    states: ["endemic", "concerning", "epidemic", "extreme"],
    transitions: {
      "endemic": () => true,
      "concerning": () => true,
      "epidemic": () => true,
      "extreme": () => true,
    },
    causes: [
      {
        cause: "disease_control",
        yIntercept: 0.1,
        factor: -0.25,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["disease_control"].value / 100) * this.factor},
      },
      {
        cause: "public_health",
        yIntercept: 0.1,
        factor: -0.4,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["public_health"].value / 100) * this.factor},
      },
      {
        cause: "healthcare_system",
        yIntercept: 0.5,
        factor: -0.3,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["healthcare_system"].value / 100) * this.factor},
      },
      {
        cause: "work_environment",
        yIntercept: 0.05,
        factor: -0.1,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["work_environment"].value / 100) * this.factor},
      },
      {
        cause: "pollution",
        yIntercept: 0,
        factor: 0.15,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["pollution"].value / 100) * this.factor},
      },
      {
        cause: "water_scarcity",
        yIntercept: 0,
        factor: 0.05,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["water_scarcity"].value / 100) * this.factor},
      },
      {
        cause: "food_insecurity",
        yIntercept: -0.1,
        factor: 0.1,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["food_insecurity"].value / 100) * this.factor},
      },
    ],
  },
  mental_health_crisis: {
    value: 0,
    lastUpdate: 0,
    type: "health",
    isGlobal: false,
    thresholds: [35, 55, 85],
    states: ["low", "rising", "epidemic", "extreme"],
    transitions: {
      "low": () => true,
      "rising": () => true,
      "epidemic": () => true,
      "extreme": () => true,
    },
    causes: [
      {
        cause: "public_health",
        yIntercept: -0.1,
        factor: -0.35,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["public_health"].value / 100) * this.factor},
      },
      {
        cause: "tourism_creative",
        yIntercept: -0.05,
        factor: -0.15,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["tourism_creative"].value / 100) * this.factor},
      },
      {
        cause: "inflation",
        yIntercept: 0.1,
        factor: 0.2,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["inflation"].value / 100) * this.factor},
      },
      {
        cause: "poverty",
        yIntercept: 0.1,
        factor: 0.25,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["poverty"].value / 100) * this.factor},
      },
      {
        cause: "unemployment",
        yIntercept: -0.1,
        factor: 0.1,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["unemployment"].value / 100) * this.factor},
      },
      {
        cause: "job_loss",
        yIntercept: 0.05,
        factor: -0.15,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["job_loss"].value / 100) * this.factor},
      },
    ],
  },
  healthcare_collapse: {
    value: 0,
    lastUpdate: 0,
    type: "health",
    isGlobal: true,
    thresholds: [40, 60, 85],
    states: ["normal", "concerning", "overcapacity", "collapse"],
    transitions: {
      "normal": () => true,
      "concerning": () => true,
      "overcapacity": () => true,
      "collapse": () => true,
    },
    causes: [
      {
        cause: "healthcare_system",
        yIntercept: 0.5,
        factor: -0.8,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["healthcare_system"].value / 100) * this.factor},
      },
      {
        cause: "infectious_disease",
        yIntercept: -0.25,
        factor: 0.15,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["infectious_disease"].value / 100) * this.factor},
      },
      {
        cause: "chronic_disease",
        yIntercept: -0.2,
        factor: 0.1,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["chronic_disease"].value / 100) * this.factor},
      },
    ],
  },
  health_worker_shortage: {
    value: 0,
    lastUpdate: 0,
    type: "health",
    isGlobal: true,
    thresholds: [40, 60, 85],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => crisisFsms["healthcare_collapse"].value != crisis['healthcare_collapse'].states[2] &&
                    crisisFsms["healthcare_collapse"].value != crisis['healthcare_collapse'].states[3],
      "extreme": () => crisisFsms["healthcare_collapse"].value != crisis['healthcare_collapse'].states[3],
    },
    causes: [
      {
        cause: "health_workers",
        yIntercept: 0.5,
        factor: -0.6,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["health_workers"].value / 100) * this.factor},
      },
      {
        cause: "productive_workers",
        yIntercept: 0.3,
        factor: -0.4,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["productive_workers"].value / 100) * this.factor},
      },
    ],
  },
  dropout_crisis: {
    value: 0,
    lastUpdate: 0,
    type: "education",
    isGlobal: false,
    thresholds: [30, 50, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => true,
      "extreme": () => true
    },
    causes: [
      {
        cause: "education_system",
        yIntercept: 0.1,
        factor: -0.4,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["education_system"].value / 100) * this.factor},
      },
      {
        cause: "poverty",
        yIntercept: 0.1,
        factor: 0.3,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["poverty"].value / 100) * this.factor},
      },
    ],
  },
  low_education: {
    value: 0,
    lastUpdate: 0,
    type: "education",
    isGlobal: false,
    thresholds: [30, 55, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => true,
      "extreme": () => true
    },
    causes: [
      {
        cause: "education_system",
        yIntercept: 0.8,
        factor: -1.0,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["education_system"].value / 100) * this.factor},
      },
      {
        cause: "teachers",
        yIntercept: 0.4,
        factor: -0.4,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["teachers"].value / 100) * this.factor},
      },
    ],
  },
  teacher_shortage: {
    value: 0,
    lastUpdate: 0,
    type: "education",
    isGlobal: true,
    thresholds: [40, 55, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => crisisFsms["low_education"].value != crisis['low_education'].states[2] &&
                    crisisFsms["low_education"].value != crisis['low_education'].states[3],
      "extreme": () => crisisFsms["low_education"].value != crisis['low_education'].states[3]
    },
    causes: [
      {
        cause: "teachers",
        yIntercept: 0.4,
        factor: -0.6,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["teachers"].value / 100) * this.factor},
      },
      {
        cause: "skill_shortage",
        yIntercept: 0.1,
        factor: 0.2,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["skill_shortage"].value / 100) * this.factor},
      },
    ],
  },
  technology_lag: {
    value: 0,
    lastUpdate: 0,
    type: "education",
    isGlobal: true,
    thresholds: [40, 55, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => true,
      "extreme": () => true
    },
    causes: [
      {
        cause: "research",
        yIntercept: 1.0,
        factor: -1.0,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["research"].value / 100) * this.factor},
      },
    ],
  },
  poverty: {
    value: 0,
    lastUpdate: 0,
    type: "social",
    isGlobal: false,
    thresholds: [30, 55, 75],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => true,
      "extreme": () => true
    },
    causes: [
      {
        cause: "social_security",
        yIntercept: 0,
        factor: 0,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["social_security"].value / 100) * this.factor},
      },
      {
        cause: "recession",
        yIntercept: 0,
        factor: 0,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["recession"].value / 100) * this.factor},
      },
      {
        cause: "discrimination",
        yIntercept: 0,
        factor: 0,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["discrimination"].value / 100) * this.factor},
      },
    ],
  },
  discrimination: {
    value: 0,
    lastUpdate: 0,
    type: "social",
    isGlobal: true,
    thresholds: [30, 55, 75],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => true,
      "extreme": () => true
    },
    causes: [
      {
        cause: "empowerment",
        yIntercept: 0.05,
        factor: -0.4,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["empowerment"].value / 100) * this.factor},
      },
      {
        cause: "justice_system",
        yIntercept: -0.01,
        factor: -0.2,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["justice_system"].value / 100) * this.factor},
      },
      {
        cause: "media_bias",
        yIntercept: 0.1,
        factor: 0.2,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["media_bias"].value / 100) * this.factor},
      },
      {
        cause: "misinformation_spread",
        yIntercept: 0,
        factor: 0.15,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["misinformation_spread"].value / 100) * this.factor},
      },
    ],
  },
  urban_overcrowding: {
    value: 0,
    lastUpdate: 0,
    type: "social",
    isGlobal: false,
    thresholds: [35, 55, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => crisisFsms["poverty"].value != crisis["poverty"].states[2] &&
                    crisisFsms["poverty"].value != crisis["poverty"].states[3],
      "extreme": () => crisisFsms["poverty"].value != crisis["poverty"].states[3]
    },
    causes: [
      {
        cause: "water_land",
        yIntercept: -0.1,
        factor: -0.3,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["water_land"].value / 100) * this.factor},
      },
      {
        cause: "transportation",
        yIntercept: 0.1,
        factor: -0.2,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["transportation"].value / 100) * this.factor},
      },
      {
        cause: "urban_housing",
        yIntercept: 0.15,
        factor: -0.35,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["urban_housing"].value / 100) * this.factor},
      },
      {
        cause: "overpopulation",
        yIntercept: 0.05,
        factor: 0.25,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["overpopulation"].value / 100) * this.factor},
      },
    ],
  },
  housing_crisis: {
    value: 0,
    lastUpdate: 0,
    type: "social",
    isGlobal: false,
    thresholds: [30, 60, 85],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => true,
      "extreme": () => true
    },
    causes: [
      {
        cause: "social_security",
        yIntercept: 0.15,
        factor: -0.4,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["social_security"].value / 100) * this.factor},
      },
      {
        cause: "water_land",
        yIntercept: 0.1,
        factor: -0.25,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["water_land"].value / 100) * this.factor},
      },
      {
        cause: "urban_housing",
        yIntercept: 0.1,
        factor: -0.35,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["urban_housing"].value / 100) * this.factor},
      },
    ],
  },
  overpopulation: {
    value: 0,
    lastUpdate: 0,
    type: "social",
    isGlobal: true,
    thresholds: [35, 65, 85],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => crisisFsms["recession"].value != crisis["recession"].states[2] &&
                    crisisFsms["recession"].value != crisis["recession"].states[3] &&
                    crisisFsms["war_aggression"].value != crisis["war_aggression"].states[2] &&
                    crisisFsms["war_aggression"].value != crisis["war_aggression"].states[3],
      "extreme": () => crisisFsms["recession"].value != crisis["recession"].states[3] &&
                       crisisFsms["war_aggression"].value != crisis["war_aggression"].states[3],
    },
    causes: [
      {
        cause: "population_control",
        yIntercept: 0.8,
        factor: -1.0,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["population_control"].value / 100) * this.factor},
      },
    ],
  },
  pollution: {
    value: 0,
    lastUpdate: 0,
    type: "environment",
    isGlobal: false,
    thresholds: [25, 55, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => true,
      "extreme": () => true
    },
    causes: [
      {
        cause: "pollution_control",
        yIntercept: 0.4,
        factor: -0.5,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["pollution_control"].value / 100) * this.factor},
      },
      {
        cause: "forest",
        yIntercept: 0.1,
        factor: -0.25,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["forest"].value / 100) * this.factor},
      },
      {
        cause: "marine",
        yIntercept: 0.15,
        factor: -0.3,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["marine"].value / 100) * this.factor},
      },
      {
        cause: "sustainability",
        yIntercept: 0.05,
        factor: -0.4,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["sustainability"].value / 100) * this.factor},
      },
    ],
  },
  deforestation: {
    value: 0,
    lastUpdate: 0,
    type: "environment",
    isGlobal: false,
    thresholds: [30, 60, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => true,
      "extreme": () => true
    },
    causes: [
      {
        cause: "forest",
        yIntercept: 0.1,
        factor: -0.4,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["forest"].value / 100) * this.factor},
      },
      {
        cause: "sustainability",
        yIntercept: 0.1,
        factor: -0.3,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["sustainability"].value / 100) * this.factor},
      },
      {
        cause: "overpopulation",
        yIntercept: 0.05,
        factor: 0.2,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["overpopulation"].value / 100) * this.factor},
      },
    ],
  },
  overfishing: {
    value: 0,
    lastUpdate: 0,
    type: "environment",
    isGlobal: true,
    thresholds: [30, 60, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => true,
      "extreme": () => true
    },
    causes: [
      {
        cause: "fisheries",
        yIntercept: -0.1,
        factor: 0.3,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["fisheries"].value / 100) * this.factor},
      },
      {
        cause: "sustainability",
        yIntercept: 0.05,
        factor: -0.2,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["sustainability"].value / 100) * this.factor},
      },
    ],
  },
  biodiversity_loss: {
    value: 0,
    lastUpdate: 0,
    type: "environment",
    isGlobal: true,
    thresholds: [30, 55, 85],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => crisisFsms["deforestation"].value != crisis["deforestation"].states[2] &&
                    crisisFsms["deforestation"].value != crisis["deforestation"].states[3] &&
                    crisisFsms["overfishing"].value != crisis["overfishing"].states[2] &&
                    crisisFsms["overfishing"].value != crisis["overfishing"].states[3] &&
                    crisisFsms["water_scarcity"].value != crisis["water_scarcity"].states[2] &&
                    crisisFsms["water_scarcity"].value != crisis["water_scarcity"].states[3] &&
                    crisisFsms["food_insecurity"].value != crisis["food_insecurity"].states[2] &&
                    crisisFsms["food_insecurity"].value != crisis["food_insecurity"].states[3],
      "extreme": () => crisisFsms["deforestation"].value != crisis["deforestation"].states[3] &&
                       crisisFsms["overfishing"].value != crisis["overfishing"].states[3] &&
                       crisisFsms["water_scarcity"].value != crisis["water_scarcity"].states[3] &&
                       crisisFsms["food_insecurity"].value != crisis["food_insecurity"].states[3],
    },
    causes: [
      {
        cause: "biodiversity",
        yIntercept: 0.8,
        factor: -1.0,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["biodiversity"].value / 100) * this.factor},
      },
    ],
  },
  water_scarcity: {
    value: 0,
    lastUpdate: 0,
    type: "nature",
    isGlobal: false,
    thresholds: [30, 55, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => true,
      "extreme": () => true
    },
    causes: [
      {
        cause: "forest",
        yIntercept: 0.1,
        factor: -0.25,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["forest"].value / 100) * this.factor},
      },
      {
        cause: "marine",
        yIntercept: 0.15,
        factor: -0.2,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["marine"].value / 100) * this.factor},
      },
      {
        cause: "water_land",
        yIntercept: 0.2,
        factor: -0.35,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["water_land"].value / 100) * this.factor},
      },
    ],
  },
  mineral_scarcity: {
    value: 0,
    lastUpdate: 0,
    type: "nature",
    isGlobal: true,
    thresholds: [35, 60, 85],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => crisisFsms["food_insecurity"].value != crisis["food_insecurity"].states[2] &&
                    crisisFsms["food_insecurity"].value != crisis["food_insecurity"].states[3],
      "extreme": () => crisisFsms["food_insecurity"].value != crisis["food_insecurity"].states[3]
    },
    causes: [
      {
        cause: "mineral_oil",
        yIntercept: 0.15,
        factor: -0.35,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["mineral_oil"].value / 100) * this.factor},
      },
    ],
  },
  food_insecurity: {
    value: 0,
    lastUpdate: 0,
    type: "nature",
    isGlobal: false,
    thresholds: [35, 60, 85],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => true,
      "extreme": () => true
    },
    causes: [
      {
        cause: "food_sources",
        yIntercept: 0.15,
        factor: -0.35,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["food_sources"].value / 100) * this.factor},
      },
      {
        cause: "agriculture",
        yIntercept: 0.2,
        factor: -0.4,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["agriculture"].value / 100) * this.factor},
      },
      {
        cause: "fisheries",
        yIntercept: 0.15,
        factor: -0.35,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["fisheries"].value / 100) * this.factor},
      },
    ],
  },
  infrastructure_inequality: {
    value: 0,
    lastUpdate: 0,
    type: "infrastructure",
    isGlobal: false,
    thresholds: [30, 50, 75],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => crisisFsms["energy_crisis"].value != crisis["energy_crisis"].states[2] &&
                    crisisFsms["energy_crisis"].value != crisis["energy_crisis"].states[3],
      "extreme": () => crisisFsms["energy_crisis"].value != crisis["energy_crisis"].states[3]
    },
    causes: [
      {
        cause: "communication_information",
        yIntercept: 0.15,
        factor: -0.35,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["communication_information"].value / 100) * this.factor},
      },
      {
        cause: "transportation",
        yIntercept: 0.15,
        factor: -0.35,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["transportation"].value / 100) * this.factor},
      },
    ],
  },
  energy_crisis: {
    value: 0,
    lastUpdate: 0,
    type: "infrastructure",
    isGlobal: false,
    thresholds: [30, 50, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => true,
      "extreme": () => true
    },
    causes: [
      {
        cause: "mineral_oil_industry",
        yIntercept: 0.05,
        factor: -0.2,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["mineral_oil_industry"].value / 100) * this.factor},
      },
      {
        cause: "power_energy",
        yIntercept: 0.85,
        factor: -1.0,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["power_energy"].value / 100) * this.factor},
      },
    ],
  },
  skill_shortage: {
    value: 0,
    lastUpdate: 0,
    type: "labor",
    isGlobal: true,
    thresholds: [30, 50, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => crisisFsms["low_education"].value != crisis["low_education"].states[2] &&
                    crisisFsms["low_education"].value != crisis["low_education"].states[3] &&
                    crisisFsms["low_investment"].value != crisis["low_investment"].states[2] &&
                    crisisFsms["low_investment"].value != crisis["low_investment"].states[3],
      "extreme": () => crisisFsms["low_education"].value != crisis["low_education"].states[3] &&
                       crisisFsms["low_investment"].value != crisis["low_investment"].states[3]
    },
    causes: [
      {
        cause: "low_education",
        yIntercept: -0.1,
        factor: 0.3,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["low_education"].value / 100) * this.factor},
      },
      {
        cause: "dropout_crisis",
        yIntercept: -0.05,
        factor: 0.15,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["dropout_crisis"].value / 100) * this.factor},
      },
      {
        cause: "discrimination",
        yIntercept: 0,
        factor: 0.1,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["discrimination"].value / 100) * this.factor},
      },
    ],
  },
  unemployment: {
    value: 0,
    lastUpdate: 0,
    type: "labor",
    isGlobal: true,
    thresholds: [30, 50, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => true,
      "extreme": () => true
    },
    causes: [
      {
        cause: "empowerment",
        yIntercept: 0.1,
        factor: -0.2,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["empowerment"].value / 100) * this.factor},
      },
      {
        cause: "security",
        yIntercept: 0.05,
        factor: -0.15,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["security"].value / 100) * this.factor},
      },
      {
        cause: "manufacturing",
        yIntercept: 0.05,
        factor: -0.3,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["manufacturing"].value / 100) * this.factor},
      },
      {
        cause: "tourism_creative",
        yIntercept: 0.05,
        factor: -0.2,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["tourism_creative"].value / 100) * this.factor},
      },
      {
        cause: "low_education",
        yIntercept: -0.2,
        factor: 0.3,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["low_education"].value / 100) * this.factor},
      },
      {
        cause: "dropout_crisis",
        yIntercept: -0.1,
        factor: 0.2,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["dropout_crisis"].value / 100) * this.factor},
      },
    ],
  },
  job_loss: {
    value: 0,
    lastUpdate: 0,
    type: "labor",
    isGlobal: true,
    thresholds: [25, 50, 70],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => crisisFsms["unemployment"].value != crisis["unemployment"].states[2] &&
                    crisisFsms["unemployment"].value != crisis["unemployment"].states[3],
      "extreme": () => crisisFsms["unemployment"].value != crisis["unemployment"].states[3]
    },
    causes: [
      {
        cause: "wage_income",
        yIntercept: 0.15,
        factor: -0.25,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["wage_income"].value / 100) * this.factor},
      },
      {
        cause: "work_environment",
        yIntercept: 0.1,
        factor: -0.2,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["work_environment"].value / 100) * this.factor},
      },
      {
        cause: "jobs",
        yIntercept: 0.15,
        factor: -0.4,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["jobs"].value / 100) * this.factor},
      },
      {
        cause: "security",
        yIntercept: 0.05,
        factor: -0.15,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["security"].value / 100) * this.factor},
      },
      {
        cause: "infectious_disease",
        yIntercept: 0.05,
        factor: 0.2,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["infectious_disease"].value / 100) * this.factor},
      },
    ],
  },
  cyber_attack: {
    value: 0,
    lastUpdate: 0,
    type: "defense",
    isGlobal: true,
    thresholds: [25, 55, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => true,
      "extreme": () => true
    },
    causes: [
      {
        cause: "defense_infrastructure",
        yIntercept: 0.05,
        factor: -0.3,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["defense_infrastructure"].value / 100) * this.factor},
      },
      {
        cause: "foreign_relations",
        yIntercept: 0.1,
        factor: -0.4,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["foreign_relations"].value / 100) * this.factor},
      },
    ],
  },
  terrorism: {
    value: 0,
    lastUpdate: 0,
    type: "defense",
    isGlobal: false,
    thresholds: [25, 50, 75],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => crisisFsms["war_aggression"].value != crisis["war_aggression"].states[2] &&
                    crisisFsms["war_aggression"].value != crisis["war_aggression"].states[3],
      "extreme": () => crisisFsms["war_aggression"].value != crisis["war_aggression"].states[3]
    },
    causes: [
      {
        cause: "foreign_relations",
        yIntercept: 0.1,
        factor: -0.4,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["foreign_relations"].value / 100) * this.factor},
      },
      {
        cause: "defense_infrastructure",
        yIntercept: -0.1,
        factor: -0.2,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["defense_infrastructure"].value / 100) * this.factor},
      },
      {
        cause: "defense_force",
        yIntercept: 0.15,
        factor: -0.3,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["defense_force"].value / 100) * this.factor},
      },
    ],
  },
  war_aggression: {
    value: 0,
    lastUpdate: 0,
    type: "defense",
    isGlobal: false,
    thresholds: [35, 60, 85],
    states: ["low", "medium", "aggression", "war"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "aggression": () => true,
      "war": () => true
    },
    causes: [
      {
        cause: "foreign_relations",
        yIntercept: 0.5,
        factor: -0.6,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["foreign_relations"].value / 100) * this.factor},
      },
      {
        cause: "defense_force",
        yIntercept: 0.2,
        factor: -0.4,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["defense_force"].value / 100) * this.factor},
      },
    ],
  },
  separatist_groups: {
    value: 0,
    lastUpdate: 0,
    type: "defense",
    isGlobal: false,
    thresholds: [35, 60, 85],
    states: ["low", "threat", "small", "extreme"],
    transitions: {
      "low": () => true,
      "threat": () => true,
      "small": () => crisisFsms["war_aggression"].value != crisis["war_aggression"].states[2] &&
                    crisisFsms["war_aggression"].value != crisis["war_aggression"].states[3],
      "extreme": () => crisisFsms["war_aggression"].value != crisis["war_aggression"].states[3]
    },
    causes: [
      {
        cause: "water_land",
        yIntercept: 0.05,
        factor: -0.2,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["water_land"].value / 100) * this.factor},
      },
      {
        cause: "foreign_relations",
        yIntercept: 0.2,
        factor: -0.45,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["foreign_relations"].value / 100) * this.factor},
      },
      {
        cause: "poverty",
        yIntercept: 0,
        factor: 0.15,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["poverty"].value / 100) * this.factor},
      },
      {
        cause: "overpopulation",
        yIntercept: 0,
        factor: 0.1,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["overpopulation"].value / 100) * this.factor},
      },
      {
        cause: "media_bias",
        yIntercept: 0,
        factor: 0.2,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["media_bias"].value / 100) * this.factor},
      },
    ],
  },
  misinformation_spread: {
    value: 0,
    lastUpdate: 0,
    type: "stability",
    isGlobal: true,
    thresholds: [30, 60, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => true,
      "extreme": () => true
    },
    causes: [
      {
        cause: "media_neutrality",
        yIntercept: 0,
        factor: -0.3,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["media_neutrality"].value / 100) * this.factor},
      },
      {
        cause: "communication_information",
        yIntercept: -0.05,
        factor: -0.2,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["communication_information"].value / 100) * this.factor},
      },
      {
        cause: "poverty",
        yIntercept: 0,
        factor: 0.15,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["poverty"].value / 100) * this.factor},
      },
      {
        cause: "low_education",
        yIntercept: 0.1,
        factor: 0.2,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["low_education"].value / 100) * this.factor},
      },
      {
        cause: "unemployment",
        yIntercept: -0.1,
        factor: 0.15,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["unemployment"].value / 100) * this.factor},
      },
    ],
  },
  media_bias: {
    value: 0,
    lastUpdate: 0,
    type: "stability",
    isGlobal: true,
    thresholds: [30, 60, 80],
    states: ["neutral", "medium", "high", "extreme"],
    transitions: {
      "neutral": () => true,
      "medium": () => true,
      "high": () => true,
      "extreme": () => true
    },
    causes: [
      {
        cause: "communication_information",
        yIntercept: 0.1,
        factor: -0.2,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["communication_information"].value / 100) * this.factor},
      },
      {
        cause: "media_neutrality",
        yIntercept: 0.1,
        factor: -0.4,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["media_neutrality"].value / 100) * this.factor},
      },
      {
        cause: "social_unrest",
        yIntercept: 0.05,
        factor: 0.1,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["social_unrest"].value / 100) * this.factor},
      },
    ],
  },
  political_instability: {
    value: 0,
    lastUpdate: 0,
    type: "stability",
    isGlobal: true,
    thresholds: [30, 60, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => crisisFsms["social_unrest"].value != crisis["social_unrest"].states[2] &&
                    crisisFsms["social_unrest"].value != crisis["social_unrest"].states[3] &&
                    crisisFsms["war_aggression"].value != crisis["war_aggression"].states[2] &&
                    crisisFsms["war_aggression"].value != crisis["war_aggression"].states[3],
      "extreme": () => crisisFsms["social_unrest"].value != crisis["social_unrest"].states[3] &&
                       crisisFsms["war_aggression"].value != crisis["war_aggression"].states[3],
    },
    causes: [
      {
        cause: "governance",
        yIntercept: 0.45,
        factor: -0.7,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["governance"].value / 100) * this.factor},
      },
      {
        cause: "misinformation_spread",
        yIntercept: 0.05,
        factor: 0.2,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["misinformation_spread"].value / 100) * this.factor},
      },
    ],
  },
  social_unrest: {
    value: 0,
    lastUpdate: 0,
    type: "stability",
    isGlobal: false,
    thresholds: [30, 55, 75],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => crisisFsms["war_aggression"].value != crisis["war_aggression"].states[2] &&
                    crisisFsms["war_aggression"].value != crisis["war_aggression"].states[3],
      "extreme": () => crisisFsms["war_aggression"].value != crisis["war_aggression"].states[3]
    },
    causes: [
      {
        cause: "recession",
        yIntercept: -0.1,
        factor: 0.2,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["recession"].value / 100) * this.factor},
      },
      {
        cause: "infectious_disease",
        yIntercept: 0,
        factor: -0.1,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["infectious_disease"].value / 100) * this.factor},
      },
      {
        cause: "water_scarcity",
        yIntercept: -0.05,
        factor: 0.1,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["water_scarcity"].value / 100) * this.factor},
      },
      {
        cause: "infrastructure_inequality",
        yIntercept: -0.05,
        factor: 0.1,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["infrastructure_inequality"].value / 100) * this.factor},
      },
      {
        cause: "energy_crisis",
        yIntercept: -0.05,
        factor: 0.15,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["energy_crisis"].value / 100) * this.factor},
      },
      {
        cause: "unemployment",
        yIntercept: -0.05,
        factor: 0.2,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["unemployment"].value / 100) * this.factor},
      },
      {
        cause: "political_instability",
        yIntercept: -0.1,
        factor: 0.2,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["political_instability"].value / 100) * this.factor},
      },
    ],
  },
  conflicts: {
    value: 0,
    lastUpdate: 0,
    type: "stability",
    isGlobal: false,
    thresholds: [30, 60, 75],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => crisisFsms["war_aggression"].value != crisis["war_aggression"].states[2] &&
                    crisisFsms["war_aggression"].value != crisis["war_aggression"].states[3],
      "extreme": () => crisisFsms["war_aggression"].value != crisis["war_aggression"].states[3]
    },
    causes: [
      {
        cause: "justice_system",
        yIntercept: 0.1,
        factor: -0.3,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["justice_system"].value / 100) * this.factor},
      },
      {
        cause: "discrimination",
        yIntercept: -0.1,
        factor: 0.2,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["discrimination"].value / 100) * this.factor},
      },
      {
        cause: "poverty",
        yIntercept: -0.1,
        factor: 0.1,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["poverty"].value / 100) * this.factor},
      },
      {
        cause: "misinformation_spread",
        yIntercept: -0.05,
        factor: 0.15,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["misinformation_spread"].value / 100) * this.factor},
      },
      {
        cause: "media_bias",
        yIntercept: -0.05,
        factor: 0.15,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["media_bias"].value / 100) * this.factor},
      },
    ],
  },
  crime_violence: {
    value: 0,
    lastUpdate: 0,
    type: "stability",
    isGlobal: false,
    thresholds: [30, 55, 75],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => crisisFsms["war_aggression"].value != crisis["war_aggression"].states[2] &&
                    crisisFsms["war_aggression"].value != crisis["war_aggression"].states[3],
      "extreme": () => crisisFsms["war_aggression"].value != crisis["war_aggression"].states[3]
    },
    causes: [
      {
        cause: "jobs",
        yIntercept: 0,
        factor: -0.25,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["jobs"].value / 100) * this.factor},
      },
      {
        cause: "justice_system",
        yIntercept: -0.3,
        factor: 0.5,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["justice_system"].value / 100) * this.factor},
      },
      {
        cause: "discrimination",
        yIntercept: -0.1,
        factor: 0.25,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["discrimination"].value / 100) * this.factor},
      },
      {
        cause: "poverty",
        yIntercept: -0.05,
        factor: 0.2,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["poverty"].value / 100) * this.factor},
      },
      {
        cause: "media_bias",
        yIntercept: 0.1,
        factor: 0.1,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["media_bias"].value / 100) * this.factor},
      },
      {
        cause: "unemployment",
        yIntercept: 0,
        factor: 0.1,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["unemployment"].value / 100) * this.factor},
      },
      {
        cause: "black_market",
        yIntercept: -0.05,
        factor: 0.2,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["black_market"].value / 100) * this.factor},
      },
      {
        cause: "food_insecurity",
        yIntercept: -0.05,
        factor: 0.1,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["food_insecurity"].value / 100) * this.factor},
      },
    ],
  },
  black_market: {
    value: 0,
    lastUpdate: 0,
    type: "industry",
    isGlobal: true,
    thresholds: [30, 55, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => crisisFsms["recession"].value != crisis["recession"].states[2] &&
                    crisisFsms["recession"].value != crisis["recession"].states[3],
      "extreme": () => crisisFsms["recession"].value != crisis["recession"].states[3]
    },
    causes: [
      {
        cause: "transportation",
        yIntercept: -0.2,
        factor: -0.3,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["transportation"].value / 100) * this.factor},
      },
      {
        cause: "tax_evasion",
        yIntercept: -0.05,
        factor: 0.2,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["tax_evasion"].value / 100) * this.factor},
      },
      {
        cause: "inflation",
        yIntercept: 0.05,
        factor: 0.2,
        inertia: 0,
        formula: function() {return this.yIntercept + (crisis["inflation"].value / 100) * this.factor},
      },
    ],
  },
  low_investment: {
    value: 0,
    lastUpdate: 0,
    type: "industry",
    isGlobal: true,
    thresholds: [30, 60, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => crisisFsms["recession"].value != crisis["recession"].states[2] &&
                    crisisFsms["recession"].value != crisis["recession"].states[3] &&
                    crisisFsms["bankruptcies"].value != crisis["bankruptcies"].states[2] &&
                    crisisFsms["bankruptcies"].value != crisis["bankruptcies"].states[3],
      "extreme": () => crisisFsms["recession"].value != crisis["recession"].states[3] &&
                       crisisFsms["bankruptcies"].value != crisis["bankruptcies"].states[3],
    },
    causes: [
      {
        cause: "investment",
        yIntercept: 0.6,
        factor: -0.7,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["investment"].value / 100) * this.factor},
      },
      {
        cause: "productive_workers",
        yIntercept: 0.2,
        factor: -0.3,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (status["productive_workers"].value / 100) * this.factor},
      },
      {
        cause: "infrastructure_inequality",
        yIntercept: 0.1,
        factor: -0.15,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["infrastructure_inequality"].value / 100) * this.factor},
      },
    ],
  },
  bankruptcies: {
    value: 0,
    lastUpdate: 0,
    type: "industry",
    isGlobal: true,
    thresholds: [30, 65, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      "low": () => true,
      "medium": () => true,
      "high": () => true,
      "extreme": () => true
    },
    causes: [
      {
        cause: "taxes",
        yIntercept: 0,
        factor: 0,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["taxes"].value / 100) * this.factor},
      },
      {
        cause: "economy",
        yIntercept: 0,
        factor: 0,
        inertia: 0,
        formula: function() {return this.yIntercept + (status["economy"].value / 100) * this.factor},
      },
      {
        cause: "low_investment",
        yIntercept: 0,
        factor: 0,
        inertia: 0,
        formula: function() {return this.yIntercept +
          (crisis["low_investment"].value / 100) * this.factor},
      },
    ],
  },
};

/**
 * @typedef {{
 *   value: string,
 *   updateState: () => boolean,
 *   tick: () => void
 * }} StateMachine
 */

/**
 * The crisis FSMs.
 */
export let crisisFsms = {};

/**
 * Initialize the crisis.
 * @param {*} levelVariables The level variables.
 */
export function initializeCrisis(levelVariables, runtime) {
  for (const variable in levelVariables) {
    crisis[variable].value = levelVariables[variable];
  }

  for (const variable in crisis) {
    let states = {};
    let initial = null;
    const crisisObj = crisis[variable];

    initializeCrisisTexts(runtime);

    crisisObj.states.forEach((state) => {
      if (!initial) {
        initial = state;
      }
      const index = crisisObj.states.indexOf(state);

      const transitions = [];

      // Add transition to previous state.
      if (index > 0) {
        const target = crisisObj.states[index - 1];

        transitions.push({
          target: target,
          condition: {
            evaluate: () =>
              crisisObj.transitions[target] &&
              crisisObj.value < crisisObj.thresholds[index - 1],
          },
        });
      }

      // Add transition to next state.
      if (index < crisisObj.states.length - 1) {
        const target = crisisObj.states[index + 1];

        transitions.push({
          target: target,
          condition: {
            evaluate: () => 
              crisisObj.transitions[target] &&
              crisisObj.value >= crisisObj.thresholds[index],
          },
        });
      }

      // state.transitions.forEach((transition) => {
      //   transitions.push({
      //     target: transition.target,
      //     condition: {
      //       evaluate: transition.evaluation,
      //     },
      //   });
      // });

      const stateCondition = {
        actions: {
          onEnter: () => {
            console.log(`Crisis ${variable} entering: ${state}`);

            const crisisWarningText = getTextById(variable + "_crisis_warning");

            if (crisis[variable].states.indexOf(state) > 1) {
              updateShownCrisis(variable, state, crisisWarningText);              
            } else {
              removeShownCrisis(variable, crisisWarningText);
            }
          },
        },
        transitions: transitions,
      };
      states[state] = stateCondition;
    });

    const fsm = createMachine({
      initialState: initial,
      states: states,
    });

    crisisFsms[variable] = fsm;
  }
}

/**
 * Create the shown crisis sprite font instances.
 * @param {IRuntimeObjects} runtime Runtime objects.
 */
function initializeCrisisTexts(runtime) {
  const crisisWarningScrollable = runtime.objects.ScrollablePanel.getAllInstances().filter(scrollable => scrollable.instVars['id'] === 'crisis_warning')[0];

  for (const variable in crisis) {
    const crisisText = runtime.objects.UIText.createInstance(
      "UI",
      crisisWarningScrollable.x + crisisWarningScrollable.width / 2,
      0
    );
    crisisText.text = variable.substring(0, 3) + ": " + shownCrisis[variable];
    crisisText.instVars["id"] = variable + "_crisis_warning";
    crisisText.characterScale = 0.3;
    crisisText.isVisible = false;

    addTextToCache(crisisText);
    
    crisisWarningScrollable.addChild(crisisText);
  }
}

/**
 * Update the crisis.
 * @param {string} variable The crisis name.
 */
export function updateCrisis(variable) {
  let totalUpdate = 0;
  for (const cause of crisis[variable].causes) {
    const update = cause.formula();
    crisis[variable].value += update;
    totalUpdate += update;
  }
  crisis[variable].lastUpdate = totalUpdate;
}

let shownCrisis = [];

/**
 * Add and show the new crisis.
 * @param {string} variable The name of the crisis.
 * @param {string} state The crisis state.
 * @param {ISpriteFontInstance} crisisWarningText The crisis warning sprite font object.
 */
function updateShownCrisis(variable, state, crisisWarningText) {
  const isShownBefore = shownCrisis.find(
    (element) => element.variable === variable
  );
  
  // Shift all other crisis texts down
  if (!isShownBefore) {
    crisisWarningText.y = 30;
    let y = 60;
    for (const otherCrisis of shownCrisis) {
      const otherText = getTextById(otherCrisis.variable + "_crisis_warning");
      otherText.y = y;
      y += 30;
    }

    shownCrisis.push({
      variable: variable,
      state: state,
    });
  }

  crisisWarningText.text = variable.substring(0, 5) + ": " + state;
  crisisWarningText.isVisible = true;
}

/**
 * Remove a shown crisis.
 * @param {string} variable The name of the crisis.
 * @param {ISpriteFontInstance} crisisWarningText The crisis warning sprite font object.
 */
function removeShownCrisis(variable, crisisWarningText) {
  const element = shownCrisis.find(
    (element) => element.variable === variable
  );

  if (element) {
    shownCrisis.splice(shownCrisis.indexOf(element), 1);
  }

  showCrisis(30);
  crisisWarningText.isVisible = false;
}

/**
 * Show all shown crisis.
 * @param {number} initialY The initial y position.
 */
function showCrisis(initialY) {
  for (const crisis of shownCrisis) {
    const crisisText = getTextById(crisis.variable + "_crisis_warning");
    crisisText.y = initialY;
    initialY += 30;
  }
}
