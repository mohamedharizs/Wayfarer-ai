import test from 'node:test';
import assert from 'node:assert/strict';
import { generateStructuredItinerary } from '../src/lib/ai-generator.ts';
import type { TripPreferences, Trip } from '../src/types/trip.ts';

test('AI Schema — Generated Itinerary Matches Complete Trip Contract', () => {
  const prefs: TripPreferences = {
    destination: 'Oaxaca City, Mexico',
    departureCity: 'Delhi (DEL)',
    startDate: '2026-11-01',
    endDate: '2026-11-05',
    durationDays: 4,
    travelerType: 'couple',
    adultsCount: 2,
    childrenCount: 0,
    budgetStyle: 'economy',
    totalBudget: 120000,
    currency: 'INR',
    interests: ['Food & Local Cuisine', 'Culture & History', 'Local Shopping & Markets'],
    pace: 'relaxed',
    accommodationType: 'Historic Courtyard Posada',
    transportPreference: 'Walking & Local Taxi'
  };

  const trip: Trip = generateStructuredItinerary(prefs);

  // Top-level fields
  assert.ok(trip.id.startsWith('trip-'));
  assert.ok(trip.title.includes('Oaxaca'));
  assert.strictEqual(trip.destination, 'Oaxaca City, Mexico');
  assert.strictEqual(trip.durationDays, 4);
  assert.strictEqual(trip.days.length, 4);
  assert.strictEqual(trip.budget.currency, 'INR');
  assert.strictEqual(trip.budget.totalPlanned, 120000);

  // Verify each day structure
  trip.days.forEach((day, index) => {
    assert.strictEqual(day.dayNumber, index + 1);
    assert.ok(day.title.length > 0);
    assert.ok(day.theme.length > 0);
    assert.ok(day.activities.length >= 3);

    // Verify activities structure
    day.activities.forEach(act => {
      assert.ok(act.id.length > 0);
      assert.ok(act.name.length > 0);
      assert.ok(act.time.length > 0);
      assert.ok(['morning', 'afternoon', 'evening'].includes(act.period));
      assert.ok(typeof act.estimatedCost === 'number');
      assert.ok(act.estimatedCost >= 0);
      assert.ok(act.location && typeof act.location.lat === 'number');
      assert.ok(act.location && typeof act.location.lng === 'number');
    });
  });

  // Verify practical tips & weather alternatives
  assert.ok(trip.practicalTips.length >= 2);
  assert.ok(trip.weatherAlternatives.length >= 1);
});

test('AI Failure Handling — Graceful Fallback Engine Integrity', () => {
  // If destination is uncommon or AI provider times out, engine handles with robust coordinates & content
  const customPrefs: TripPreferences = {
    destination: 'Hampi, Karnataka, India',
    startDate: '2026-12-15',
    endDate: '2026-12-18',
    durationDays: 3,
    travelerType: 'solo',
    adultsCount: 1,
    childrenCount: 0,
    budgetStyle: 'comfortable',
    totalBudget: 45000,
    currency: 'INR',
    interests: ['Art & Architecture', 'Photography'],
    pace: 'balanced',
    accommodationType: 'Heritage Resort',
    transportPreference: 'Bicycle & Walking'
  };

  const trip = generateStructuredItinerary(customPrefs);
  assert.strictEqual(trip.destination, 'Hampi, Karnataka, India');
  assert.strictEqual(trip.days.length, 3);
  assert.strictEqual(trip.budget.currency, 'INR');
  assert.ok(trip.days[0].activities.length > 0);
});
