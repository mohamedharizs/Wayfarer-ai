import test from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';

const ItineraryRequestSchema = z.object({
  destination: z.string().trim().min(2, 'Destination must be at least 2 characters'),
  departureCity: z.string().trim().optional(),
  startDate: z.string().min(4, 'Start date is required'),
  endDate: z.string().min(4, 'End date is required'),
  durationDays: z.number().int().min(1, 'Duration must be at least 1 day').max(30, 'Duration cannot exceed 30 days'),
  travelerType: z.enum(['solo', 'couple', 'family', 'group']),
  adultsCount: z.number().int().min(1, 'At least 1 adult is required'),
  childrenCount: z.number().int().min(0, 'Children count cannot be negative'),
  budgetStyle: z.enum(['economy', 'comfortable', 'luxury']),
  totalBudget: z.number().min(100, 'Budget must be at least 100'),
  currency: z.string().default('INR'),
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
  pace: z.enum(['relaxed', 'balanced', 'fast-paced']),
  dietaryNeeds: z.string().optional(),
  accommodationType: z.string().default('Boutique Hotel'),
  transportPreference: z.string().default('Public Transit & Walking'),
  specialInstructions: z.string().optional()
});

test('Validation — Destination Required & Whitespace Handled', () => {
  // Empty destination
  const res1 = ItineraryRequestSchema.safeParse({
    destination: '',
    startDate: '2026-11-10',
    endDate: '2026-11-17',
    durationDays: 7,
    travelerType: 'couple',
    adultsCount: 2,
    childrenCount: 0,
    budgetStyle: 'comfortable',
    totalBudget: 240000,
    currency: 'INR',
    interests: ['Culture'],
    pace: 'balanced'
  });
  assert.strictEqual(res1.success, false);

  // Whitespace only destination
  const res2 = ItineraryRequestSchema.safeParse({
    destination: '     ',
    startDate: '2026-11-10',
    endDate: '2026-11-17',
    durationDays: 7,
    travelerType: 'couple',
    adultsCount: 2,
    childrenCount: 0,
    budgetStyle: 'comfortable',
    totalBudget: 240000,
    currency: 'INR',
    interests: ['Culture'],
    pace: 'balanced'
  });
  assert.strictEqual(res2.success, false);

  // Valid trimmed destination
  const res3 = ItineraryRequestSchema.safeParse({
    destination: '  Kyoto, Japan  ',
    startDate: '2026-11-10',
    endDate: '2026-11-17',
    durationDays: 7,
    travelerType: 'couple',
    adultsCount: 2,
    childrenCount: 0,
    budgetStyle: 'comfortable',
    totalBudget: 240000,
    currency: 'INR',
    interests: ['Culture'],
    pace: 'balanced'
  });
  assert.strictEqual(res3.success, true);
  if (res3.success) {
    assert.strictEqual(res3.data.destination, 'Kyoto, Japan');
  }
});

test('Validation — Traveler Headcounts & Non-negative Validation', () => {
  const baseValid = {
    destination: 'Amalfi Coast, Italy',
    startDate: '2026-06-12',
    endDate: '2026-06-17',
    durationDays: 5,
    travelerType: 'family',
    budgetStyle: 'comfortable',
    totalBudget: 340000,
    currency: 'INR',
    interests: ['Food'],
    pace: 'relaxed'
  };

  // 0 adults (Invalid)
  const res1 = ItineraryRequestSchema.safeParse({ ...baseValid, adultsCount: 0, childrenCount: 1 });
  assert.strictEqual(res1.success, false);

  // Negative children (Invalid)
  const res2 = ItineraryRequestSchema.safeParse({ ...baseValid, adultsCount: 2, childrenCount: -1 });
  assert.strictEqual(res2.success, false);

  // Valid counts
  const res3 = ItineraryRequestSchema.safeParse({ ...baseValid, adultsCount: 2, childrenCount: 2 });
  assert.strictEqual(res3.success, true);
});

test('Validation — Budget Limits & Currency Fallback', () => {
  const baseValid = {
    destination: 'Reykjavik, Iceland',
    startDate: '2026-08-01',
    endDate: '2026-08-06',
    durationDays: 5,
    travelerType: 'solo',
    adultsCount: 1,
    childrenCount: 0,
    budgetStyle: 'economy',
    interests: ['Adventure'],
    pace: 'fast-paced'
  };

  // Zero / Negative budget (Invalid)
  const res1 = ItineraryRequestSchema.safeParse({ ...baseValid, totalBudget: 0 });
  assert.strictEqual(res1.success, false);

  const res2 = ItineraryRequestSchema.safeParse({ ...baseValid, totalBudget: -500 });
  assert.strictEqual(res2.success, false);

  // Default currency INR when omitted
  const res3 = ItineraryRequestSchema.safeParse({ ...baseValid, totalBudget: 75000 });
  assert.strictEqual(res3.success, true);
  if (res3.success) {
    assert.strictEqual(res3.data.currency, 'INR');
  }
});

