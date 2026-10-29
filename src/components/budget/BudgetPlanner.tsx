'use client';

import React, { useState } from 'react';
import {
  TrendingUp, PiggyBank, Plus,
  ShieldAlert, CheckCircle2, Calendar
} from 'lucide-react';
import { BudgetBreakdown, ActualExpense } from '@/types/trip';
import { formatCurrency } from '@/lib/currency';

interface BudgetPlannerProps {
  budget: BudgetBreakdown;
  actualExpenses: ActualExpense[];
  durationDays: number;
  onAddExpense: (expense: ActualExpense) => void;
  onUpdateBudget: (newBudget: BudgetBreakdown) => void;
}

export default function BudgetPlanner({
  budget,
  actualExpenses,
  durationDays,
  onAddExpense
}: BudgetPlannerProps) {
  const currency = budget?.currency || 'INR';

  // New Expense form state
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<keyof Omit<BudgetBreakdown, 'totalPlanned' | 'currency'>>('food');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);

  // Calculations
  const totalActual = actualExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const remainingBudget = (budget?.totalPlanned || 0) - totalActual;
  const isOverBudget = remainingBudget < 0;
  const dailyAverageEstimate = Math.round((budget?.totalPlanned || 0) / Math.max(1, durationDays));

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(expenseAmount);
    if (!expenseTitle.trim() || isNaN(amountNum) || amountNum <= 0) return;

    const newExp: ActualExpense = {
      id: `exp-${Date.now()}`,
      title: expenseTitle.trim(),
      amount: amountNum,
      category: expenseCategory,
      date: expenseDate
    };

    onAddExpense(newExp);
    setExpenseTitle('');
    setExpenseAmount('');
  };

  const categories = [
    { key: 'flights', label: 'Flights & Intercity Transit', icon: '✈️', planned: budget?.flights || 0, color: 'bg-blue-500' },
    { key: 'accommodation', label: 'Lodging & Stays', icon: '🏨', planned: budget?.accommodation || 0, color: 'bg-emerald-500' },
    { key: 'food', label: 'Dining & Food Experiences', icon: '🍜', planned: budget?.food || 0, color: 'bg-amber-500' },
    { key: 'activities', label: 'Activities & Sightseeing', icon: '🎟️', planned: budget?.activities || 0, color: 'bg-purple-500' },
    { key: 'transportation', label: 'Local Transit & Rides', icon: '🚇', planned: budget?.transportation || 0, color: 'bg-teal-500' },
    { key: 'shopping', label: 'Artisan Goods & Souvenirs', icon: '🛍️', planned: budget?.shopping || 0, color: 'bg-pink-500' },
    { key: 'emergencyBuffer', label: 'Emergency Cushion Buffer', icon: '🛡️', planned: budget?.emergencyBuffer || 0, color: 'bg-slate-500' }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Cards: Total, Spent, Remaining, Daily */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Planned Budget */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#64748B]">
            <span>Total Planned</span>
            <PiggyBank className="w-4 h-4 text-[#176B52]" />
          </div>
          <div className="mt-2 text-2xl font-serif font-bold text-[#101827]">
            {formatCurrency(budget?.totalPlanned, currency)}
          </div>
          <div className="text-xs text-[#64748B] mt-1">
            Currency: {currency}
          </div>
        </div>

        {/* Actual Spent */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#64748B]">
            <span>Actual Tracked</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-serif font-bold text-blue-900">
            {formatCurrency(totalActual, currency)}
          </div>
          <div className="text-xs text-[#64748B] mt-1">
            {actualExpenses.length} entries recorded
          </div>
        </div>

        {/* Remaining Budget */}
        <div className={`p-5 rounded-2xl border shadow-2xs ${
          isOverBudget ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
            <span className={isOverBudget ? 'text-rose-700' : 'text-emerald-700'}>
              {isOverBudget ? 'Over Budget' : 'Remaining Balance'}
            </span>
            {isOverBudget ? (
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
          </div>
          <div className={`mt-2 text-2xl font-serif font-bold ${
            isOverBudget ? 'text-rose-900' : 'text-emerald-900'
          }`}>
            {formatCurrency(Math.abs(remainingBudget), currency)}
          </div>
          <div className="text-xs text-[#64748B] mt-1">
            {isOverBudget ? 'Budget threshold exceeded' : 'Within comfortable targets'}
          </div>
        </div>

        {/* Daily Target */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#64748B]">
            <span>Daily Average Target</span>
            <Calendar className="w-4 h-4 text-[#D6AD60]" />
          </div>
          <div className="mt-2 text-2xl font-serif font-bold text-[#101827]">
            {formatCurrency(dailyAverageEstimate, currency)}
            <span className="text-sm font-sans font-normal text-[#64748B]">/day</span>
          </div>
          <div className="text-xs text-[#64748B] mt-1">
            Based on {durationDays} total days
          </div>
        </div>
      </div>

      {/* Itemized Categories Breakdown */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-2xs space-y-6">
        <div>
          <h4 className="font-serif text-xl font-bold text-[#101827]">
            Estimated Budget Allocation by Category
          </h4>
          <p className="text-xs text-[#64748B] mt-1">
            AI-modeled cost distributions optimized for your travel style.
          </p>
        </div>

        <div className="space-y-4">
          {categories.map((cat) => {
            const actualForCat = actualExpenses
              .filter(e => e.category === cat.key)
              .reduce((s, e) => s + (Number(e.amount) || 0), 0);
            const totalPlannedSafe = budget?.totalPlanned || 1;
            const pct = Math.min(100, Math.round((cat.planned / totalPlannedSafe) * 100));

            return (
              <div key={cat.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{cat.icon}</span>
                    <span className="font-semibold text-[#101827]">{cat.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#101827]">
                      {formatCurrency(cat.planned, currency)}
                    </span>
                    {actualForCat > 0 && (
                      <span className="text-[#64748B] ml-2">
                        ({formatCurrency(actualForCat, currency)} spent)
                      </span>
                    )}
                    <span className="text-slate-400 text-[11px] ml-1">({pct}%)</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full transition-all duration-300`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expense Tracker Log & Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Log Expense Form */}
        <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-2xs space-y-4">
          <h4 className="font-serif text-lg font-bold text-[#101827] flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#176B52]" />
            <span>Record Real Expense</span>
          </h4>

          <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
            <div>
              <label className="block uppercase font-semibold text-[#64748B] mb-1">
                Description *
              </label>
              <input
                type="text"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
                placeholder="e.g. Traditional Kaiseki Dinner"
                className="w-full px-3 py-2 border rounded-xl text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block uppercase font-semibold text-[#64748B] mb-1">
                  Amount ({currency === 'INR' ? '₹' : currency}) *
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  placeholder={currency === 'INR' ? '2500' : '85.00'}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                  required
                />
              </div>

              <div>
                <label className="block uppercase font-semibold text-[#64748B] mb-1">
                  Category
                </label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value as keyof Omit<BudgetBreakdown, 'totalPlanned' | 'currency'>)}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                >
                  <option value="food">Food & Dining</option>
                  <option value="activities">Activities</option>
                  <option value="accommodation">Accommodation</option>
                  <option value="flights">Flights</option>
                  <option value="transportation">Local Transit</option>
                  <option value="shopping">Shopping</option>
                  <option value="emergencyBuffer">Buffer / Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block uppercase font-semibold text-[#64748B] mb-1">
                Date
              </label>
              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 rounded-xl bg-[#176B52] text-white font-semibold text-xs hover:bg-[#125440] transition-colors cursor-pointer"
            >
              Add to Expense Log
            </button>
          </form>
        </div>

        {/* Expense History List */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-lg font-bold text-[#101827]">
              Tracked Actual Expenses ({actualExpenses.length})
            </h4>
            <span className="text-xs font-bold text-[#176B52]">
              Total: {formatCurrency(totalActual, currency)}
            </span>
          </div>

          {actualExpenses.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#64748B]">
              No expenses recorded yet. Log your flight tickets, dinners, and museum passes to monitor real costs.
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {actualExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-xs"
                >
                  <div>
                    <span className="font-bold text-[#101827] block">
                      {exp.title}
                    </span>
                    <span className="text-[#64748B] text-[11px] capitalize">
                      {exp.category} · {exp.date}
                    </span>
                  </div>
                  <span className="font-serif font-bold text-[#101827] text-sm">
                    {formatCurrency(exp.amount, currency)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
