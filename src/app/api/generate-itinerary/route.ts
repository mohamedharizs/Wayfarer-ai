import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateStructuredItinerary } from '@/lib/ai-generator';
import { Trip, TripPreferences } from '@/types/trip';

// Request Validation Schema
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

/**
 * Call Google Gemini REST API with strict JSON prompt, timeout, and schema validation
 */
async function callGeminiLive(prefs: TripPreferences, apiKey: string): Promise<Trip | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 14000); // 14s timeout

  try {
    const prompt = `
You are the master itinerary architect for WAYFARER AI, an ultra-premium editorial travel platform.
Generate a structured, authentic multi-day travel itinerary strictly matching the following JSON schema.
Crucial currency instruction: All monetary figures (totalPlanned, dailyEstimatedCost, activity estimatedCost) MUST be represented in ${prefs.currency || 'INR'} as raw NUMBERS (no symbols).
Do not hallucinate live ticket availability; provide realistic regional estimates in ${prefs.currency || 'INR'}.

Travel Requirements:
- Destination: ${prefs.destination}
- Departure City: ${prefs.departureCity || 'Not specified'}
- Duration: ${prefs.durationDays} days (${prefs.startDate} to ${prefs.endDate})
- Party: ${prefs.travelerType} (${prefs.adultsCount} adults, ${prefs.childrenCount} children)
- Travel Style: ${prefs.budgetStyle}
- Total Planned Budget: ${prefs.totalBudget} ${prefs.currency || 'INR'}
- Preferred Pace: ${prefs.pace}
- Selected Interests: ${prefs.interests.join(', ')}
- Accommodation Preference: ${prefs.accommodationType}
- Transit Preference: ${prefs.transportPreference}
- Special Requests: ${prefs.specialInstructions || 'None'}

Return ONLY a valid raw JSON object with keys:
{
  "title": string,
  "summary": string,
  "budget": {
    "flights": number,
    "accommodation": number,
    "food": number,
    "transportation": number,
    "activities": number,
    "shopping": number,
    "emergencyBuffer": number,
    "totalPlanned": number,
    "currency": "${prefs.currency || 'INR'}"
  },
  "days": [
    {
      "dayNumber": number,
      "date": string,
      "title": string,
      "theme": string,
      "weatherRecommendation": string,
      "activities": [
        {
          "id": string,
          "name": string,
          "time": string,
          "period": "morning" | "afternoon" | "evening",
          "category": "Culture" | "Food" | "Nature" | "Adventure" | "Relaxation" | "Architecture" | "Shopping" | "Nightlife" | "Sightseeing",
          "description": string,
          "duration": string,
          "estimatedCost": number,
          "location": { "name": string, "lat": number, "lng": number },
          "insiderTip": string,
          "bookingRequired": boolean
        }
      ]
    }
  ],
  "practicalTips": string[],
  "weatherAlternatives": string[]
}
`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: 'application/json'
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[Gemini API] Upstream error status: ${response.status}`);
      return null;
    }

    const json = await response.json();
    const candidateText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) return null;

    const parsedData = JSON.parse(candidateText);

    // Validate and sanitize budget calculation from application code
    const calculatedActivitiesCost = parsedData.days?.reduce((sum: number, day: { activities?: Array<{ estimatedCost?: number }> }) => {
      const daySum = day.activities?.reduce((s: number, a: { estimatedCost?: number }) => s + (Number(a.estimatedCost) || 0), 0) || 0;
      return sum + daySum;
    }, 0) || 0;

    const validBudget = {
      flights: Number(parsedData.budget?.flights) || Math.round(prefs.totalBudget * 0.35),
      accommodation: Number(parsedData.budget?.accommodation) || Math.round(prefs.totalBudget * 0.32),
      food: Number(parsedData.budget?.food) || Math.round(prefs.totalBudget * 0.17),
      transportation: Number(parsedData.budget?.transportation) || Math.round(prefs.totalBudget * 0.05),
      activities: calculatedActivitiesCost || Math.round(prefs.totalBudget * 0.06),
      shopping: Number(parsedData.budget?.shopping) || Math.round(prefs.totalBudget * 0.03),
      emergencyBuffer: Number(parsedData.budget?.emergencyBuffer) || Math.round(prefs.totalBudget * 0.02),
      totalPlanned: prefs.totalBudget,
      currency: prefs.currency || 'INR'
    };

    const sanitizedTrip: Trip = {
      id: 'trip-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      title: parsedData.title || `${prefs.durationDays} Days in ${prefs.destination}`,
      destination: prefs.destination,
      country: prefs.destination.split(',')[1]?.trim() || 'Global',
      coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      summary: parsedData.summary || `Personalized ${prefs.durationDays}-day itinerary for ${prefs.destination}.`,
      startDate: prefs.startDate,
      endDate: prefs.endDate,
      durationDays: prefs.durationDays,
      preferences: prefs,
      days: (parsedData.days || []).map((d: { dayNumber: number; date?: string; title: string; theme: string; weatherRecommendation?: string; activities?: Array<{ id: string; name: string; time: string; period: 'morning' | 'afternoon' | 'evening'; category: string; description: string; duration: string; estimatedCost: number; location?: { name: string; lat?: number; lng?: number }; insiderTip?: string; bookingRequired?: boolean }> }, i: number) => ({
        dayNumber: d.dayNumber || i + 1,
        date: d.date || prefs.startDate,
        title: d.title || `Day ${i + 1}`,
        theme: d.theme || 'Discovery',
        weatherRecommendation: d.weatherRecommendation || 'Comfortable day temperatures expected.',
        dailyEstimatedCost: (d.activities || []).reduce((s: number, a: { estimatedCost?: number }) => s + (Number(a.estimatedCost) || 0), 0),
        activities: (d.activities || []).map((act, actIdx: number) => ({
          id: act.id || `act-${i + 1}-${actIdx + 1}`,
          name: act.name || 'Local Cultural Exploration',
          time: act.time || '10:00 AM',
          period: act.period || (actIdx === 0 ? 'morning' : actIdx === 1 ? 'afternoon' : 'evening'),
          category: (act.category as Trip['days'][0]['activities'][0]['category']) || 'Sightseeing',
          description: act.description || 'Experience local architectural and cultural highlights.',
          duration: act.duration || '2.0 hrs',
          estimatedCost: Number(act.estimatedCost) || 0,
          location: act.location || { name: prefs.destination },
          insiderTip: act.insiderTip || 'Arrive early to avoid peak mid-day lines.',
          bookingRequired: Boolean(act.bookingRequired),
          isCompleted: false
        }))
      })),
      budget: validBudget,
      actualExpenses: [],
      practicalTips: parsedData.practicalTips || [
        `Keep digital & physical copies of your booking confirmations.`,
        `Carry local cash for traditional street vendors and transit tickets.`
      ],
      weatherAlternatives: parsedData.weatherAlternatives || [
        `In case of rain, explore historic covered arcades or landmark indoor galleries.`
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isShared: false
    };

    return sanitizedTrip;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('[Gemini API] Exception while calling live model:', err instanceof Error ? err.message : err);
    return null;
  }
}

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

    // Check if server-side Gemini API key is configured
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey && geminiApiKey.trim() !== '') {
      const liveTrip = await callGeminiLive(prefs, geminiApiKey.trim());
      if (liveTrip) {
        return NextResponse.json({
          success: true,
          data: liveTrip,
          provider: 'gemini-live',
          currency: prefs.currency || 'INR'
        });
      }
    }

    // High-performance algorithmic fallback engine
    const itinerary = generateStructuredItinerary(prefs);

    return NextResponse.json({
      success: true,
      data: itinerary,
      provider: 'wayfarer-engine-standard',
      currency: prefs.currency || 'INR'
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    return NextResponse.json(
      { error: 'Failed to generate itinerary', message },
      { status: 500 }
    );
  }
}
