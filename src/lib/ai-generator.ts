import { Trip, TripPreferences, ItineraryDay, Activity, BudgetBreakdown } from '../types/trip';

// Destination presets with coordinates and localized highlights
const DESTINATION_INFO: Record<string, { lat: number; lng: number; country: string; image: string }> = {
  'kyoto': { lat: 35.0116, lng: 135.7681, country: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80' },
  'amalfi': { lat: 40.634, lng: 14.6027, country: 'Italy', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80' },
  'reykjavik': { lat: 64.1466, lng: -21.9426, country: 'Iceland', image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80' },
  'oaxaca': { lat: 17.0732, lng: -96.7266, country: 'Mexico', image: 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=1200&q=80' },
  'swiss': { lat: 46.5935, lng: 7.9091, country: 'Switzerland', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80' },
  'alps': { lat: 46.5935, lng: 7.9091, country: 'Switzerland', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80' },
  'banff': { lat: 51.1784, lng: -115.5708, country: 'Canada', image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=80' },
  'paris': { lat: 48.8566, lng: 2.3522, country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80' },
  'tokyo': { lat: 35.6762, lng: 139.6503, country: 'Japan', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80' },
  'bali': { lat: -8.4095, lng: 115.1889, country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80' },
  'rome': { lat: 41.9028, lng: 12.4964, country: 'Italy', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80' },
  'barcelona': { lat: 41.3851, lng: 2.1734, country: 'Spain', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80' }
};

export function getDestinationGeo(dest: string) {
  const lower = dest.toLowerCase();
  for (const [key, val] of Object.entries(DESTINATION_INFO)) {
    if (lower.includes(key)) {
      return val;
    }
  }
  // Default to Paris / scenic if unspecified
  return {
    lat: 48.8566,
    lng: 2.3522,
    country: 'International',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'
  };
}

export function generateStructuredItinerary(prefs: TripPreferences): Trip {
  const geo = getDestinationGeo(prefs.destination);
  const duration = Math.max(1, Math.min(prefs.durationDays || 4, 14));
  const budgetMultiplier = prefs.budgetStyle === 'luxury' ? 1.8 : prefs.budgetStyle === 'economy' ? 0.7 : 1.0;
  const travelersTotal = (prefs.adultsCount || 1) + (prefs.childrenCount || 0);

  const totalBudget = prefs.totalBudget || (duration * 200 * budgetMultiplier * travelersTotal);
  
  // Calculate category budget breakdown
  const budget: BudgetBreakdown = {
    flights: Math.round(totalBudget * 0.32),
    accommodation: Math.round(totalBudget * 0.30),
    food: Math.round(totalBudget * 0.18),
    transportation: Math.round(totalBudget * 0.06),
    activities: Math.round(totalBudget * 0.08),
    shopping: Math.round(totalBudget * 0.03),
    emergencyBuffer: Math.round(totalBudget * 0.03),
    totalPlanned: Math.round(totalBudget),
    currency: prefs.currency || 'USD'
  };

  const days: ItineraryDay[] = [];
  const primaryInterests = prefs.interests && prefs.interests.length > 0 ? prefs.interests : ['Culture & History', 'Food & Local Cuisine', 'Sightseeing'];

  for (let d = 1; d <= duration; d++) {
    const dayTheme = primaryInterests[(d - 1) % primaryInterests.length] || 'Discovery & Exploration';
    days.push(generateSingleDay(d, prefs, dayTheme, geo));
  }

  const tripId = 'trip-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);

  return {
    id: tripId,
    title: `${duration} Days in ${prefs.destination}: ${primaryInterests.slice(0, 2).join(' & ')}`,
    destination: prefs.destination,
    country: geo.country,
    coverImage: geo.image,
    summary: `A personalized ${duration}-day journey crafted for a ${prefs.travelerType} trip. Features ${prefs.pace} pacing, handpicked local dining, and culturally authentic landmarks.`,
    startDate: prefs.startDate || new Date().toISOString().split('T')[0],
    endDate: prefs.endDate || new Date(Date.now() + duration * 86400000).toISOString().split('T')[0],
    durationDays: duration,
    preferences: prefs,
    days,
    budget,
    actualExpenses: [],
    practicalTips: [
      `Keep digital & physical copies of your booking confirmations and passport photo page.`,
      `Local peak hours typically run 08:30–10:00 AM and 05:00–07:00 PM; plan transit outside these windows.`,
      `Most boutique attractions offer skip-the-line passes online; advance purchase is recommended.`,
      `Download an offline vector map of ${prefs.destination} before departure for uninterrupted navigation.`
    ],
    weatherAlternatives: [
      `During inclement weather, explore landmark indoor museums, historic covered food halls, or attend a craft workshop.`,
      `Many local cafes provide heated outdoor seating verandas with scenic courtyard views.`
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isShared: false
  };
}

export function generateSingleDay(
  dayNumber: number,
  prefs: TripPreferences,
  theme: string,
  geo: { lat: number; lng: number }
): ItineraryDay {
  const latOffset = (Math.random() - 0.5) * 0.03;
  const lngOffset = (Math.random() - 0.5) * 0.03;
  const centerLat = geo.lat + latOffset;
  const centerLng = geo.lng + lngOffset;

  const activities: Activity[] = [
    {
      id: `act-${dayNumber}-1`,
      name: `Morning Landmark Discovery: ${theme}`,
      time: '09:00 AM',
      period: 'morning',
      category: 'Sightseeing',
      description: `Explore the premier cultural landmark associated with ${prefs.destination}. Take advantage of morning serenity and soft lighting.`,
      duration: '2.5 hrs',
      estimatedCost: prefs.budgetStyle === 'luxury' ? 45 : 20,
      location: {
        name: `Historic Quarter & Landmark Plaza, ${prefs.destination}`,
        lat: centerLat + 0.005,
        lng: centerLng + 0.005
      },
      insiderTip: 'Arrive 15 minutes prior to gate opening to experience the grounds before tour groups.',
      isCompleted: false
    },
    {
      id: `act-${dayNumber}-2`,
      name: `Authentic Regional Lunch & Tasting`,
      time: '12:30 PM',
      period: 'afternoon',
      category: 'Food',
      description: `Savor seasonal dishes highlighting local specialties. Recommended: house-made specialties and regional beverages.`,
      duration: '1.5 hrs',
      estimatedCost: prefs.budgetStyle === 'luxury' ? 65 : 28,
      location: {
        name: `Old Town Artisan Bistro, ${prefs.destination}`,
        lat: centerLat - 0.003,
        lng: centerLng + 0.002
      },
      insiderTip: 'Request a quiet courtyard table and inquire about the daily farm-to-table chef specials.',
      isCompleted: false
    },
    {
      id: `act-${dayNumber}-3`,
      name: `Scenic Walking Circuit & Hidden Artisan Alleys`,
      time: '03:00 PM',
      period: 'afternoon',
      category: 'Culture',
      description: `Wander through scenic pedestrian lanes, boutique craft studios, and historic architectural facades.`,
      duration: '2.0 hrs',
      estimatedCost: 0,
      location: {
        name: `Artisan Guild Walkway, ${prefs.destination}`,
        lat: centerLat + 0.008,
        lng: centerLng - 0.006
      },
      insiderTip: 'A wonderful spot for candid street photography and local handcrafted souvenirs.',
      isCompleted: false
    },
    {
      id: `act-${dayNumber}-4`,
      name: `Golden Hour Viewpoint & Evening Dining`,
      time: '07:00 PM',
      period: 'evening',
      category: 'Food',
      description: `Unwind with an evening meal accompanied by panoramic views as the city lights turn on.`,
      duration: '2.5 hrs',
      estimatedCost: prefs.budgetStyle === 'luxury' ? 110 : 45,
      location: {
        name: `Panoramic Terrace Lounge, ${prefs.destination}`,
        lat: centerLat - 0.007,
        lng: centerLng - 0.004
      },
      insiderTip: 'Book in advance for tables along the perimeter railing for the best evening vista.',
      bookingRequired: true,
      isCompleted: false
    }
  ];

  const dailyEstimatedCost = activities.reduce((sum, a) => sum + a.estimatedCost, 0);

  return {
    dayNumber,
    title: `Day ${dayNumber}: Highlights of ${theme}`,
    theme,
    dailyEstimatedCost,
    weatherRecommendation: 'Comfortable day temperatures expected. Walking shoes strongly advised.',
    activities
  };
}

