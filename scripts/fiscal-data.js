import { getTextById } from "./utils.js";

let spending = 0;
let income = 0;
let debt = 0;
let balance = 0;

let incomes = {};
let spendings = {};

function updateBalance() {
  balance = income - spending;
}

export function updateSpending(runtime) {
  spending = 0;
  for (let spendingName in spendings) {
    spending += spendings[spendingName].value;
  }
  const spendingText = getTextById("spending");
  spendingText.text = spending.toFixed(2);
  updateBalance();
}

export function updateIncome(runtime) {
  income = 0;
  for (let incomeName in incomes) {
    income += incomes[incomeName].value;
  }
  const incomeText = getTextById("income");
  incomeText.text = income.toFixed(2);
  updateBalance();
}

export function updateIncomeFromPolicy(policy) {
  const incomeValue =
    policy.minRevenue +
    ((policy.maxRevenue - policy.minRevenue) * policy.finalValue) / 100;
  let incomeFromPolicy = {
    name: policy.name,
    value: incomeValue,
  };
  incomes[policy.name] = incomeFromPolicy;
  updateIncome();
}

export function updateSpendingFromPolicy(policy) {
  const spendingValue =
    policy.minCost +
    ((policy.maxCost - policy.minCost) * policy.finalValue) / 100;
  let spendingFromPolicy = {
    name: policy.name,
    value: spendingValue,
  };
  spendings[policy.name] = spendingFromPolicy;
  updateSpending();
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
