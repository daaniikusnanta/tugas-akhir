import { createMachine } from "./fsm.js";
import { status } from "./status-data.js";
import {
  addTextToCache,
  getObjectbyId,
  getTextById,
  resetScrollablePosition,
  setScrollableHeight,
} from "./utils.js";
import { policy } from "./policy-data.js";

/**
 * @typedef {{
 *      [key: string]: () => boolean,
 * }} Transition
 */

/**
 * @typedef {{
 *     cause: string,
 *     yIntercept: number,
 *     inertia: number,
 *     factor: number,
 *     formula: function(),
 * }} Cause
 */

/**
 * @type {{
 * [key: string]: {
 *     name: string,
 *    description: string,
 *      value: number,
 *     causeValue: number,
 *    policyValue: number,
 * lastUpdateCause: number,
 * lastUpdatePolicy: number,
 *      type: string,
 *      isGlobal: boolean,
 *      thresholds: number[],
 *      states: State[],
 *      transitions: Transition[],
 *      causes: Cause[],
 *      lastUpdate: number
 * }}}
 */
export let crisis = {
  inflation: {
    name: "Inflation",
    description:
      "A general increase in prices and fall in the purchasing value of money.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "finance",
    isGlobal: true,
    thresholds: [30, 50, 70],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () =>
        crisisFsms["recession"].value != crisis["recession"].states[2] &&
        crisisFsms["recession"].value != crisis["recession"].states[3],
      hyperinflation: () =>
        crisisFsms["recession"].value != crisis["recession"].states[3],
    },
    causes: [
      {
        cause: "taxes",
        yIntercept: -0.2,
        factor: 0.1,
        inertia: 0,
        formula: function () {
          return this.yIntercept + (status["taxes"].value / 100) * this.factor;
        },
      },
      {
        cause: "economy",
        yIntercept: -0.2,
        factor: 0.1,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (status["economy"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "wage_income",
        yIntercept: -0.15,
        factor: 0.3,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (status["wage_income"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "security",
        yIntercept: 0.1,
        factor: -0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (status["security"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "debt_crisis",
        yIntercept: 0,
        factor: 0.1,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (crisis["debt_crisis"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  recession: {
    name: "Recession",
    description:
      "A period of temporary economic decline during which trade and industrial activity are reduced, generally identified by a fall in GDP in two successive quarters.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "finance",
    isGlobal: true,
    thresholds: [35, 60, 80],
    states: ["low", "medium", "recession", "depression"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () => true,
      extreme: () => true,
    },
    causes: [
      {
        cause: "investment",
        yIntercept: 0.1,
        factor: -0.25,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (status["investment"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "inflation",
        yIntercept: 0.2,
        factor: 0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (crisis["inflation"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  debt_crisis: {
    name: "Debt Crisis",
    description:
      "A situation in which a country is unable to pay back its government debt. It is usually the result of a weak economy and lax fiscal discipline.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "finance",
    isGlobal: true,
    thresholds: [25, 50, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () =>
        crisisFsms["recession"].value != crisis["recession"].states[2] &&
        crisisFsms["recession"].value != crisis["recession"].states[3],
      extreme: () =>
        crisisFsms["recession"].value != crisis["recession"].states[3],
    },
    causes: [
      {
        cause: "debt",
        yIntercept: -0.5,
        factor: 0.7,
        inertia: 0,
        formula: function () {
          return this.yIntercept + (status["debt"].value / 100) * this.factor;
        },
      },
    ],
  },
  tax_evasion: {
    name: "Tax Evasion",
    description:
      "The illegal evasion of taxes by individuals, corporations, and trusts.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "finance",
    isGlobal: true,
    thresholds: [30, 50, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () => true,
      extreme: () => true,
    },
    causes: [
      {
        cause: "taxes",
        yIntercept: -0.3,
        factor: 0.6,
        inertia: 0,
        formula: function () {
          return this.yIntercept + (status["taxes"].value / 100) * this.factor;
        },
      },
    ],
  },
  infectious_disease: {
    name: "Infectious Disease",
    description:
      "A disease caused by a pathogen and spread from one person to another.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "health",
    isGlobal: false,
    thresholds: [25, 50, 70],
    states: ["endemic", "medium", "epidemic", "pandemic"],
    transitions: {
      endemic: () => true,
      medium: () => true,
      epidemic: () => true,
      pandemic: () => true,
    },
    causes: [
      {
        cause: "disease_control",
        yIntercept: 0,
        factor: -0.5,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["disease_control"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "healthcare_system",
        yIntercept: 0.1,
        factor: -0.3,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["healthcare_system"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "mental_health_crisis",
        yIntercept: 0,
        factor: 0.05,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["mental_health_crisis"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "urban_overcrowding",
        yIntercept: -0.2,
        factor: 0.15,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["urban_overcrowding"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "pollution",
        yIntercept: -0.2,
        factor: 0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (crisis["pollution"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "water_scarcity",
        yIntercept: -0.1,
        factor: 0.15,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["water_scarcity"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "food_insecurity",
        yIntercept: -0.1,
        factor: 0.15,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["food_insecurity"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  chronic_disease: {
    name: "Chronic Disease",
    description:
      "A disease that persists for a long time and typically cannot be cured completely.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "health",
    isGlobal: false,
    thresholds: [25, 55, 75],
    states: ["endemic", "concerning", "epidemic", "extreme"],
    transitions: {
      endemic: () => true,
      concerning: () => true,
      epidemic: () => true,
      extreme: () => true,
    },
    causes: [
      {
        cause: "disease_control",
        yIntercept: 0.1,
        factor: -0.25,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["disease_control"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "public_health",
        yIntercept: 0.1,
        factor: -0.4,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["public_health"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "healthcare_system",
        yIntercept: 0.5,
        factor: -0.3,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["healthcare_system"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "work_environment",
        yIntercept: 0.05,
        factor: -0.1,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["work_environment"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "pollution",
        yIntercept: 0,
        factor: 0.15,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (crisis["pollution"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "water_scarcity",
        yIntercept: 0,
        factor: 0.05,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["water_scarcity"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "food_insecurity",
        yIntercept: -0.1,
        factor: 0.1,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["food_insecurity"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  mental_health_crisis: {
    name: "Mental Health Crisis",
    description:
      "A mental health crisis is a non-medical term used to describe mental health problems that have escalated to a point where immediate action is required.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "health",
    isGlobal: false,
    thresholds: [35, 55, 85],
    states: ["low", "rising", "epidemic", "extreme"],
    transitions: {
      low: () => true,
      rising: () => true,
      epidemic: () => true,
      extreme: () => true,
    },
    causes: [
      {
        cause: "public_health",
        yIntercept: -0.1,
        factor: -0.35,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["public_health"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "tourism_creative",
        yIntercept: -0.05,
        factor: -0.15,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["tourism_creative"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "inflation",
        yIntercept: 0.1,
        factor: 0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (crisis["inflation"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "poverty",
        yIntercept: 0.1,
        factor: 0.25,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (crisis["poverty"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "unemployment",
        yIntercept: -0.1,
        factor: 0.1,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (crisis["unemployment"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "job_loss",
        yIntercept: 0.05,
        factor: -0.15,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (crisis["job_loss"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  healthcare_collapse: {
    name: "Healthcare Collapse",
    description:
      "A healthcare collapse is a situation where the healthcare system is unable to provide care for all patients.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "health",
    isGlobal: true,
    thresholds: [40, 60, 85],
    states: ["normal", "concerning", "overcapacity", "collapse"],
    transitions: {
      normal: () => true,
      concerning: () => true,
      overcapacity: () => true,
      collapse: () => true,
    },
    causes: [
      {
        cause: "healthcare_system",
        yIntercept: 0.5,
        factor: -0.8,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["healthcare_system"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "infectious_disease",
        yIntercept: -0.25,
        factor: 0.15,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["infectious_disease"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "chronic_disease",
        yIntercept: -0.2,
        factor: 0.1,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["chronic_disease"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  health_worker_shortage: {
    name: "Health Worker Shortage",
    description:
      "A health worker shortage is a situation where there are not enough health workers to provide care for all patients.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "health",
    isGlobal: true,
    thresholds: [40, 60, 85],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () =>
        crisisFsms["healthcare_collapse"].value !=
          crisis["healthcare_collapse"].states[2] &&
        crisisFsms["healthcare_collapse"].value !=
          crisis["healthcare_collapse"].states[3],
      extreme: () =>
        crisisFsms["healthcare_collapse"].value !=
        crisis["healthcare_collapse"].states[3],
    },
    causes: [
      {
        cause: "health_workers",
        yIntercept: 0.5,
        factor: -0.6,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["health_workers"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "productive_workers",
        yIntercept: 0.3,
        factor: -0.4,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["productive_workers"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  dropout_crisis: {
    name: "Dropout Crisis",
    description:
      "A dropout crisis is a situation where a large number of students are not attending school.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "education",
    isGlobal: false,
    thresholds: [30, 50, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () => true,
      extreme: () => true,
    },
    causes: [
      {
        cause: "education_system",
        yIntercept: 0.1,
        factor: -0.4,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["education_system"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "poverty",
        yIntercept: 0.1,
        factor: 0.3,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (crisis["poverty"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  low_education: {
    name: "Low Education",
    description:
      "Low education is a situation where a large number of students are not attending school.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "education",
    isGlobal: false,
    thresholds: [30, 55, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () => true,
      extreme: () => true,
    },
    causes: [
      {
        cause: "education_system",
        yIntercept: 0.8,
        factor: -1.0,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["education_system"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "teachers",
        yIntercept: 0.4,
        factor: -0.4,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (status["teachers"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  teacher_shortage: {
    name: "Teacher Shortage",
    description:
      "A teacher shortage is a situation where there are not enough teachers to provide education for all students.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "education",
    isGlobal: true,
    thresholds: [40, 55, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () =>
        crisisFsms["low_education"].value !=
          crisis["low_education"].states[2] &&
        crisisFsms["low_education"].value != crisis["low_education"].states[3],
      extreme: () =>
        crisisFsms["low_education"].value != crisis["low_education"].states[3],
    },
    causes: [
      {
        cause: "teachers",
        yIntercept: 0.4,
        factor: -0.6,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (status["teachers"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "skill_shortage",
        yIntercept: 0.1,
        factor: 0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["skill_shortage"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  technology_lag: {
    name: "Technology Lag",
    description:
      "Technology lag is a situation where the technology used in schools is outdated.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "education",
    isGlobal: true,
    thresholds: [40, 55, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () => true,
      extreme: () => true,
    },
    causes: [
      {
        cause: "research",
        yIntercept: 1.0,
        factor: -1.0,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (status["research"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  poverty: {
    name: "Poverty",
    description:
      "Poverty is a situation where a large number of people are living in poverty.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "social",
    isGlobal: false,
    thresholds: [30, 55, 75],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () => true,
      extreme: () => true,
    },
    causes: [
      {
        cause: "social_security",
        yIntercept: 0,
        factor: 0,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["social_security"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "recession",
        yIntercept: 0,
        factor: 0,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (crisis["recession"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "discrimination",
        yIntercept: 0,
        factor: 0,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["discrimination"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  discrimination: {
    name: "Discrimination",
    description:
      "Discrimination is a situation where a large number of people are discriminated against.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "social",
    isGlobal: true,
    thresholds: [30, 55, 75],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () => true,
      extreme: () => true,
    },
    causes: [
      {
        cause: "empowerment",
        yIntercept: 0.05,
        factor: -0.4,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (status["empowerment"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "justice_system",
        yIntercept: -0.01,
        factor: -0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["justice_system"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "media_bias",
        yIntercept: 0.1,
        factor: 0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (crisis["media_bias"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "misinformation_spread",
        yIntercept: 0,
        factor: 0.15,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["misinformation_spread"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  urban_overcrowding: {
    name: "Urban Overcrowding",
    description:
      "Urban overcrowding is a situation where a large number of people are living in overcrowded cities.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "social",
    isGlobal: false,
    thresholds: [35, 55, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () =>
        crisisFsms["poverty"].value != crisis["poverty"].states[2] &&
        crisisFsms["poverty"].value != crisis["poverty"].states[3],
      extreme: () => crisisFsms["poverty"].value != crisis["poverty"].states[3],
    },
    causes: [
      {
        cause: "water_land",
        yIntercept: -0.1,
        factor: -0.3,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (status["water_land"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "transportation",
        yIntercept: 0.1,
        factor: -0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["transportation"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "urban_housing",
        yIntercept: 0.15,
        factor: -0.35,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["urban_housing"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "overpopulation",
        yIntercept: 0.05,
        factor: 0.25,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["overpopulation"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  housing_crisis: {
    name: "Housing Crisis",
    description:
      "Housing crisis is a situation where a large number of people are living in inadequate housing.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "social",
    isGlobal: false,
    thresholds: [30, 60, 85],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () => true,
      extreme: () => true,
    },
    causes: [
      {
        cause: "social_security",
        yIntercept: 0.15,
        factor: -0.4,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["social_security"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "water_land",
        yIntercept: 0.1,
        factor: -0.25,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (status["water_land"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "urban_housing",
        yIntercept: 0.1,
        factor: -0.35,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["urban_housing"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  overpopulation: {
    name: "Overpopulation",
    description:
      "Overpopulation is a situation where a large number of people are living in a small area.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "social",
    isGlobal: true,
    thresholds: [35, 65, 85],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () =>
        crisisFsms["recession"].value != crisis["recession"].states[2] &&
        crisisFsms["recession"].value != crisis["recession"].states[3] &&
        crisisFsms["war_aggression"].value !=
          crisis["war_aggression"].states[2] &&
        crisisFsms["war_aggression"].value !=
          crisis["war_aggression"].states[3],
      extreme: () =>
        crisisFsms["recession"].value != crisis["recession"].states[3] &&
        crisisFsms["war_aggression"].value !=
          crisis["war_aggression"].states[3],
    },
    causes: [
      {
        cause: "population_control",
        yIntercept: 0.8,
        factor: -1.0,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["population_control"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  pollution: {
    name: "Pollution",
    description:
      "Pollution is a situation where the environment is contaminated with harmful substances.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "environment",
    isGlobal: false,
    thresholds: [25, 55, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () => true,
      extreme: () => true,
    },
    causes: [
      {
        cause: "pollution_control",
        yIntercept: 0.4,
        factor: -0.5,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["pollution_control"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "forest",
        yIntercept: 0.1,
        factor: -0.25,
        inertia: 0,
        formula: function () {
          return this.yIntercept + (status["forest"].value / 100) * this.factor;
        },
      },
      {
        cause: "marine",
        yIntercept: 0.15,
        factor: -0.3,
        inertia: 0,
        formula: function () {
          return this.yIntercept + (status["marine"].value / 100) * this.factor;
        },
      },
      {
        cause: "sustainability",
        yIntercept: 0.05,
        factor: -0.4,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["sustainability"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  deforestation: {
    name: "Deforestation",
    description:
      "Deforestation is a situation where a large area of forest is destroyed.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "environment",
    isGlobal: false,
    thresholds: [30, 60, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () => true,
      extreme: () => true,
    },
    causes: [
      {
        cause: "forest",
        yIntercept: 0.1,
        factor: -0.4,
        inertia: 0,
        formula: function () {
          return this.yIntercept + (status["forest"].value / 100) * this.factor;
        },
      },
      {
        cause: "sustainability",
        yIntercept: 0.1,
        factor: -0.3,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["sustainability"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "overpopulation",
        yIntercept: 0.05,
        factor: 0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["overpopulation"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  overfishing: {
    name: "Overfishing",
    description:
      "Overfishing is a situation where fish are caught faster than they can reproduce.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "environment",
    isGlobal: true,
    thresholds: [30, 60, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () => true,
      extreme: () => true,
    },
    causes: [
      {
        cause: "fisheries",
        yIntercept: -0.1,
        factor: 0.3,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (status["fisheries"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "sustainability",
        yIntercept: 0.05,
        factor: -0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["sustainability"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  biodiversity_loss: {
    name: "Biodiversity Loss",
    description:
      "Biodiversity loss is a situation where the variety of life on Earth is decreasing.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "environment",
    isGlobal: true,
    thresholds: [30, 55, 85],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () =>
        crisisFsms["deforestation"].value !=
          crisis["deforestation"].states[2] &&
        crisisFsms["deforestation"].value !=
          crisis["deforestation"].states[3] &&
        crisisFsms["overfishing"].value != crisis["overfishing"].states[2] &&
        crisisFsms["overfishing"].value != crisis["overfishing"].states[3] &&
        crisisFsms["water_scarcity"].value !=
          crisis["water_scarcity"].states[2] &&
        crisisFsms["water_scarcity"].value !=
          crisis["water_scarcity"].states[3] &&
        crisisFsms["food_insecurity"].value !=
          crisis["food_insecurity"].states[2] &&
        crisisFsms["food_insecurity"].value !=
          crisis["food_insecurity"].states[3],
      extreme: () =>
        crisisFsms["deforestation"].value !=
          crisis["deforestation"].states[3] &&
        crisisFsms["overfishing"].value != crisis["overfishing"].states[3] &&
        crisisFsms["water_scarcity"].value !=
          crisis["water_scarcity"].states[3] &&
        crisisFsms["food_insecurity"].value !=
          crisis["food_insecurity"].states[3],
    },
    causes: [
      {
        cause: "biodiversity",
        yIntercept: 0.8,
        factor: -1.0,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (status["biodiversity"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  water_scarcity: {
    name: "Water Scarcity",
    description:
      "Water scarcity is a situation where the demand for water is greater than the available supply.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "nature",
    isGlobal: false,
    thresholds: [30, 55, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () => true,
      extreme: () => true,
    },
    causes: [
      {
        cause: "forest",
        yIntercept: 0.1,
        factor: -0.25,
        inertia: 0,
        formula: function () {
          return this.yIntercept + (status["forest"].value / 100) * this.factor;
        },
      },
      {
        cause: "marine",
        yIntercept: 0.15,
        factor: -0.2,
        inertia: 0,
        formula: function () {
          return this.yIntercept + (status["marine"].value / 100) * this.factor;
        },
      },
      {
        cause: "water_land",
        yIntercept: 0.2,
        factor: -0.35,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (status["water_land"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  mineral_scarcity: {
    name: "Mineral Scarcity",
    description:
      "Mineral scarcity is a situation where the demand for minerals is greater than the available supply.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "nature",
    isGlobal: true,
    thresholds: [35, 60, 85],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () =>
        crisisFsms["food_insecurity"].value !=
          crisis["food_insecurity"].states[2] &&
        crisisFsms["food_insecurity"].value !=
          crisis["food_insecurity"].states[3],
      extreme: () =>
        crisisFsms["food_insecurity"].value !=
        crisis["food_insecurity"].states[3],
    },
    causes: [
      {
        cause: "mineral_oil",
        yIntercept: 0.15,
        factor: -0.35,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (status["mineral_oil"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  food_insecurity: {
    name: "Food Insecurity",
    description:
      "Food insecurity is a situation where people lack access to sufficient amounts of affordable, nutritious food.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "nature",
    isGlobal: false,
    thresholds: [35, 60, 85],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () => true,
      extreme: () => true,
    },
    causes: [
      {
        cause: "food_sources",
        yIntercept: 0.15,
        factor: -0.35,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (status["food_sources"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "agriculture",
        yIntercept: 0.2,
        factor: -0.4,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (status["agriculture"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "fisheries",
        yIntercept: 0.15,
        factor: -0.35,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (status["fisheries"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  infrastructure_inequality: {
    name: "Infrastructure Inequality",
    description:
      "Infrastructure inequality is a situation where the infrastructure of a country is not equally distributed among its population.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "infrastructure",
    isGlobal: false,
    thresholds: [30, 50, 75],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () =>
        crisisFsms["energy_crisis"].value !=
          crisis["energy_crisis"].states[2] &&
        crisisFsms["energy_crisis"].value != crisis["energy_crisis"].states[3],
      extreme: () =>
        crisisFsms["energy_crisis"].value != crisis["energy_crisis"].states[3],
    },
    causes: [
      {
        cause: "communication_information",
        yIntercept: 0.15,
        factor: -0.35,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["communication_information"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "transportation",
        yIntercept: 0.15,
        factor: -0.35,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["transportation"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  energy_crisis: {
    name: "Energy Crisis",
    description:
      "Energy crisis is a situation where the demand for energy is greater than the available supply.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "infrastructure",
    isGlobal: false,
    thresholds: [30, 50, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () => true,
      extreme: () => true,
    },
    causes: [
      {
        cause: "mineral_oil_industry",
        yIntercept: 0.05,
        factor: -0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["mineral_oil_industry"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "power_energy",
        yIntercept: 0.85,
        factor: -1.0,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (status["power_energy"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  skill_shortage: {
    name: "Skill Shortage",
    description:
      "Skill shortage is a situation where the demand for a certain skill is greater than the available supply.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "labor",
    isGlobal: true,
    thresholds: [30, 50, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () =>
        crisisFsms["low_education"].value !=
          crisis["low_education"].states[2] &&
        crisisFsms["low_education"].value !=
          crisis["low_education"].states[3] &&
        crisisFsms["low_investment"].value !=
          crisis["low_investment"].states[2] &&
        crisisFsms["low_investment"].value !=
          crisis["low_investment"].states[3],
      extreme: () =>
        crisisFsms["low_education"].value !=
          crisis["low_education"].states[3] &&
        crisisFsms["low_investment"].value !=
          crisis["low_investment"].states[3],
    },
    causes: [
      {
        cause: "low_education",
        yIntercept: -0.1,
        factor: 0.3,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["low_education"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "dropout_crisis",
        yIntercept: -0.05,
        factor: 0.15,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["dropout_crisis"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "discrimination",
        yIntercept: 0,
        factor: 0.1,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["discrimination"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  unemployment: {
    name: "Unemployment",
    description:
      "Unemployment is a situation where people who are willing to work are unable to find a job.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "labor",
    isGlobal: true,
    thresholds: [30, 50, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () => true,
      extreme: () => true,
    },
    causes: [
      {
        cause: "empowerment",
        yIntercept: 0.1,
        factor: -0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (status["empowerment"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "security",
        yIntercept: 0.05,
        factor: -0.15,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (status["security"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "manufacturing",
        yIntercept: 0.05,
        factor: -0.3,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["manufacturing"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "tourism_creative",
        yIntercept: 0.05,
        factor: -0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["tourism_creative"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "low_education",
        yIntercept: -0.2,
        factor: 0.3,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["low_education"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "dropout_crisis",
        yIntercept: -0.1,
        factor: 0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["dropout_crisis"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  job_loss: {
    name: "Job Loss",
    description:
      "Job loss is a situation where people lose their jobs due to economic downturns.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "labor",
    isGlobal: true,
    thresholds: [25, 50, 70],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () =>
        crisisFsms["unemployment"].value != crisis["unemployment"].states[2] &&
        crisisFsms["unemployment"].value != crisis["unemployment"].states[3],
      extreme: () =>
        crisisFsms["unemployment"].value != crisis["unemployment"].states[3],
    },
    causes: [
      {
        cause: "wage_income",
        yIntercept: 0.15,
        factor: -0.25,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (status["wage_income"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "work_environment",
        yIntercept: 0.1,
        factor: -0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["work_environment"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "jobs",
        yIntercept: 0.15,
        factor: -0.4,
        inertia: 0,
        formula: function () {
          return this.yIntercept + (status["jobs"].value / 100) * this.factor;
        },
      },
      {
        cause: "security",
        yIntercept: 0.05,
        factor: -0.15,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (status["security"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "infectious_disease",
        yIntercept: 0.05,
        factor: 0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["infectious_disease"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  cyber_attack: {
    name: "Cyber Attack",
    description:
      "Cyber attacks are malicious attempts to damage or disrupt a computer network or system.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "defense",
    isGlobal: true,
    thresholds: [25, 55, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () => true,
      extreme: () => true,
    },
    causes: [
      {
        cause: "defense_infrastructure",
        yIntercept: 0.05,
        factor: -0.3,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["defense_infrastructure"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "foreign_relations",
        yIntercept: 0.1,
        factor: -0.4,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["foreign_relations"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  terrorism: {
    name: "Terrorism",
    description: "Terrorism",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "defense",
    isGlobal: false,
    thresholds: [25, 50, 75],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () =>
        crisisFsms["war_aggression"].value !=
          crisis["war_aggression"].states[2] &&
        crisisFsms["war_aggression"].value !=
          crisis["war_aggression"].states[3],
      extreme: () =>
        crisisFsms["war_aggression"].value !=
        crisis["war_aggression"].states[3],
    },
    causes: [
      {
        cause: "foreign_relations",
        yIntercept: 0.1,
        factor: -0.4,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["foreign_relations"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "defense_infrastructure",
        yIntercept: -0.1,
        factor: -0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["defense_infrastructure"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "defense_force",
        yIntercept: 0.15,
        factor: -0.3,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["defense_force"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  war_aggression: {
    name: "War and Aggression",
    description: "War and aggression are armed conflicts between nations.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "defense",
    isGlobal: false,
    thresholds: [35, 60, 85],
    states: ["low", "medium", "aggression", "war"],
    transitions: {
      low: () => true,
      medium: () => true,
      aggression: () => true,
      war: () => true,
    },
    causes: [
      {
        cause: "foreign_relations",
        yIntercept: 0.5,
        factor: -0.6,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["foreign_relations"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "defense_force",
        yIntercept: 0.2,
        factor: -0.4,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["defense_force"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  separatist_groups: {
    name: "Separatist Groups",
    description:
      "Separatist groups are groups of people who want to establish a new state or separate part of a state from the rest of the country.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "defense",
    isGlobal: false,
    thresholds: [35, 60, 85],
    states: ["low", "threat", "small", "extreme"],
    transitions: {
      low: () => true,
      threat: () => true,
      small: () =>
        crisisFsms["war_aggression"].value !=
          crisis["war_aggression"].states[2] &&
        crisisFsms["war_aggression"].value !=
          crisis["war_aggression"].states[3],
      extreme: () =>
        crisisFsms["war_aggression"].value !=
        crisis["war_aggression"].states[3],
    },
    causes: [
      {
        cause: "water_land",
        yIntercept: 0.05,
        factor: -0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (status["water_land"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "foreign_relations",
        yIntercept: 0.2,
        factor: -0.45,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["foreign_relations"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "poverty",
        yIntercept: 0,
        factor: 0.15,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (crisis["poverty"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "overpopulation",
        yIntercept: 0,
        factor: 0.1,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["overpopulation"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "media_bias",
        yIntercept: 0,
        factor: 0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (crisis["media_bias"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  misinformation_spread: {
    name: "Misinformation Spread",
    description: "Misinformation spread is the spread of false information.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "stability",
    isGlobal: true,
    thresholds: [30, 60, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () => true,
      extreme: () => true,
    },
    causes: [
      {
        cause: "media_neutrality",
        yIntercept: 0,
        factor: -0.3,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["media_neutrality"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "communication_information",
        yIntercept: -0.05,
        factor: -0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["communication_information"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "poverty",
        yIntercept: 0,
        factor: 0.15,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (crisis["poverty"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "low_education",
        yIntercept: 0.1,
        factor: 0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["low_education"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "unemployment",
        yIntercept: -0.1,
        factor: 0.15,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (crisis["unemployment"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  media_bias: {
    name: "Media Bias",
    description:
      "Media bias is the bias or perceived bias of journalists and news producers within the mass media in the selection of many events and stories that are reported and how they are covered.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "stability",
    isGlobal: true,
    thresholds: [30, 60, 80],
    states: ["neutral", "medium", "high", "extreme"],
    transitions: {
      neutral: () => true,
      medium: () => true,
      high: () => true,
      extreme: () => true,
    },
    causes: [
      {
        cause: "communication_information",
        yIntercept: 0.1,
        factor: -0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["communication_information"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "media_neutrality",
        yIntercept: 0.1,
        factor: -0.4,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["media_neutrality"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "social_unrest",
        yIntercept: 0.05,
        factor: 0.1,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["social_unrest"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  political_instability: {
    name: "Political Instability",
    description:
      "Political instability is the propensity for regime or government change, political upheaval, or violence in society, or instability and uncertainty in government policy, such as regulatory, tax, property, or human rights law.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "stability",
    isGlobal: true,
    thresholds: [30, 60, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () =>
        crisisFsms["social_unrest"].value !=
          crisis["social_unrest"].states[2] &&
        crisisFsms["social_unrest"].value !=
          crisis["social_unrest"].states[3] &&
        crisisFsms["war_aggression"].value !=
          crisis["war_aggression"].states[2] &&
        crisisFsms["war_aggression"].value !=
          crisis["war_aggression"].states[3],
      extreme: () =>
        crisisFsms["social_unrest"].value !=
          crisis["social_unrest"].states[3] &&
        crisisFsms["war_aggression"].value !=
          crisis["war_aggression"].states[3],
    },
    causes: [
      {
        cause: "governance",
        yIntercept: 0.45,
        factor: -0.7,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (status["governance"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "misinformation_spread",
        yIntercept: 0.05,
        factor: 0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["misinformation_spread"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  social_unrest: {
    name: "Social Unrest",
    description:
      "Social unrest is a symptom of a problem in society, rather than a problem in itself. It is usually caused by a group of people who believe that their rights have been violated. It is a reaction to real or perceived injustices, wrongs or unfair treatment.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "stability",
    isGlobal: false,
    thresholds: [30, 55, 75],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () =>
        crisisFsms["war_aggression"].value !=
          crisis["war_aggression"].states[2] &&
        crisisFsms["war_aggression"].value !=
          crisis["war_aggression"].states[3],
      extreme: () =>
        crisisFsms["war_aggression"].value !=
        crisis["war_aggression"].states[3],
    },
    causes: [
      {
        cause: "recession",
        yIntercept: -0.1,
        factor: 0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (crisis["recession"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "infectious_disease",
        yIntercept: 0,
        factor: -0.1,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["infectious_disease"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "water_scarcity",
        yIntercept: -0.05,
        factor: 0.1,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["water_scarcity"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "infrastructure_inequality",
        yIntercept: -0.05,
        factor: 0.1,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["infrastructure_inequality"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "energy_crisis",
        yIntercept: -0.05,
        factor: 0.15,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["energy_crisis"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "unemployment",
        yIntercept: -0.05,
        factor: 0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (crisis["unemployment"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "political_instability",
        yIntercept: -0.1,
        factor: 0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["political_instability"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  conflicts: {
    name: "Conflicts",
    description:
      "A conflict is a serious disagreement or argument, typically a protracted one.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "stability",
    isGlobal: false,
    thresholds: [30, 60, 75],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () =>
        crisisFsms["war_aggression"].value !=
          crisis["war_aggression"].states[2] &&
        crisisFsms["war_aggression"].value !=
          crisis["war_aggression"].states[3],
      extreme: () =>
        crisisFsms["war_aggression"].value !=
        crisis["war_aggression"].states[3],
    },
    causes: [
      {
        cause: "justice_system",
        yIntercept: 0.1,
        factor: -0.3,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["justice_system"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "discrimination",
        yIntercept: -0.1,
        factor: 0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["discrimination"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "poverty",
        yIntercept: -0.1,
        factor: 0.1,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (crisis["poverty"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "misinformation_spread",
        yIntercept: -0.05,
        factor: 0.15,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["misinformation_spread"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "media_bias",
        yIntercept: -0.05,
        factor: 0.15,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (crisis["media_bias"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  crime_violence: {
    name: "Crime and Violence",
    description:
      "Crime is any act or behaviour which breaks the law. Violence is the use of physical force to injure people or property.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "stability",
    isGlobal: false,
    thresholds: [30, 55, 75],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () =>
        crisisFsms["war_aggression"].value !=
          crisis["war_aggression"].states[2] &&
        crisisFsms["war_aggression"].value !=
          crisis["war_aggression"].states[3],
      extreme: () =>
        crisisFsms["war_aggression"].value !=
        crisis["war_aggression"].states[3],
    },
    causes: [
      {
        cause: "jobs",
        yIntercept: 0,
        factor: -0.25,
        inertia: 0,
        formula: function () {
          return this.yIntercept + (status["jobs"].value / 100) * this.factor;
        },
      },
      {
        cause: "justice_system",
        yIntercept: -0.3,
        factor: 0.5,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["justice_system"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "discrimination",
        yIntercept: -0.1,
        factor: 0.25,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["discrimination"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "poverty",
        yIntercept: -0.05,
        factor: 0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (crisis["poverty"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "media_bias",
        yIntercept: 0.1,
        factor: 0.1,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (crisis["media_bias"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "unemployment",
        yIntercept: 0,
        factor: 0.1,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (crisis["unemployment"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "black_market",
        yIntercept: -0.05,
        factor: 0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (crisis["black_market"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "food_insecurity",
        yIntercept: -0.05,
        factor: 0.1,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["food_insecurity"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  black_market: {
    name: "Black Market",
    description: "The black market is the trade of illegal goods and services.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "industry",
    isGlobal: true,
    thresholds: [30, 55, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () =>
        crisisFsms["recession"].value != crisis["recession"].states[2] &&
        crisisFsms["recession"].value != crisis["recession"].states[3],
      extreme: () =>
        crisisFsms["recession"].value != crisis["recession"].states[3],
    },
    causes: [
      {
        cause: "transportation",
        yIntercept: -0.2,
        factor: -0.3,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["transportation"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "tax_evasion",
        yIntercept: -0.05,
        factor: 0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (crisis["tax_evasion"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "inflation",
        yIntercept: 0.05,
        factor: 0.2,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (crisis["inflation"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  low_investment: {
    name: "Low Investment",
    description: "Low investment is a lack of investment in the economy.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "industry",
    isGlobal: true,
    thresholds: [30, 60, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () =>
        crisisFsms["recession"].value != crisis["recession"].states[2] &&
        crisisFsms["recession"].value != crisis["recession"].states[3] &&
        crisisFsms["bankruptcies"].value != crisis["bankruptcies"].states[2] &&
        crisisFsms["bankruptcies"].value != crisis["bankruptcies"].states[3],
      extreme: () =>
        crisisFsms["recession"].value != crisis["recession"].states[3] &&
        crisisFsms["bankruptcies"].value != crisis["bankruptcies"].states[3],
    },
    causes: [
      {
        cause: "investment",
        yIntercept: 0.6,
        factor: -0.7,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (status["investment"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "productive_workers",
        yIntercept: 0.2,
        factor: -0.3,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (status["productive_workers"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "infrastructure_inequality",
        yIntercept: 0.1,
        factor: -0.15,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["infrastructure_inequality"].value / 100) * this.factor
          );
        },
      },
    ],
  },
  bankruptcies: {
    name: "Bankruptcies",
    description:
      "Bankruptcies are the number of companies that have gone bankrupt.",
    value: 0,
    causeValue: 0,
    policyValue: 0,
    lastUpdateCause: 0,
    lastUpdatePolicy: 0,
    type: "industry",
    isGlobal: true,
    thresholds: [30, 65, 80],
    states: ["low", "medium", "high", "extreme"],
    transitions: {
      low: () => true,
      medium: () => true,
      high: () => true,
      extreme: () => true,
    },
    causes: [
      {
        cause: "taxes",
        yIntercept: 0,
        factor: 0,
        inertia: 0,
        formula: function () {
          return this.yIntercept + (status["taxes"].value / 100) * this.factor;
        },
      },
      {
        cause: "economy",
        yIntercept: 0,
        factor: 0,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept + (status["economy"].value / 100) * this.factor
          );
        },
      },
      {
        cause: "low_investment",
        yIntercept: 0,
        factor: 0,
        inertia: 0,
        formula: function () {
          return (
            this.yIntercept +
            (crisis["low_investment"].value / 100) * this.factor
          );
        },
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

export let startingCrisis = [];
export let experiencedCrisis = new Set();

/**
 * Initialize the crisis.
 * @param {*} levelVariables The level variables.
 */
export function initializeCrisis(levelVariables, runtime) {
  startingCrisis = [];
  experiencedCrisis.clear();

  for (const variable in levelVariables) {
    // console.log("variable: " + variable);
    if (!crisis[variable]) continue;
    crisis[variable].value = levelVariables[variable];
    crisis[variable].causeValue = levelVariables[variable];

    if (crisis[variable].value >= crisis[variable].thresholds[1]) {
      startingCrisis.push(variable);
    }
  }

  for (const variable in crisis) {
    let states = {};
    let initial = null;
    const crisisObj = crisis[variable];

    createExtremeCrisisViews(runtime);

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

            const crisisWarningText = getTextById(variable + "_crisis_extreme");

            if (crisis[variable].states.indexOf(state) > 1) {
              updateExtremeCrisis(runtime, variable, state, crisisWarningText);
            } else {
              removeExtremeCrisis(runtime, variable, crisisWarningText);
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
function createExtremeCrisisViews(runtime) {
  const crisisExtremeScrollable = getObjectbyId(
    runtime.objects.ScrollablePanel,
    "crisis_extreme"
  );

  for (const variable in crisis) {
    const crisisText = runtime.objects.UIText.createInstance(
      "PanelExtremeCrisis",
      crisisExtremeScrollable.x + 35,
      0,
      true,
      "extreme_crisis_view"
    );
    crisisText.text = crisis[variable].name;
    crisisText.instVars["id"] = variable + "_crisis_extreme";
    crisisText.isVisible = false;

    addTextToCache(crisisText);

    crisisExtremeScrollable.addChild(crisisText, {
      transformX: true,
      transformY: true,
    });
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
    crisis[variable].causeValue += update;
    crisis[variable].value += update;
    totalUpdate += update;
  }
  crisis[variable].lastUpdateCause = totalUpdate;
}

let extremeCrisis = [];

/**
 * Add and show the new crisis.
 * @param {IRuntimeObjects} runtime Runtime objects.
 * @param {string} variable The name of the crisis.
 * @param {string} state The crisis state.
 * @param {ISpriteFontInstance} crisisWarningText The crisis warning sprite font object.
 */
function updateExtremeCrisis(runtime, variable, state, crisisWarningText) {
  const isShownBefore = extremeCrisis.find(
    (element) => element.variable === variable
  );

  // Shift all other crisis texts down
  if (!isShownBefore) {
    crisisWarningText.y = 30;

    let y = 130;
    for (const otherCrisis of extremeCrisis) {
      const otherText = getTextById(otherCrisis.variable + "_crisis_extreme");
      otherText.y = y;
      y += 100;
    }

    extremeCrisis.push({
      variable: variable,
      state: state,
    });

    const extremeCrisisScrollable = getObjectbyId(
      runtime.objects.ScrollablePanel,
      "crisis_extreme"
    );
    setScrollableHeight(
      runtime,
      extremeCrisisScrollable,
      extremeCrisis.length,
      100,
      30
    );
    resetScrollablePosition(extremeCrisisScrollable);
  }
  crisisWarningText.isVisible = true;

  crisisWarningText.getChildAt(0).text = state;
  
  experiencedCrisis.add(variable);
}

/**
 * Remove a shown crisis.
 * @param {string} variable The name of the crisis.
 * @param {ISpriteFontInstance} crisisWarningText The crisis warning sprite font object.
 */
function removeExtremeCrisis(runtime, variable, crisisWarningText) {
  const element = extremeCrisis.find(
    (element) => element.variable === variable
  );

  if (element) {
    extremeCrisis.splice(extremeCrisis.indexOf(element), 1);
  }

  showExtremeCrisis(30);
  crisisWarningText.isVisible = false;

  const extremeCrisisScrollable = getObjectbyId(
    runtime.objects.ScrollablePanel,
    "crisis_extreme"
  );
  setScrollableHeight(
    runtime,
    extremeCrisisScrollable,
    extremeCrisis.length,
    100,
    30
  );
  resetScrollablePosition(extremeCrisisScrollable);
}

/**
 * Show all extreme crisis.
 * @param {number} initialY The initial y position.
 */
function showExtremeCrisis(initialY) {
  for (const crisis of extremeCrisis) {
    const crisisText = getTextById(crisis.variable + "_crisis_extreme");
    crisisText.y = initialY;
    initialY += 100;
  }
}

/**
 * Check if the extreme crisis is empty.
 * @returns {boolean} True if the extreme crisis is empty.
 */
export function isExtremeCrisisEmpty() {
  console.log(extremeCrisis);
  return extremeCrisis.length === 0;
}

/**
 * Check if a crisis is maximized.
 * @returns {boolean} True if a crisis is maximized.
 */
export function isCrisisMaximized() {
  for (const crisisName in crisis) {
    const crisisData = crisis[crisisName];
    if (crisisData.value >= 100) {
      return true;
    }
  }

  return false;
}

export function setupCrisisPopUp(crisisName, runtime) {
  const crisisData = crisis[crisisName];

  const crisisTitle = getTextById("crisis_pop_up_name");
  crisisTitle.text = crisisData.name;

  const crisisDescription = getTextById("crisis_pop_up_description");
  crisisDescription.text = crisisData.description;

  setupCrisisCauses(runtime, crisisName);
  setupCrisisEffects(runtime, crisisName);
}

export function setupCrisisCauses(runtime, crisisName) {
  const crisisData = crisis[crisisName];

  const causeScrollable = getObjectbyId(
    runtime.objects.ScrollablePanel,
    "crisis_causes"
  );
  const initialY = causeScrollable.y + 10;
  let causeCount = 0;
  let instanceX = causeScrollable.x + (causeScrollable.width - 296) / 2;
  let instanceY = initialY;

  for (const causeView of causeScrollable.children()) {
    causeView.destroy();
  }

  // From crisis causes
  for (const causeObj of crisisData.causes) {
    const causeData = status[causeObj.cause] ?? crisis[causeObj.cause];
    console.log("crisis causes ", causeObj.cause);
    causeCount++;
    instanceY = initialY + (causeCount - 1) * 70;

    const causeName = runtime.objects.UIText.createInstance(
      "CrisisPopUpMG",
      instanceX,
      instanceY,
      true,
      "cause_effect_view"
    );
    const causeNameText = status[causeObj.cause]
      ? "Status: " + causeData.name
      : "Crisis: " + causeData.name;
    causeName.text = causeNameText;
    causeName.instVars["id"] = causeObj.cause + "_cause";

    const causeValue = causeName.getChildAt(0);
    const value =
      causeObj.formula() >= 0
        ? "+" + causeObj.formula().toFixed(2)
        : causeObj.formula().toFixed(2);
    causeValue.text = value + " per day";

    causeScrollable.addChild(causeName, { transformX: true, transformY: true });
  }

  // From policy
  for (const policyName in policy) {
    const policyData = policy[policyName];
    // console.log("Policy ", policyName);

    for (const effectName in policyData.effects) {
      // console.log("Effect ", effectName);
      if (effectName == crisisName) {
        const effectData = policyData.effects[effectName];
        // console.log("Effect data ", effectData.name);

        causeCount++;
        instanceY = initialY + (causeCount - 1) * 70;

        const causeName = runtime.objects.UIText.createInstance(
          "CrisisPopUpMG",
          instanceX,
          instanceY,
          true,
          "cause_effect_view"
        );
        causeName.text = "Policy: " + policyData.name;
        causeName.instVars["id"] = policyData.name + "_cause";

        const causeValue = causeName.getChildAt(0);
        const value =
          effectData.formula(policyData.value) >= 0
            ? "+" + effectData.formula(policyData.value).toFixed(2)
            : effectData.formula(policyData.value).toFixed(2);
        causeValue.text = value;

        causeScrollable.addChild(causeName, {
          transformX: true,
          transformY: true,
        });

        continue;
      }
    }
  }
  // console.log("Cause count ", causeCount);
  resetScrollablePosition(causeScrollable);
  setScrollableHeight(
    runtime,
    causeScrollable,
    causeCount,
    70,
    20,
    "cause_effect_crisis_pop_up"
  );
}

export function setupCrisisEffects(runtime, crisisName) {
  const crisisData = crisis[crisisName];

  const effectScrollable = getObjectbyId(
    runtime.objects.ScrollablePanel,
    "crisis_effects"
  );
  const initialY = effectScrollable.y + 10;
  let effectCount = 0;
  let instanceX = effectScrollable.x + (effectScrollable.width - 296) / 2;
  let instanceY = initialY;

  for (const effectView of effectScrollable.children()) {
    effectView.destroy();
  }

  // From other crisis
  for (const otherStatusName in status) {
    const otherStatusData = status[otherStatusName];

    for (const causeObj of otherStatusData.causes) {
      if (causeObj.cause == crisisName) {
        effectCount++;
        instanceY = initialY + (effectCount - 1) * 70;

        const effectName = runtime.objects.UIText.createInstance(
          "CrisisPopUpMG",
          instanceX,
          instanceY,
          true,
          "cause_effect_view"
        );
        effectName.text = "Status: " + otherStatusData.name;
        effectName.instVars["id"] = otherStatusData.name + "_effect";

        const effectValue = effectName.getChildAt(0);
        const value =
          causeObj.formula() >= 0
            ? "+" + causeObj.formula().toFixed(2)
            : causeObj.formula().toFixed(2);
        effectValue.text = value + " per day";

        effectScrollable.addChild(effectName, {
          transformX: true,
          transformY: true,
        });
      }
    }
  }

  // From other crisis
  for (const otherCrisisName in crisis) {
    const otherCrisisData = crisis[otherCrisisName];

    for (const causeObj of otherCrisisData.causes) {
      if (causeObj.cause == crisisName) {
        effectCount++;
        instanceY = initialY + (effectCount - 1) * 70;

        const effectName = runtime.objects.UIText.createInstance(
          "CrisisPopUpMG",
          instanceX,
          instanceY,
          true,
          "cause_effect_view"
        );
        effectName.text = "Crisis: " + otherCrisisData.name;
        effectName.instVars["id"] = otherCrisisData.name + "_effect";

        const effectValue = effectName.getChildAt(0);
        const value =
          causeObj.formula() >= 0
            ? "+" + causeObj.formula().toFixed(2)
            : causeObj.formula().toFixed(2);
        effectValue.text = value + " per day";

        effectScrollable.addChild(effectName, {
          transformX: true,
          transformY: true,
        });
      }
    }
  }

  resetScrollablePosition(effectScrollable);
  setScrollableHeight(
    runtime,
    effectScrollable,
    effectCount,
    70,
    20,
    "cause_effect_crisis_pop_up"
  );
}
