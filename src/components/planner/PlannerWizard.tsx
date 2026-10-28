'use client';

import React, { useState } from 'react';
import {
  MapPin, DollarSign,
  ArrowRight, ArrowLeft, Sparkles, X, Loader2
} from 'lucide-react';
import { Trip, TripPreferences, TravelStyle, TravelPace, TravelerType } from '@/types/trip';
import { generateStructuredItinerary } from '@/lib/ai-generator';
import { saveTrip } from '@/lib/storage';

interface PlannerWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onTripGenerated: (trip: Trip) => void;
  initialData?: {
    destination?: string;
    departureCity?: string;
    durationDays?: number;
    travelers?: number;
    budgetStyle?: TravelStyle;
  };
}

const INTERESTS_OPTIONS = [
  { id: 'Food & Local Cuisine', label: 'Food & Local Cuisine', icon: '🍜' },
  { id: 'Culture & History', label: 'Culture & History', icon: '🏛️' },
  { id: 'Nature & Landscapes', label: 'Nature & Landscapes', icon: '🌲' },
  { id: 'Adventure & Hiking', label: 'Adventure & Hiking', icon: '🥾' },
  { id: 'Art & Architecture', label: 'Art & Architecture', icon: '🎨' },
  { id: 'Photography', label: 'Photography', icon: '📷' },
  { id: 'Relaxation & Wellness', label: 'Relaxation & Wellness', icon: '🧘' },
  { id: 'Beaches & Coastal', label: 'Beaches & Coastal', icon: '🏖️' },
  { id: 'Nightlife & Bars', label: 'Nightlife & Bars', icon: '🍸' },
  { id: 'Local Shopping & Markets', label: 'Shopping & Markets', icon: '🛍️' }
];

export default function PlannerWizard({
  isOpen,
  onClose,
  onTripGenerated,
  initialData
}: PlannerWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Analyzing regional highlights...');

  // Form State
  const [destination, setDestination] = useState(initialData?.destination || 'Kyoto, Japan');
  const [departureCity, setDepartureCity] = useState(initialData?.departureCity || 'San Francisco (SFO)');
  const [durationDays, setDurationDays] = useState(initialData?.durationDays || 7);
  const [startDate, setStartDate] = useState('2026-11-10');
  const [flexibleDates, setFlexibleDates] = useState(false);
  
  const [travelerType, setTravelerType] = useState<TravelerType>(
    initialData?.travelers === 1 ? 'solo' : initialData?.travelers === 2 ? 'couple' : 'family'
  );
  const [adultsCount, setAdultsCount] = useState(initialData?.travelers || 2);
  const [childrenCount, setChildrenCount] = useState(0);

  const [budgetStyle, setBudgetStyle] = useState<TravelStyle>(initialData?.budgetStyle || 'comfortable');
  const [totalBudget, setTotalBudget] = useState(2800);
  const [currency, setCurrency] = useState('USD');

  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Culture & History',
    'Food & Local Cuisine',
    'Art & Architecture'
  ]);

  const [pace, setPace] = useState<TravelPace>('balanced');
  const [dietaryNeeds, setDietaryNeeds] = useState('No restrictions');
  const [accommodationType, setAccommodationType] = useState('Boutique Hotel');
  const [transportPreference, setTransportPreference] = useState('Public Transit & Walking');
  const [specialInstructions, setSpecialInstructions] = useState('');

  if (!isOpen) return null;

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter(i => i !== id));
      }
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const calculateEndDate = (start: string, days: number) => {
    try {
      const d = new Date(start);
      d.setDate(d.getDate() + days - 1);
      return d.toISOString().split('T')[0];
    } catch {
      return '2026-11-16';
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    const messages = [
      'Analyzing destination highlights & neighborhood pacing...',
      'Curating morning, afternoon, and evening activities...',
      'Matching authentic local food & cultural experiences...',
      'Calculating realistic itemized budget estimates...',
      'Finalizing your customized travel itinerary...'
    ];

    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      setLoadingMessage(messages[msgIdx]);
    }, 900);

    const calculatedEndDate = calculateEndDate(startDate, durationDays);

    const preferences: TripPreferences = {
      destination,
      departureCity,
      startDate,
      endDate: calculatedEndDate,
      durationDays,
      travelerType,
      adultsCount,
      childrenCount,
      budgetStyle,
      totalBudget,
      currency,
      interests: selectedInterests,
      pace,
      dietaryNeeds,
      accommodationType,
      transportPreference,
      specialInstructions
    };

    try {
      // Attempt server API call first
      const res = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });

      let trip: Trip;
      if (res.ok) {
        const json = await res.json();
        trip = json.data;
      } else {
        // Fallback to client-side engine
        trip = generateStructuredItinerary(preferences);
      }

      // Save to localStorage
      saveTrip(trip);
      clearInterval(interval);
      setIsGenerating(false);
      onTripGenerated(trip);
      onClose();
    } catch (e) {
      console.warn('Fallback to local itinerary generator engine:', e);
      const trip = generateStructuredItinerary(preferences);
      saveTrip(trip);
      clearInterval(interval);
      setIsGenerating(false);
      onTripGenerated(trip);
      onClose();
    }
  };

  const totalSteps = 7;
  const progressPct = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#F8F7F3] rounded-3xl shadow-2xl border border-[#E5E7EB] overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-white border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#176B52] flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5 text-[#D6AD60]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#101827]">
                AI Trip Planning Wizard
              </h3>
              <p className="text-xs text-[#64748B]">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#E5E7EB] h-1.5">
          <div
            className="bg-[#176B52] h-1.5 transition-all duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Wizard Body Content */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto">
          {/* STEP 1: DESTINATION */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif text-2xl font-bold text-[#101827]">
                  Where do you want to travel?
                </h4>
                <p className="text-sm text-[#64748B] mt-1">
                  Specify your dream destination, country, or specific city.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                    Destination *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-[#176B52]" />
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="e.g. Kyoto, Japan or Amalfi Coast, Italy"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#101827] focus:ring-2 focus:ring-[#176B52] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                    Departure City / Airport (Optional)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={departureCity}
                      onChange={(e) => setDepartureCity(e.target.value)}
                      placeholder="e.g. London Heathrow (LHR) or New York (JFK)"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#101827] focus:ring-2 focus:ring-[#176B52] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DATES & DURATION */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif text-2xl font-bold text-[#101827]">
                  When are you going?
                </h4>
                <p className="text-sm text-[#64748B] mt-1">
                  Choose your departure date and planned trip length.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                      Departure Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#101827] focus:ring-2 focus:ring-[#176B52] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                      Trip Duration ({durationDays} Days)
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="14"
                      value={durationDays}
                      onChange={(e) => setDurationDays(parseInt(e.target.value, 10))}
                      className="w-full accent-[#176B52] mt-3 cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-[#64748B] mt-1">
                      <span>2 Days</span>
                      <span className="font-semibold text-[#176B52]">{durationDays} Days</span>
                      <span>14 Days</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="flexibleDates"
                    checked={flexibleDates}
                    onChange={(e) => setFlexibleDates(e.target.checked)}
                    className="w-4 h-4 rounded text-[#176B52] focus:ring-[#176B52] cursor-pointer"
                  />
                  <label htmlFor="flexibleDates" className="text-sm text-[#475569] cursor-pointer">
                    My travel dates are flexible (±3 days)
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: TRAVELERS */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif text-2xl font-bold text-[#101827]">
                  Who is traveling with you?
                </h4>
                <p className="text-sm text-[#64748B] mt-1">
                  We adapt pacing and venue choices to your travel party.
                </p>
              </div>

              {/* Traveler Party Type */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['solo', 'couple', 'family', 'group'] as TravelerType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setTravelerType(type);
                      if (type === 'solo') {
                        setAdultsCount(1);
                        setChildrenCount(0);
                      } else if (type === 'couple') {
                        setAdultsCount(2);
                        setChildrenCount(0);
                      }
                    }}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                      travelerType === type
                        ? 'border-[#176B52] bg-[#DCE9DF]/40 text-[#176B52] font-bold shadow-2xs'
                        : 'border-[#E5E7EB] bg-white text-[#475569] hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xl mb-1">
                      {type === 'solo' && '🎒'}
                      {type === 'couple' && '🥂'}
                      {type === 'family' && '🏡'}
                      {type === 'group' && '🎉'}
                    </div>
                    <span className="text-sm capitalize">{type}</span>
                  </button>
                ))}
              </div>

              {/* Headcounts */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-[#101827] block">Adults</span>
                    <span className="text-xs text-[#64748B]">Age 18+</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={adultsCount <= 1}
                      onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 disabled:opacity-40 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold text-sm">{adultsCount}</span>
                    <button
                      type="button"
                      onClick={() => setAdultsCount(adultsCount + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-[#101827] block">Children</span>
                    <span className="text-xs text-[#64748B]">Age 0–17</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={childrenCount <= 0}
                      onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 disabled:opacity-40 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold text-sm">{childrenCount}</span>
                    <button
                      type="button"
                      onClick={() => setChildrenCount(childrenCount + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: BUDGET & STYLE */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif text-2xl font-bold text-[#101827]">
                  What is your planned budget?
                </h4>
                <p className="text-sm text-[#64748B] mt-1">
                  Wayfarer AI will optimize dining and activity suggestions to fit comfortably.
                </p>
              </div>

              {/* Travel Style Selector */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'economy', label: 'Economy', desc: 'Hostels, street food & transit' },
                  { id: 'comfortable', label: 'Comfortable', desc: 'Boutique hotels & balanced dining' },
                  { id: 'luxury', label: 'Luxury', desc: 'Fine dining & private experiences' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setBudgetStyle(s.id as TravelStyle)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      budgetStyle === s.id
                        ? 'border-[#176B52] bg-[#DCE9DF]/40 shadow-2xs'
                        : 'border-[#E5E7EB] bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span className={`text-sm font-bold block ${budgetStyle === s.id ? 'text-[#176B52]' : 'text-[#101827]'}`}>
                      {s.label}
                    </span>
                    <span className="text-xs text-[#64748B] mt-1 block">
                      {s.desc}
                    </span>
                  </button>
                ))}
              </div>

              {/* Amount & Currency */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                    Estimated Total Budget
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-3.5 w-4 h-4 text-[#176B52]" />
                    <input
                      type="number"
                      step="50"
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(parseInt(e.target.value, 10) || 1000)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#101827] focus:ring-2 focus:ring-[#176B52] focus:outline-hidden font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#101827] focus:ring-2 focus:ring-[#176B52] focus:outline-hidden cursor-pointer"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="CAD">CAD ($)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: INTERESTS */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif text-2xl font-bold text-[#101827]">
                  What interests you most?
                </h4>
                <p className="text-sm text-[#64748B] mt-1">
                  Select your top experiences so we can tailor each day’s highlights.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                {INTERESTS_OPTIONS.map((item) => {
                  const isSelected = selectedInterests.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleInterest(item.id)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#176B52] bg-[#DCE9DF]/50 text-[#176B52] font-semibold'
                          : 'border-[#E5E7EB] bg-white text-[#475569] hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: PREFERENCES & PACE */}
          {currentStep === 6 && (
            <div className="space-y-5">
              <div>
                <h4 className="font-serif text-2xl font-bold text-[#101827]">
                  Fine-tune your travel pace & preferences
                </h4>
                <p className="text-sm text-[#64748B] mt-1">
                  Ensure every day feels natural and comfortable for your schedule.
                </p>
              </div>

              {/* Pace Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-2">
                  Preferred Pace
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'relaxed', label: 'Relaxed', desc: '1–2 sights/day with ample leisure' },
                    { id: 'balanced', label: 'Balanced', desc: '3–4 key spots, leisurely dining' },
                    { id: 'fast-paced', label: 'Fast-Paced', desc: 'Action-packed, maximize sights' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPace(p.id as TravelPace)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        pace === p.id
                          ? 'border-[#176B52] bg-[#DCE9DF]/40 font-bold text-[#176B52]'
                          : 'border-[#E5E7EB] bg-white text-[#475569] hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs block font-bold">{p.label}</span>
                      <span className="text-[11px] text-[#64748B] mt-0.5 block">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Considerations */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  Dietary Considerations
                </label>
                <select
                  value={dietaryNeeds}
                  onChange={(e) => setDietaryNeeds(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#101827] focus:ring-2 focus:ring-[#176B52] focus:outline-hidden"
                >
                  <option value="No restrictions">No restrictions</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Halal">Halal</option>
                  <option value="Kosher">Kosher</option>
                  <option value="Gluten-Free">Gluten-Free</option>
                </select>
              </div>

              {/* Accommodation & Transit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                    Accommodation Style
                  </label>
                  <select
                    value={accommodationType}
                    onChange={(e) => setAccommodationType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#101827] focus:ring-2 focus:ring-[#176B52] focus:outline-hidden"
                  >
                    <option value="Boutique Hotel">Boutique Hotel</option>
                    <option value="Luxury Resort">Luxury Resort</option>
                    <option value="Traditional Ryokan / Guesthouse">Traditional Ryokan / Guesthouse</option>
                    <option value="Cozy Airbnb / Apartment">Cozy Airbnb / Apartment</option>
                    <option value="Budget Hostel">Budget Hostel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                    Transportation Preference
                  </label>
                  <select
                    value={transportPreference}
                    onChange={(e) => setTransportPreference(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#101827] focus:ring-2 focus:ring-[#176B52] focus:outline-hidden"
                  >
                    <option value="Public Transit & Walking">Public Transit & Walking</option>
                    <option value="Rental Car">Rental Car</option>
                    <option value="Taxis & Rideshare">Taxis & Rideshare</option>
                    <option value="Bicycle & Walking">Bicycle & Walking</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  Special Travel Notes / Requests
                </label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Traveling with baby stroller, prefer morning tea shops..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#101827] focus:ring-2 focus:ring-[#176B52] focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* STEP 7: REVIEW & SUMMARY */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif text-2xl font-bold text-[#101827]">
                  Ready to craft your journey
                </h4>
                <p className="text-sm text-[#64748B] mt-1">
                  Review your travel details before our AI generates your custom itinerary.
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-5 bg-white rounded-2xl border border-[#E5E7EB] space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4 border-b border-[#E5E7EB]">
                  <div>
                    <span className="text-xs uppercase text-[#64748B] font-semibold block">Destination</span>
                    <span className="text-sm font-bold text-[#101827]">{destination}</span>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-[#64748B] font-semibold block">Duration</span>
                    <span className="text-sm font-bold text-[#101827]">{durationDays} Days</span>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-[#64748B] font-semibold block">Party</span>
                    <span className="text-sm font-bold text-[#101827] capitalize">{travelerType} ({adultsCount} adults)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4 border-b border-[#E5E7EB]">
                  <div>
                    <span className="text-xs uppercase text-[#64748B] font-semibold block">Style</span>
                    <span className="text-sm font-bold text-[#176B52] capitalize">{budgetStyle} (${totalBudget} {currency})</span>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-[#64748B] font-semibold block">Pace</span>
                    <span className="text-sm font-bold text-[#101827] capitalize">{pace}</span>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-[#64748B] font-semibold block">Departure</span>
                    <span className="text-sm font-bold text-[#101827]">{startDate}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs uppercase text-[#64748B] font-semibold block mb-1.5">Top Selected Interests</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedInterests.map(i => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-[#DCE9DF] text-[#176B52] font-semibold">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Loading animation during generation */}
              {isGenerating && (
                <div className="p-6 bg-[#DCE9DF]/40 rounded-2xl border border-[#176B52]/20 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-[#176B52] animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-[#176B52]">
                    {loadingMessage}
                  </p>
                  <p className="text-xs text-[#64748B]">
                    Structuring day schedules, geo-locations & smart budget breakdown...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-white border-t border-[#E5E7EB] flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-5 py-2.5 rounded-full border border-[#E5E7EB] text-[#475569] text-sm font-medium hover:bg-slate-50 flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-slate-500 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-6 py-2.5 rounded-full bg-[#101827] text-white text-sm font-medium hover:bg-[#1f2937] active:scale-95 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 text-[#D6AD60]" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerate}
              className="px-8 py-2.5 rounded-full bg-[#176B52] text-white text-sm font-semibold hover:bg-[#125440] active:scale-95 transition-all flex items-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#D6AD60]" />
                  <span>Generating Itinerary...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#D6AD60]" />
                  <span>Generate My Itinerary</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

