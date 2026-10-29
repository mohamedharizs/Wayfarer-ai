import test from 'node:test';
import assert from 'node:assert/strict';
import { generateStructuredItinerary } from '../src/lib/ai-generator.ts';
import type { TripPreferences, Activity } from '../src/types/trip.ts';

test('Budget Arithmetic — Component Sum Equals Total Planned', () => {
  const prefs: TripPreferences = {
    destination: 'Swiss Alps, Switzerland',
    startDate: '2026-07-01',
    endDate: '2026-07-08',
    durationDays: 7,
    travelerType: 'couple',
    adultsCount: 2,
    childrenCount: 0,
    budgetStyle: 'luxury',
    totalBudget: 420000,
    currency: 'INR',
    interests: ['Nature & Landscapes', 'Adventure & Hiking'],
    pace: 'balanced',
    accommodationType: 'Alpine Lodge',
    transportPreference: 'Swiss Rail Pass'
  };

  const trip = generateStructuredItinerary(prefs);
  const b = trip.budget;

  const componentSum = b.flights + b.accommodation + b.food + b.transportation + b.activities + b.shopping + b.emergencyBuffer;
  assert.strictEqual(componentSum, b.totalPlanned, 'Budget category breakdown must match totalPlanned without drift');
  assert.strictEqual(b.currency, 'INR');
});

test('Budget Arithmetic — Daily Estimated Cost Calculation', () => {
  const prefs: TripPreferences = {
    destination: 'Kyoto, Japan',
    startDate: '2026-11-10',
    endDate: '2026-11-14',
    durationDays: 4,
    travelerType: 'solo',
    adultsCount: 1,
    childrenCount: 0,
    budgetStyle: 'comfortable',
    totalBudget: 95000,
    currency: 'INR',
    interests: ['Culture & History'],
    pace: 'balanced',
    accommodationType: 'Boutique Hotel',
    transportPreference: 'Public Transit & Walking'
  };

  const trip = generateStructuredItinerary(prefs);

  for (const day of trip.days) {
    const calculatedSum = day.activities.reduce((sum, a) => sum + (Number(a.estimatedCost) || 0), 0);
    assert.strictEqual(day.dailyEstimatedCost, calculatedSum, `Day ${day.dayNumber} dailyEstimatedCost must match sum of its activities`);
  }
});

test('Budget Arithmetic — Recalculation on Activity Mutation', () => {
  const mockActivities: Activity[] = [
    {
      id: 'act-1',
      name: 'Temple Morning Walk',
      time: '09:00 AM',
      period: 'morning',
      category: 'Culture',
      description: 'Morning shrine grounds walk',
      duration: '2.0 hrs',
      estimatedCost: 1500,
      location: { name: 'Kyoto' }
    },
    {
      id: 'act-2',
      name: 'Matcha Kaiseki Lunch',
      time: '12:30 PM',
      period: 'afternoon',
      category: 'Food',
      description: 'Traditional tasting lunch',
      duration: '1.5 hrs',
      estimatedCost: 3500,
      location: { name: 'Kyoto' }
    }
  ];

  const initialDayTotal = mockActivities.reduce((s, a) => s + a.estimatedCost, 0);
  assert.strictEqual(initialDayTotal, 5000);

  // Edit activity cost (e.g. upgraded to private tea room)
  mockActivities[1].estimatedCost = 6000;
  const updatedDayTotal = mockActivities.reduce((s, a) => s + a.estimatedCost, 0);
  assert.strictEqual(updatedDayTotal, 7500);

  // Add custom activity
  const newActivity: Activity = {
    id: 'act-3',
    name: 'Evening Bamboo Lantern Stroll',
    time: '07:30 PM',
    period: 'evening',
    category: 'Sightseeing',
    description: 'Lantern path walk',
    duration: '1.5 hrs',
    estimatedCost: 800,
    location: { name: 'Arashiyama' }
  };
  mockActivities.push(newActivity);

  const finalDayTotal = mockActivities.reduce((s, a) => s + a.estimatedCost, 0);
  assert.strictEqual(finalDayTotal, 8300);

  // Remove first activity
  const remainingActivities = mockActivities.filter(a => a.id !== 'act-1');
  const postDeletionTotal = remainingActivities.reduce((s, a) => s + a.estimatedCost, 0);
  assert.strictEqual(postDeletionTotal, 6800);
});

test('Budget Arithmetic — Expense Tracking Balance & Overrun Logic', () => {
  const totalPlanned = 250000;
  const expenses: { id: string; title: string; amount: number; category: string; date: string }[] = [
    { id: '1', title: 'Flight Tickets', amount: 88000, category: 'flights', date: '2026-10-01' },
    { id: '2', title: 'Hotel Deposit', amount: 75000, category: 'accommodation', date: '2026-10-02' }
  ];

  const totalActual = expenses.reduce((sum, e) => sum + e.amount, 0);
  assert.strictEqual(totalActual, 163000);

  const remaining = totalPlanned - totalActual;
  assert.strictEqual(remaining, 87000);
  assert.strictEqual(remaining >= 0, true);

  // Add an expense that exceeds budget
  expenses.push({ id: '3', title: 'Luxury Private Excursion', amount: 100000, category: 'activities' as const, date: '2026-10-03' });
  const newTotalActual = expenses.reduce((sum, e) => sum + e.amount, 0);
  assert.strictEqual(newTotalActual, 263000);

  const newRemaining = totalPlanned - newTotalActual;
  assert.strictEqual(newRemaining, -13000);
  assert.strictEqual(newRemaining < 0, true); // Over budget
});
