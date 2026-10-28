export type TravelStyle = 'economy' | 'comfortable' | 'luxury';
export type TravelPace = 'relaxed' | 'balanced' | 'fast-paced';
export type TravelerType = 'solo' | 'couple' | 'family' | 'group';

export type ActivityCategory =
  | 'Culture'
  | 'Food'
  | 'Nature'
  | 'Adventure'
  | 'Relaxation'
  | 'Architecture'
  | 'Shopping'
  | 'Nightlife'
  | 'Sightseeing';

export interface ActivityLocation {
  name: string;
  lat?: number;
  lng?: number;
  address?: string;
}

export interface Activity {
  id: string;
  name: string;
  time: string;
  period: 'morning' | 'afternoon' | 'evening';
  category: ActivityCategory;
  description: string;
  duration: string; // e.g. "2.5 hrs"
  estimatedCost: number; // in USD
  location: ActivityLocation;
  isCompleted?: boolean;
  insiderTip?: string;
  bookingRequired?: boolean;
}

export interface ItineraryDay {
  dayNumber: number;
  date?: string;
  title: string;
  theme: string;
  activities: Activity[];
  dailyEstimatedCost: number;
  weatherRecommendation?: string;
}

export interface BudgetBreakdown {
  flights: number;
  accommodation: number;
  food: number;
  transportation: number;
  activities: number;
  shopping: number;
  emergencyBuffer: number;
  totalPlanned: number;
  currency: string;
}

export interface ActualExpense {
  id: string;
  title: string;
  amount: number;
  category: keyof Omit<BudgetBreakdown, 'totalPlanned' | 'currency'>;
  date: string;
}

export interface TripPreferences {
  destination: string;
  departureCity?: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  travelerType: TravelerType;
  adultsCount: number;
  childrenCount: number;
  budgetStyle: TravelStyle;
  totalBudget: number;
  currency: string;
  interests: string[];
  pace: TravelPace;
  dietaryNeeds?: string;
  accommodationType: string;
  transportPreference: string;
  specialInstructions?: string;
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  country: string;
  coverImage: string;
  summary: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  preferences: TripPreferences;
  days: ItineraryDay[];
  budget: BudgetBreakdown;
  actualExpenses?: ActualExpense[];
  practicalTips: string[];
  weatherAlternatives: string[];
  createdAt: string;
  updatedAt: string;
  isShared?: boolean;
  shareId?: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  region: 'Asia' | 'Europe' | 'Americas' | 'Oceania' | 'Africa';
  tagline: string;
  description: string;
  heroImage: string;
  highlights: string[];
  suggestedDurationDays: number;
  avgDailyBudget: number;
  currency: string;
  bestMonths: string;
  tags: string[];
  travelStyle: TravelStyle;
  lat: number;
  lng: number;
}

