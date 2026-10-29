import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCurrency, formatIndianNumber, parseCurrencyInput, calculateDefaultBudgetINR } from '../src/lib/currency.ts';

test('INR Formatting — Indian Numbering System', () => {
  // Test basic rupee formatting
  const formatted1 = formatCurrency(125000, 'INR');
  assert.ok(formatted1.includes('1,25,000'), `Expected ₹1,25,000 but got ${formatted1}`);
  assert.ok(formatted1.includes('₹') || formatted1.includes('INR'), `Expected currency symbol in ${formatted1}`);

  // Test 10 Lakhs (1,000,000 -> 10,00,000)
  const formattedLakhs = formatIndianNumber(1000000);
  assert.strictEqual(formattedLakhs, '10,00,000');

  // Test Crores (10,000,000 -> 1,00,00,000)
  const formattedCrores = formatIndianNumber(10000000);
  assert.strictEqual(formattedCrores, '1,00,00,000');

  // Test small amounts
  const small = formatCurrency(750, 'INR');
  assert.ok(small.includes('750'), `Expected 750 in ${small}`);

  // Test zero and null/undefined
  const zero = formatCurrency(0, 'INR');
  assert.ok(zero.includes('0'), `Expected 0 in ${zero}`);
  const undef = formatCurrency(null as unknown as number, 'INR');
  assert.ok(undef.includes('0'), `Expected 0 for null in ${undef}`);
});

test('Currency Formatting — Multicurrency Support', () => {
  const usd = formatCurrency(3200, 'USD');
  assert.ok(usd.includes('3,200'), `Expected 3,200 in ${usd}`);

  const eur = formatCurrency(2500, 'EUR');
  assert.ok(eur.includes('2.500') || eur.includes('2,500'), `Expected 2500 in ${eur}`);
});

test('Parse Currency Input', () => {
  assert.strictEqual(parseCurrencyInput('₹1,25,000'), 125000);
  assert.strictEqual(parseCurrencyInput('$3,200.50'), 3200.5);
  assert.strictEqual(parseCurrencyInput('   50000   '), 50000);
  assert.strictEqual(parseCurrencyInput('invalid'), 0);
  assert.strictEqual(parseCurrencyInput(-500), 0);
});

test('Budget Arithmetic — Strictly Numeric Separation', () => {
  // Verify that arithmetic calculations occur purely on numeric types without string concatenation
  const flight = 95000;
  const hotel = 85000;
  const dining = 42000;
  const transit = 12000;
  const activities = 16000;
  const shopping = 6000;
  const buffer = 4000;

  const total = flight + hotel + dining + transit + activities + shopping + buffer;
  assert.strictEqual(total, 260000);
  assert.strictEqual(typeof total, 'number');

  // Only formatted at output
  const formattedTotal = formatCurrency(total, 'INR');
  assert.ok(formattedTotal.includes('2,60,000'));
});

test('Default Budget Calculator in INR', () => {
  // 7 days, 2 adults, comfortable style (16,000/day/person)
  // 7 * 16,000 * 2 = 2,24,000 -> rounded to nearest 5k = 2,25,000
  const budget = calculateDefaultBudgetINR(7, 2, 'comfortable');
  assert.strictEqual(budget, 225000);

  // 3 days, 1 solo traveler, economy style (8,000/day/person)
  // 3 * 8,000 * 1 = 24,000 -> rounded to nearest 5k = 25,000
  const budgetEcon = calculateDefaultBudgetINR(3, 1, 'economy');
  assert.strictEqual(budgetEcon, 25000);
});
