import { createMachine } from "./fsm.js";
import { status } from "./status-data.js";

/**
 * @typedef {
 *      target: string,
 *      evaluation: () => boolean
 * } Transition
 */

/**
 * @typedef {
 *      name: string,
 *      transitions: Transition[]
 * } State
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
 * string: {
 *      value: number,
 *      states: State[],
 *      causes: Cause[],
 *     lastUpdate: number
 * }}
 */
export let crisis = {
  inflation: {
    value: 0,
    lastUpdate: 0,
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["inflation"].value >= 30,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () =>
              crisis["inflation"].value >= 50 &&
              crisisFsms["recession"].value != "recession" &&
              crisisFsms["recession"].value != "deppression",
          },
          { target: "low", evaluation: () => crisis["inflation"].value < 30 },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["inflation"].value < 50,
          },
          {
            target: "hyperinflation",
            evaluation: () =>
              crisis["inflation"].value >= 70 &&
              crisisFsms["recession"].value != "deppression",
          },
        ],
      },
      {
        name: "hyperinflation",
        transitions: [
          {
            target: "high",
            evaluation: () =>
              crisis["inflation"].value < 70 &&
              crisisFsms["recession"].value != "recession" &&
              crisisFsms["recession"].value != "deppression",
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["recession"].value >= 35,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          { target: "high", evaluation: () => crisis["recession"].value >= 60 },
          { target: "low", evaluation: () => crisis["recession"].value < 35 },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["recession"].value < 60,
          },
          {
            target: "depression",
            evaluation: () => crisis["recession"].value >= 85,
          },
        ],
      },
      {
        name: "depression",
        transitions: [
          { target: "high", evaluation: () => crisis["recession"].value < 85 },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["debt_crisis"].value >= 25,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["debt_crisis"].value >= 50,
          },
          { target: "low", evaluation: () => crisis["debt_crisis"].value < 25 },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["debt_crisis"].value < 50,
          },
          {
            target: "extreme",
            evaluation: () => crisis["debt_crisis"].value >= 80,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["debt_crisis"].value < 80,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["tax_evasion"].value >= 30,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["tax_evasion"].value >= 50,
          },
          { target: "low", evaluation: () => crisis["tax_evasion"].value < 30 },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["tax_evasion"].value < 50,
          },
          {
            target: "extreme",
            evaluation: () => crisis["tax_evasion"].value >= 80,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["tax_evasion"].value < 80,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "endemic",
        transitions: [
          {
            target: "concerning",
            evaluation: () => crisis["infectious_disease"].value >= 25,
          },
        ],
      },
      {
        name: "concerning",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["infectious_disease"].value >= 50,
          },
          {
            target: "endemic",
            evaluation: () => crisis["infectious_disease"].value < 25,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "concerning",
            evaluation: () => crisis["infectious_disease"].value < 50,
          },
          {
            target: "pandemic",
            evaluation: () => crisis["infectious_disease"].value >= 70,
          },
        ],
      },
      {
        name: "pandemic",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["infectious_disease"].value < 70,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "endemic",
        transitions: [
          {
            target: "rising",
            evaluation: () => crisis["chronic_disease"].value >= 25,
          },
        ],
      },
      {
        name: "rising",
        transitions: [
          {
            target: "epidemic",
            evaluation: () => crisis["chronic_disease"].value >= 55,
          },
          {
            target: "endemic",
            evaluation: () => crisis["chronic_disease"].value < 25,
          },
        ],
      },
      {
        name: "epidemic",
        transitions: [
          {
            target: "rising",
            evaluation: () => crisis["chronic_disease"].value < 55,
          },
          {
            target: "extreme",
            evaluation: () => crisis["chronic_disease"].value >= 75,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "epidemic",
            evaluation: () => crisis["chronic_disease"].value < 75,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "rising",
            evaluation: () => crisis["mental_health_crisis"].value >= 35,
          },
        ],
      },
      {
        name: "rising",
        transitions: [
          {
            target: "epidemic",
            evaluation: () => crisis["mental_health_crisis"].value >= 55,
          },
          {
            target: "low",
            evaluation: () => crisis["mental_health_crisis"].value < 35,
          },
        ],
      },
      {
        name: "epidemic",
        transitions: [
          {
            target: "rising",
            evaluation: () => crisis["mental_health_crisis"].value < 55,
          },
          {
            target: "extreme",
            evaluation: () => crisis["mental_health_crisis"].value >= 85,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "epidemic",
            evaluation: () => crisis["mental_health_crisis"].value < 85,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "normal",
        transitions: [
          {
            target: "concerning",
            evaluation: () => crisis["healthcare_collapse"].value >= 40,
          },
        ],
      },
      {
        name: "concerning",
        transitions: [
          {
            target: "overcapacity",
            evaluation: () => crisis["healthcare_collapse"].value >= 60,
          },
          {
            target: "normal",
            evaluation: () => crisis["healthcare_collapse"].value < 40,
          },
        ],
      },
      {
        name: "overcapacity",
        transitions: [
          {
            target: "concerning",
            evaluation: () => crisis["healthcare_collapse"].value < 60,
          },
          {
            target: "collapse",
            evaluation: () => crisis["healthcare_collapse"].value >= 85,
          },
        ],
      },
      {
        name: "collapse",
        transitions: [
          {
            target: "overcapacity",
            evaluation: () => crisis["healthcare_collapse"].value < 85,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["health_worker_shortage"].value >= 40,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["health_worker_shortage"].value >= 60,
          },
          {
            target: "low",
            evaluation: () => crisis["health_worker_shortage"].value < 40,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["health_worker_shortage"].value < 60,
          },
          {
            target: "extreme",
            evaluation: () => crisis["health_worker_shortage"].value >= 85,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["health_worker_shortage"].value < 85,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["dropout_crisis"].value >= 30,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["dropout_crisis"].value >= 60,
          },
          {
            target: "low",
            evaluation: () => crisis["dropout_crisis"].value < 30,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["dropout_crisis"].value < 60,
          },
          {
            target: "extreme",
            evaluation: () => crisis["dropout_crisis"].value >= 90,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["dropout_crisis"].value < 90,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["low_education"].value >= 30,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["low_education"].value >= 55,
          },
          {
            target: "low",
            evaluation: () => crisis["low_education"].value < 30,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["low_education"].value < 55,
          },
          {
            target: "extreme",
            evaluation: () => crisis["low_education"].value >= 80,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["low_education"].value < 80,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["teacher_shortage"].value >= 40,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["teacher_shortage"].value >= 55,
          },
          {
            target: "low",
            evaluation: () => crisis["teacher_shortage"].value < 40,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["teacher_shortage"].value < 55,
          },
          {
            target: "extreme",
            evaluation: () => crisis["teacher_shortage"].value >= 80,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["teacher_shortage"].value < 80,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["technology_lag"].value >= 40,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["technology_lag"].value >= 55,
          },
          {
            target: "low",
            evaluation: () => crisis["technology_lag"].value < 40,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["technology_lag"].value < 55,
          },
          {
            target: "extreme",
            evaluation: () => crisis["technology_lag"].value >= 80,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["technology_lag"].value < 80,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          { target: "medium", evaluation: () => crisis["poverty"].value >= 30 },
        ],
      },
      {
        name: "medium",
        transitions: [
          { target: "high", evaluation: () => crisis["poverty"].value >= 55 },
          { target: "low", evaluation: () => crisis["poverty"].value < 30 },
        ],
      },
      {
        name: "high",
        transitions: [
          { target: "medium", evaluation: () => crisis["poverty"].value < 55 },
          {
            target: "extreme",
            evaluation: () => crisis["poverty"].value >= 90,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          { target: "high", evaluation: () => crisis["poverty"].value < 90 },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["discrimination"].value >= 30,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["discrimination"].value >= 60,
          },
          {
            target: "low",
            evaluation: () => crisis["discrimination"].value < 30,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["discrimination"].value < 60,
          },
          {
            target: "extreme",
            evaluation: () => crisis["discrimination"].value >= 75,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["discrimination"].value < 75,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["urban_overcrowding"].value >= 35,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["urban_overcrowding"].value >= 55,
          },
          {
            target: "low",
            evaluation: () => crisis["urban_overcrowding"].value < 35,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["urban_overcrowding"].value < 55,
          },
          {
            target: "extreme",
            evaluation: () => crisis["urban_overcrowding"].value >= 80,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["urban_overcrowding"].value < 80,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["housing_crisis"].value >= 30,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["housing_crisis"].value >= 60,
          },
          {
            target: "low",
            evaluation: () => crisis["housing_crisis"].value < 30,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["housing_crisis"].value < 60,
          },
          {
            target: "extreme",
            evaluation: () => crisis["housing_crisis"].value >= 85,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["housing_crisis"].value < 85,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["overpopulation"].value >= 35,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["overpopulation"].value >= 65,
          },
          {
            target: "low",
            evaluation: () => crisis["overpopulation"].value < 35,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["overpopulation"].value < 65,
          },
          {
            target: "extreme",
            evaluation: () => crisis["overpopulation"].value >= 85,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["overpopulation"].value < 85,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["pollution"].value >= 25,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          { target: "high", evaluation: () => crisis["pollution"].value >= 55 },
          { target: "low", evaluation: () => crisis["pollution"].value < 25 },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["pollution"].value < 55,
          },
          {
            target: "extreme",
            evaluation: () => crisis["pollution"].value >= 80,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          { target: "high", evaluation: () => crisis["pollution"].value < 80 },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["deforestation"].value >= 30,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["deforestation"].value >= 60,
          },
          {
            target: "low",
            evaluation: () => crisis["deforestation"].value < 30,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["deforestation"].value < 60,
          },
          {
            target: "extreme",
            evaluation: () => crisis["deforestation"].value >= 80,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["deforestation"].value < 80,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["overfishing"].value >= 30,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["overfishing"].value >= 60,
          },
          { target: "low", evaluation: () => crisis["overfishing"].value < 30 },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["overfishing"].value < 60,
          },
          {
            target: "extreme",
            evaluation: () => crisis["overfishing"].value >= 80,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["overfishing"].value < 80,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["biodiversity_loss"].value >= 30,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["biodiversity_loss"].value >= 55,
          },
          {
            target: "low",
            evaluation: () => crisis["biodiversity_loss"].value < 30,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["biodiversity_loss"].value < 55,
          },
          {
            target: "extreme",
            evaluation: () => crisis["biodiversity_loss"].value >= 85,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["biodiversity_loss"].value < 85,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["water_scarcity"].value >= 30,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["water_scarcity"].value >= 55,
          },
          {
            target: "low",
            evaluation: () => crisis["water_scarcity"].value < 30,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["water_scarcity"].value < 55,
          },
          {
            target: "extreme",
            evaluation: () => crisis["water_scarcity"].value >= 80,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["water_scarcity"].value < 80,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["mineral_scarcity"].value >= 35,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["mineral_scarcity"].value >= 60,
          },
          {
            target: "low",
            evaluation: () => crisis["mineral_scarcity"].value < 35,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["mineral_scarcity"].value < 60,
          },
          {
            target: "extreme",
            evaluation: () => crisis["mineral_scarcity"].value >= 85,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["mineral_scarcity"].value < 85,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["food_insecurity"].value >= 35,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["food_insecurity"].value >= 60,
          },
          {
            target: "low",
            evaluation: () => crisis["food_insecurity"].value < 35,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["food_insecurity"].value < 60,
          },
          {
            target: "extreme",
            evaluation: () => crisis["food_insecurity"].value >= 85,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["food_insecurity"].value < 85,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["infrastructure_inequality"].value >= 30,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["infrastructure_inequality"].value >= 50,
          },
          {
            target: "low",
            evaluation: () => crisis["infrastructure_inequality"].value < 30,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["infrastructure_inequality"].value < 50,
          },
          {
            target: "extreme",
            evaluation: () => crisis["infrastructure_inequality"].value >= 75,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["infrastructure_inequality"].value < 75,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["energy_crisis"].value >= 30,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["energy_crisis"].value >= 50,
          },
          {
            target: "low",
            evaluation: () => crisis["energy_crisis"].value < 30,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["energy_crisis"].value < 50,
          },
          {
            target: "extreme",
            evaluation: () => crisis["energy_crisis"].value >= 80,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["energy_crisis"].value < 80,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["skill_shortage"].value >= 30,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["skill_shortage"].value >= 50,
          },
          {
            target: "low",
            evaluation: () => crisis["skill_shortage"].value < 30,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["skill_shortage"].value < 50,
          },
          {
            target: "extreme",
            evaluation: () => crisis["skill_shortage"].value >= 80,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["skill_shortage"].value < 80,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["unemployment"].value >= 30,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["unemployment"].value >= 50,
          },
          {
            target: "low",
            evaluation: () => crisis["unemployment"].value < 30,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["unemployment"].value < 50,
          },
          {
            target: "extreme",
            evaluation: () => crisis["unemployment"].value >= 80,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["unemployment"].value < 80,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["job_loss"].value >= 25,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          { target: "high", evaluation: () => crisis["job_loss"].value >= 50 },
          { target: "low", evaluation: () => crisis["job_loss"].value < 25 },
        ],
      },
      {
        name: "high",
        transitions: [
          { target: "medium", evaluation: () => crisis["job_loss"].value < 50 },
          {
            target: "extreme",
            evaluation: () => crisis["job_loss"].value >= 70,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          { target: "high", evaluation: () => crisis["job_loss"].value < 70 },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["cyber_attack"].value >= 25,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["cyber_attack"].value >= 55,
          },
          {
            target: "low",
            evaluation: () => crisis["cyber_attack"].value < 25,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["cyber_attack"].value < 55,
          },
          {
            target: "extreme",
            evaluation: () => crisis["cyber_attack"].value >= 80,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["cyber_attack"].value < 80,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["terrorism"].value >= 25,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          { target: "high", evaluation: () => crisis["terrorism"].value >= 50 },
          { target: "low", evaluation: () => crisis["terrorism"].value < 25 },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["terrorism"].value < 50,
          },
          {
            target: "extreme",
            evaluation: () => crisis["terrorism"].value >= 75,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          { target: "high", evaluation: () => crisis["terrorism"].value < 75 },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["war_aggression"].value >= 35,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["war_aggression"].value >= 60,
          },
          {
            target: "low",
            evaluation: () => crisis["war_aggression"].value < 35,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["war_aggression"].value < 60,
          },
          {
            target: "extreme",
            evaluation: () => crisis["war_aggression"].value >= 85,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["war_aggression"].value < 85,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["separatist_groups"].value >= 35,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["separatist_groups"].value >= 60,
          },
          {
            target: "low",
            evaluation: () => crisis["separatist_groups"].value < 35,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["separatist_groups"].value < 60,
          },
          {
            target: "extreme",
            evaluation: () => crisis["separatist_groups"].value >= 85,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["separatist_groups"].value < 85,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["misinformation_spread"].value >= 30,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["misinformation_spread"].value >= 60,
          },
          {
            target: "low",
            evaluation: () => crisis["misinformation_spread"].value < 30,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["misinformation_spread"].value < 60,
          },
          {
            target: "extreme",
            evaluation: () => crisis["misinformation_spread"].value >= 80,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["misinformation_spread"].value < 80,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["media_bias"].value >= 30,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["media_bias"].value >= 60,
          },
          { target: "low", evaluation: () => crisis["media_bias"].value < 30 },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["media_bias"].value < 60,
          },
          {
            target: "extreme",
            evaluation: () => crisis["media_bias"].value >= 80,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          { target: "high", evaluation: () => crisis["media_bias"].value < 80 },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["political_instability"].value >= 30,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["political_instability"].value >= 60,
          },
          {
            target: "low",
            evaluation: () => crisis["political_instability"].value < 30,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["political_instability"].value < 60,
          },
          {
            target: "extreme",
            evaluation: () => crisis["political_instability"].value >= 80,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["political_instability"].value < 80,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["social_unrest"].value >= 30,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["social_unrest"].value >= 55,
          },
          {
            target: "low",
            evaluation: () => crisis["social_unrest"].value < 30,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["social_unrest"].value < 55,
          },
          {
            target: "extreme",
            evaluation: () => crisis["social_unrest"].value >= 75,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["social_unrest"].value < 75,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["conflicts"].value >= 30,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          { target: "high", evaluation: () => crisis["conflicts"].value >= 60 },
          { target: "low", evaluation: () => crisis["conflicts"].value < 30 },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["conflicts"].value < 60,
          },
          {
            target: "extreme",
            evaluation: () => crisis["conflicts"].value >= 75,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          { target: "high", evaluation: () => crisis["conflicts"].value < 75 },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["crime_violence"].value >= 30,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["crime_violence"].value >= 55,
          },
          {
            target: "low",
            evaluation: () => crisis["crime_violence"].value < 30,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["crime_violence"].value < 55,
          },
          {
            target: "extreme",
            evaluation: () => crisis["crime_violence"].value >= 75,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["crime_violence"].value < 75,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["black_market"].value >= 30,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["black_market"].value >= 55,
          },
          {
            target: "low",
            evaluation: () => crisis["black_market"].value < 30,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["black_market"].value < 55,
          },
          {
            target: "extreme",
            evaluation: () => crisis["black_market"].value >= 80,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["black_market"].value < 80,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["low_investment"].value >= 30,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["low_investment"].value >= 60,
          },
          {
            target: "low",
            evaluation: () => crisis["low_investment"].value < 30,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["low_investment"].value < 60,
          },
          {
            target: "extreme",
            evaluation: () => crisis["low_investment"].value >= 80,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["low_investment"].value < 80,
          },
        ],
      },
    ],
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
    states: [
      {
        name: "low",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["bankruptcies"].value >= 30,
          },
        ],
      },
      {
        name: "medium",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["bankruptcies"].value >= 65,
          },
          {
            target: "low",
            evaluation: () => crisis["bankruptcies"].value < 30,
          },
        ],
      },
      {
        name: "high",
        transitions: [
          {
            target: "medium",
            evaluation: () => crisis["bankruptcies"].value < 65,
          },
          {
            target: "extreme",
            evaluation: () => crisis["bankruptcies"].value >= 80,
          },
        ],
      },
      {
        name: "extreme",
        transitions: [
          {
            target: "high",
            evaluation: () => crisis["bankruptcies"].value < 80,
          },
        ],
      },
    ],
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

    initializeCrisisTexts(runtime);

    crisis[variable].states.forEach((crisisState) => {
      if (!initial) {
        initial = crisisState.name;
      }

      let transitions = [];
      crisisState.transitions.forEach((transition) => {
        transitions.push({
          target: transition.target,
          condition: {
            evaluate: transition.evaluation,
          },
        });
      });

      const state = {
        actions: {
          onEnter: () => {
            console.log(`Crisis ${variable} entering: ${crisisState.name}`);

            let crisisWarningTexts = runtime.objects.UIText.getAllInstances();
            const textID = variable + "_crisisWarning";
            const crisisWarningText = crisisWarningTexts.filter(
              (text) => text.instVars["id"] === textID
            )[0];

            console.log("shownCrisis", shownCrisis);
            if (crisis[variable].states.indexOf(crisisState) > 1) {
              console.log("Showing crisis");

              // If the crisis is not shown before, move the other crisis texts down
              // and add the crisis to the shown crisis list
              const element = shownCrisis.find(
                (element) => element.variable === variable
              );
              if (!element) {
                console.log("Moving other crisis down");
                crisisWarningText.y = 30;
                let y = 60;
                for (const otherCrisis of shownCrisis) {
                  console.log("otherCrisis", otherCrisis);
                  const otherText = crisisWarningTexts.filter(
                    (text) =>
                      text.instVars["id"] === otherCrisis.variable + "_crisisWarning"
                  )[0];
                  otherText.y = y;
                  y += 30;
                }

                shownCrisis.push({
                  variable: variable,
                  state: crisisState.name,
                });
              }

              crisisWarningText.text =
                variable.substring(0, 5) + ": " + crisisState.name;
              crisisWarningText.isVisible = true;
            } else {
              console.log("Removing crisis");
              const element = shownCrisis.find(
                (element) => element.variable === variable
              );
              if (element) {
                shownCrisis.splice(shownCrisis.indexOf(element), 1);
              }
              showCrisis(runtime, 30);

              crisisWarningText.isVisible = false;
            }
          },
        },
        transitions: transitions,
      };
      states[crisisState.name] = state;
    });

    const fsm = createMachine({
      initialState: initial,
      states: states,
    });

    crisisFsms[variable] = fsm;
  }
}

function initializeCrisisTexts(runtime) {
  const x = 1740;
  let y = 30;

  for (const variable in crisis) {
    const crisisText = runtime.objects.UIText.createInstance(
      "PanelCrisis",
      x,
      y
    );
    crisisText.text = variable.substring(0, 3) + ": " + shownCrisis[variable];
    crisisText.instVars["id"] = variable + "_crisisWarning";
    crisisText.isVisible = false;

    y += 30;
  }
}

/**
 * Update the crisis.
 * @param {string} variable The variable.
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

export function updateShownCrisis(runtime) {
  for (const crisis in shownCrisis) {
    let crisisText = runtime.objects.UIText.getAllInstances();
    crisisText = crisisText.filter(
      (text) => text.instVars["id"] === crisis + "_crisisWarning"
    )[0];

    if (!shownCrisis[crisis]) {
      crisisText.isVisible = false;

      continue;
    }
    crisisText.isVisible = true;
  }
}

function showCrisis(runtime, initialY) {
  let crisisTexts = runtime.objects.UIText.getAllInstances();
  for (const crisis of shownCrisis) {
    let crisisText = crisisTexts.filter(
      (text) => text.instVars["id"] === crisis.variable + "_crisisWarning"
    )[0];
    crisisText.y = initialY;
    initialY += 30;
  }
}
