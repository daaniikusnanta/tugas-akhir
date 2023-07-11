import { policy, togglePolicyActive } from "./policy-data.js";
import { filledTiles, } from "./tile-data.js";
import { clamp, getObjectbyId, getTextById, resetScrollablePosition, setScrollableHeight, toCurrencyFormat } from "./utils.js";
import { status } from "./status-data.js";

let debt = 0;
export let balance = 0;

let dailySpending = 0;
let dailyIncome = 0;
let dailyDebt = 0;
export let dailyCollectibleIncome = 0;

export let incomes = {};
let spendings = {};
export let totalSpending = 0;

let incomeViews = [];
let spendingViews = [];
let incomeBubbleTileIndexes = [];

export const fiscalMultiplier = {
  "collectibleIncomeMultiplier": 0.2,
  "industryIncomeMultiplier": 550,
  "debtDeadline": 200,
}

export function resetFiscalData() {
  debt = 0;
  balance = 0;
  dailySpending = 0;
  dailyIncome = 0;
  dailyDebt = 0;
  dailyCollectibleIncome = 0;
  incomes = {};
  spendings = {};
  totalSpending = 0;
  incomeViews = [];
  spendingViews = [];
  incomeBubbleTileIndexes = [];
}

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
  let incomeName = Object.keys(incomes)[Math.floor(Math.random() * Object.keys(incomes).length)];
  let spawnedIncomeBubble = getObjectbyId(runtime.objects.IncomeBubble, incomeName, true);
  while (spawnedIncomeBubble && spawnedIncomeBubble.instVars['currentDuration'] < 1) {
    incomeName = Object.keys(incomes)[Math.floor(Math.random() * Object.keys(incomes).length)];
    spawnedIncomeBubble = getObjectbyId(runtime.objects.IncomeBubble, incomeName, true);
  }

  let tileIndex = Math.floor(Math.random() * filledTiles.length);
  while (tileIndex in incomeBubbleTileIndexes) {
    tileIndex = Math.floor(Math.random() * filledTiles.length);
  }

  const tileData = filledTiles[tileIndex];
  const instanceX = (tileData.x) * 64 + 32;
  const instanceY = (tileData.y - 1) * 64 + 32;

  const incomeBubble = runtime.objects.IncomeBubble.createInstance("Game", instanceX, instanceY);
  incomeBubble.instVars['id'] = incomeName;
  incomeBubble.instVars['incomeValue'] = incomes[incomeName] * fiscalMultiplier['collectibleIncomeMultiplier'];
  incomeBubble.instVars['duration'] = 3;
  incomeBubble.instVars['currentDuration'] = 0;
  incomeBubble.instVars['tileIndex'] = tileIndex;
  incomeBubble.animationFrame = getIncomeBubbleFrameIndex(incomeName);

  const bottomSpawnedBubble = runtime.objects.IncomeBubble.getAllInstances().find(bubble => {
    const tileIndex = bubble.instVars.tileIndex;
    const tile = filledTiles[tileIndex];
    return tile.y - tileData.y === 1 && tile.x === tileData.x;
  });

  if (bottomSpawnedBubble) {
    incomeBubble.moveAdjacentToInstance(bottomSpawnedBubble, false);
  }
}

export function updateBalance() {
  balance += dailyIncome - dailySpending;

  const balanceText = getTextById("balance");
  balanceText.text = toCurrencyFormat(balance);

  totalSpending += dailySpending;
}

export function updateDebt(runtime) {
  if (dailyCollectibleIncome + dailyIncome < dailySpending) {
    const currentDebt = dailyCollectibleIncome + dailyIncome - dailySpending;
    debt += currentDebt;
    dailyDebt = currentDebt;

    const debtData = status["debt"];
    const expectedIncomeGrowth = 13;
    const totalDailyIncome = dailyIncome / (1 - fiscalMultiplier['collectibleIncomeMultiplier']);
    const debtExpectedPayOff = debt / totalDailyIncome * expectedIncomeGrowth;
    
    const debtDataLastValue = debtData.value;
    debtData.value = clamp(debtExpectedPayOff / (fiscalMultiplier['debtDeadline'] * 2) * 100, 0, 100);
    debtData.lastUpdateCause = debtData.value - debtDataLastValue;
  }

  const debtPaymentPolicyData = policy["debt_payment"];
  debtPaymentPolicyData.minCost = dailyIncome * 0.1;
  debtPaymentPolicyData.maxCost = dailyIncome * 0.5;

  if (debt > 0 && !debtPaymentPolicyData.isImplemented) {
    togglePolicyActive("debt_payment", runtime);
  }
  if (debt <= 0 && debtPaymentPolicyData.isImplemented) {
    togglePolicyActive("debt_payment", runtime);
  }

  if (debtPaymentPolicyData.isImplemented) {
    const payment = debtPaymentPolicyData.minCost + debtPaymentPolicyData.value / 100 * (debtPaymentPolicyData.maxCost - debtPaymentPolicyData.minCost);
    debt -= payment;
  }  
}

export function resetDailyCollectibleIncome() {
  dailyCollectibleIncome = 0;
}

export function addBalance(value) {
	balance += value;
	
	const balanceText = getTextById("balance");
  balanceText.text = toCurrencyFormat(balance);

  dailyCollectibleIncome += value;
}

export function updateDailySpending() {
  dailySpending = 0;
  for (let spendingName in spendings) {
    dailySpending += spendings[spendingName];
  }
  const spendingText = getTextById("daily_spending");
  spendingText.text = toCurrencyFormat(dailySpending);
}

export function updateDailyIncome() {
  dailyIncome = 0;
  for (let incomeName in incomes) {
    dailyIncome += incomes[incomeName] * (1 - fiscalMultiplier['collectibleIncomeMultiplier']);
  }
  const incomeText = getTextById("daily_income");
  incomeText.text = toCurrencyFormat(dailyIncome);
}

export function updateIncomeFromPolicy(policyName) {
  const policyData = policy[policyName];

  if (!policyData.isImplemented) {
    return;
  }

  const incomeValue =
    policyData.minRevenue +
    ((policyData.maxRevenue - policyData.minRevenue) * policyData.finalValue) / 100;
  
  if (incomeValue > 0) {
    incomes[policyName] = incomeValue;
    updateDailyIncome();
  }
}

export function removeIncomeFromPolicy(policyName) {
  delete incomes[policyName];
  updateDailyIncome();
}

export function updateSpendingFromPolicy(policyName) {
  const policyData = policy[policyName];

  if (!policyData.isImplemented) {
    return;
  }

  const spendingValue =
    policyData.minCost +
    ((policyData.maxCost - policyData.minCost) * policyData.finalValue) / 100;

  if (spendingValue > 0) {
    spendings[policyName] = spendingValue;
    updateDailySpending();
  }
}

export function removeSpendingFromPolicy(policyName) {
  delete spendings[policyName];
  updateDailySpending();
}

export function updateIncomeFromIndustry(industryName) {
  const industryData = status[industryName];

  const incomeValue = industryData.value / 100 * fiscalMultiplier["industryIncomeMultiplier"];

  if (incomeValue > 0) {
    incomes[industryName] = incomeValue;
    updateDailyIncome();
  }
}

export function showFiscalPopUp(runtime) {
  const dailyIncomeText = getTextById("fiscal_pop_up_daily_income");
  dailyIncomeText.text = "Daily Income: " + toCurrencyFormat(dailyIncome);
  const dailySpendingText = getTextById("fiscal_pop_up_daily_spending");
  dailySpendingText.text = "Daily Spending: " + toCurrencyFormat(dailySpending);
  const balanceText = getTextById("fiscal_pop_up_balance");
  balanceText.text = "Balance: " + toCurrencyFormat(balance);
  const debtText = getTextById("fiscal_pop_up_total_debt");
  debtText.text = "Total Debt: " + toCurrencyFormat(debt);

  showIncomeList(runtime);
  showSpendingList(runtime);
}

function showIncomeList(runtime) {
  destroyIncomeList();

  const incomeScrollable = getObjectbyId(runtime.objects.ScrollablePanel, "fiscal_incomes");
  let newIncomes = Object.assign({}, incomes);
  if (dailyDebt > 0) {
    newIncomes = Object.assign({}, newIncomes, { "borrowing": dailyDebt });
  }
  const sortedIncomes = Object.keys(newIncomes).sort((a, b) => {
    return newIncomes[b] - newIncomes[a];
  });
  const highestIncome = newIncomes[sortedIncomes[0]];

  for (const income of sortedIncomes) {
    const incomeValue = newIncomes[income];
    const incomeName = policy[income]?.name ?? status[income]?.name ?? "Government Borrowing";

    const instanceX = incomeScrollable.x + 30;
    const instanceY = incomeScrollable.y + sortedIncomes.indexOf(income) * 96;

    const incomeText = runtime.objects.UIText.createInstance("FiscalPopUpMG", instanceX, instanceY, true, "fiscal_view");
    incomeText.text = incomeName;

    const incomeProgressBG = incomeText.getChildAt(0);
    const incomeProgress = incomeText.getChildAt(1);
    incomeProgress.width = incomeValue / highestIncome * incomeProgressBG.width;

    const incomeValueText = incomeText.getChildAt(2);
    const incomePercent = (incomeValue / dailyIncome * 100).toFixed(2)
    incomeValueText.text = toCurrencyFormat(incomeValue) + " (" + incomePercent + "%)";

    incomeViews.push(incomeText);
    incomeScrollable.addChild(incomeText, { transformX: true, transformY: true });
  }

  resetScrollablePosition(incomeScrollable);
  setScrollableHeight(runtime, incomeScrollable, sortedIncomes.length, 96, 0, "income_spending_fiscal_pop_up");
}

function destroyIncomeList() {
  for (let i = 0; i < incomeViews.length; i++) {
    incomeViews[i].destroy();
  }

  incomeViews = [];
}

function showSpendingList(runtime) {
  destroySpendingList();

  const spendingScrollable = getObjectbyId(runtime.objects.ScrollablePanel, "fiscal_spendings");
  const sortedSpendings = Object.keys(spendings).sort((a, b) => {
    return spendings[b] - spendings[a];
  });
  const highestSpending = spendings[sortedSpendings[0]];

  for (const spending of sortedSpendings) {
    const spendingValue = spendings[spending];
    const spendingName = policy[spending]?.name ?? "Other Spending";

    const instanceX = spendingScrollable.x + 30;
    const instanceY = spendingScrollable.y + sortedSpendings.indexOf(spending) * 96;

    const spendingText = runtime.objects.UIText.createInstance("FiscalPopUpMG", instanceX, instanceY, true, "fiscal_view");
    spendingText.text = spendingName;

    const spendingProgressBG = spendingText.getChildAt(0);
    const spendingProgress = spendingText.getChildAt(1);
    spendingProgress.width = spendingValue / highestSpending * spendingProgressBG.width;

    const spendingValueText = spendingText.getChildAt(2);
    const spendingPercent = (spendingValue / dailySpending * 100).toFixed(2)
    spendingValueText.text = toCurrencyFormat(spendingValue) + " (" + spendingPercent + "%)";

    spendingViews.push(spendingText);
    spendingScrollable.addChild(spendingText, { transformX: true, transformY: true });
  }

  resetScrollablePosition(spendingScrollable);
  setScrollableHeight(runtime, spendingScrollable, sortedSpendings.length, 96, 0, "income_spending_fiscal_pop_up");
}

function destroySpendingList() {
  for (let i = 0; i < spendingViews.length; i++) {
    spendingViews[i].destroy();
  }

  spendingViews = [];
}

/**
 * Get the index of the bubble frame for income based on the income name
 * @param {string} incomeName 
 * @returns {number}
 */
function getIncomeBubbleFrameIndex(incomeName) {
  const taxRegex = /tax/i;
  if (taxRegex.test(incomeName)) {
    return 0;
  }

  switch (incomeName) {
    case "mineral_oil_industry":
      return 1;
    case "manufacturing":
      return 2;
    case "agriculture":
      return 3;
    case "fisheries":
      return 4;
    case "tourism_creative":
      return 5;
    default:
      return 0;
  }
}