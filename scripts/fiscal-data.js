import { policy } from "./policy-data.js";
import { filledTiles, } from "./tile-data.js";
import { getObjectbyId, getTextById } from "./utils.js";

let spending = 0;
let income = 0;
let debt = 0;
let balance = 0;
let dailySpending = 0;
let dailyIncome = 0;

export let incomes = {};
let collectibleIncomes = {};
let spendings = {};

export const fiscalMultiplier = {
  "collectibleIncomeMultiplier": 0.1,
}

const incomeBubbleTileIndexes = []

export function removeIncomeBubbleTileIndex(tileIndex) {
  const index = incomeBubbleTileIndexes.indexOf(tileIndex);
  if (index !== -1) {
    incomeBubbleTileIndexes.splice(index, 1);
  }
}

export function setupSpawnIncomeBubble(gameManager) {
  const timer = gameManager.behaviors.Timer;
  const interval = timer.getDuration("Tick") / Object.keys(incomes).length;
  console.log("spawn ", timer.getCurrentTime("Tick"), interval, incomes);

  if (timer.getCurrentTime("Tick") % interval == 0) {
    spawnIncomeBubble();
  }
}

export function spawnIncomeBubble(runtime) {
  let spawnedIncomeName = Object.keys(incomes)[Math.floor(Math.random() * Object.keys(incomes).length)];
  let spawnedIncomeBubble = getObjectbyId(runtime.objects.IncomeBubble, spawnedIncomeName, true);
  while (spawnedIncomeBubble && spawnedIncomeBubble.instVars['currentDuration'] < 1) {
    spawnedIncomeName = Object.keys(incomes)[Math.floor(Math.random() * Object.keys(incomes).length)];
    spawnedIncomeBubble = getObjectbyId(runtime.objects.IncomeBubble, spawnedIncomeName, true);
  }

  let tileIndex = Math.floor(Math.random() * filledTiles.length);
  while (tileIndex in incomeBubbleTileIndexes) {
    tileIndex = Math.floor(Math.random() * filledTiles.length);
  }

  const tileData = filledTiles[tileIndex];
  const instanceX = tileData.x * 64 + 32;
  const instanceY = tileData.y * 64 + 32;

  const incomeBubble = runtime.objects.IncomeBubble.createInstance("Game", instanceX, instanceY);
  incomeBubble.instVars['id'] = spawnedIncomeName;
  incomeBubble.instVars['value'] = incomes[spawnedIncomeBubble] * fiscalMultiplier['collectibleIncomeMultiplier'];
  incomeBubble.instVars['duration'] = 3;
  incomeBubble.instVars['currentDuration'] = 0;
  console.log("spawn bubble ", incomeBubble);
}

export function updateBalance() {
  balance = dailyIncome - dailySpending;

  const balanceText = getTextById("balance");
  balanceText.text = balance.toFixed(2);
}

export function updateDailySpending() {
  dailySpending = 0;
  for (let spendingName in spendings) {
    dailySpending += spendings[spendingName];
  }
  const spendingText = getTextById("daily_spending");
  spendingText.text = dailySpending.toFixed(2);
}

export function updateDailyIncome() {
  dailyIncome = 0;
  for (let incomeName in incomes) {
    dailyIncome += incomes[incomeName] * (1 - fiscalMultiplier['collectibleIncomeMultiplier']);
  }
  const incomeText = getTextById("daily_income");
  incomeText.text = dailyIncome.toFixed(2);
}

export function updateIncomeFromPolicy(policyName) {
  const policyData = policy[policyName];

  const incomeValue =
    policyData.minRevenue +
    ((policyData.maxRevenue - policyData.minRevenue) * policyData.finalValue) / 100;
  
  incomes[policyName] = incomeValue;
  updateDailyIncome();
}

export function updateSpendingFromPolicy(policyName) {
  const policyData = policy[policyName];

  const spendingValue =
    policyData.minCost +
    ((policyData.maxCost - policyData.minCost) * policyData.finalValue) / 100;

  // let spendingFromPolicy = {
  //   name: policy.name,
  //   value: spendingValue,
  // };

  spendings[policyName] = spendingValue;
  updateDailySpending();
}

export function updateIncomeFromStatus(status) {
  const incomeValue =
    status.minRevenue +
    ((status.maxRevenue - status.minRevenue) * status.value) / 100;
  let incomeFromStatus = {
    name: status.name,
    value: incomeValue,
  };
  incomes[status.name] = incomeFromStatus;
  updateIncome();
}
