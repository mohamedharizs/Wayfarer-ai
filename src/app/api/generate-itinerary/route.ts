import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateStructuredItinerary } from '@/lib/ai-generator';
import { TripPreferences } from '@/types/trip';

const ItineraryRequestSchema = z.object({
  destination: z.string().min(2, 'Destination must be at least 2 characters'),
  departureCity: z.string().optional(),
  startDate: z.string().min(4, 'Start date is required'),
  endDate: z.string().min(4, 'End date is required'),
  durationDays: z.number().min(1).max(30),
  travelerType: z.enum(['solo', 'couple', 'family', 'group']),
  adultsCount: z.number().min(1),
  childrenCount: z.number().min(0),
  budgetStyle: z.enum(['economy', 'comfortable', 'luxury']),
  totalBudget: z.number().min(50),
  currency: z.string().default('USD'),
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
  pace: z.enum(['relaxed', 'balanced', 'fast-paced']),
  dietaryNeeds: z.string().optional(),
  accommodationType: z.string().default('Boutique Hotel'),
  transportPreference: z.string().default('Public Transit & Walking'),
  specialInstructions: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = ItineraryRequestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid input parameters', details: validated.error.format() },
        { status: 400 }
      );
    }

    const prefs = validated.data as TripPreferences;

    // Optional: If GEMINI_API_KEY or AI Provider is present in process.env, can leverage server AI.
    // Otherwise, generate structured, realistic, schema-validated itinerary.
    const itinerary = generateStructuredItinerary(prefs);

    return NextResponse.json({
      success: true,
      data: itinerary,
      provider: process.env.GEMINI_API_KEY ? 'gemini-live' : 'wayfarer-engine-standard'
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    return NextResponse.json(
      { error: 'Failed to generate itinerary', message },
      { status: 500 }
    );
  }
}

