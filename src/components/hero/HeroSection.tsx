'use client';

import React, { useState } from 'react';
import { Sparkles, Calendar, Users, MapPin, ArrowRight } from 'lucide-react';
import { CURATED_DESTINATIONS } from '@/data/destinations';

interface HeroSectionProps {
  onStartPlanning: (initialData?: {
    destination?: string;
    departureCity?: string;
    durationDays?: number;
    travelers?: number;
    budgetStyle?: 'economy' | 'comfortable' | 'luxury';
  }) => void;
  onExploreDestinations: () => void;
}

export default function HeroSection({ onStartPlanning, onExploreDestinations }: HeroSectionProps) {
  const [destination, setDestination] = useState('');
  const [departureCity, setDepartureCity] = useState('');
  const [duration, setDuration] = useState('7');
  const [travelers, setTravelers] = useState('2');
  const [budgetStyle] = useState<'economy' | 'comfortable' | 'luxury'>('comfortable');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartPlanning({
      destination: destination.trim() || 'Kyoto, Japan',
      departureCity: departureCity.trim() || 'San Francisco (SFO)',
      durationDays: parseInt(duration, 10) || 7,
      travelers: parseInt(travelers, 10) || 2,
      budgetStyle
    });
  };

  const handleSelectPreset = (destName: string, defaultDays: number) => {
    setDestination(destName);
    setDuration(defaultDays.toString());
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 border-b border-[#E5E7EB]">
      {/* Background Decorative Gradient/Glow */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-[#DCE9DF]/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 -z-10 w-80 h-80 bg-[#D6AD60]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Headline & Tagline */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCE9DF]/70 border border-[#176B52]/20 text-[#176B52] text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#176B52]" />
            <span>AI-Crafted Tailored Itineraries</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#101827] leading-[1.15]">
            The world is yours to explore.
          </h1>

          <p className="text-lg sm:text-xl text-[#64748B] font-normal leading-relaxed max-w-2xl mx-auto">
            Turn your travel dreams into thoughtfully planned journeys with your personal AI travel companion.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onStartPlanning()}
              className="px-7 py-3.5 rounded-full bg-[#101827] text-white text-base font-medium hover:bg-[#1f2937] active:scale-98 transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Plan Your Journey</span>
              <ArrowRight className="w-4 h-4 text-[#D6AD60]" />
            </button>
            <button
              onClick={onExploreDestinations}
              className="px-6 py-3.5 rounded-full bg-white border border-[#E5E7EB] text-[#101827] text-base font-medium hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
            >
              Explore Destinations
            </button>
          </div>
        </div>

        {/* Elegant Trip Planning Search Panel */}
        <div className="mt-12 max-w-5xl mx-auto bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-[#E5E7EB]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Destination */}
              <div className="lg:col-span-2 relative">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#176B52]" />
                  <span>Where To?</span>
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Kyoto, Amalfi Coast, Swiss Alps"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] bg-[#F8F7F3] text-sm text-[#101827] placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#176B52] focus:bg-white transition-all"
                />
              </div>

              {/* Departure City */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Departure City</span>
                </label>
                <input
                  type="text"
                  value={departureCity}
                  onChange={(e) => setDepartureCity(e.target.value)}
                  placeholder="e.g. New York (JFK)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] bg-[#F8F7F3] text-sm text-[#101827] placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#176B52] focus:bg-white transition-all"
                />
              </div>

              {/* Duration & Dates */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#176B52]" />
                  <span>Duration (Days)</span>
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] bg-[#F8F7F3] text-sm text-[#101827] focus:outline-hidden focus:ring-2 focus:ring-[#176B52] focus:bg-white transition-all cursor-pointer"
                >
                  <option value="3">3 Days (Weekend escape)</option>
                  <option value="5">5 Days (Express journey)</option>
                  <option value="7">7 Days (Full week)</option>
                  <option value="10">10 Days (Deep immersion)</option>
                  <option value="14">14 Days (Grand odyssey)</option>
                </select>
              </div>

              {/* Travelers */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#176B52]" />
                  <span>Travelers</span>
                </label>
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] bg-[#F8F7F3] text-sm text-[#101827] focus:outline-hidden focus:ring-2 focus:ring-[#176B52] focus:bg-white transition-all cursor-pointer"
                >
                  <option value="1">1 Traveler (Solo)</option>
                  <option value="2">2 Travelers (Couple)</option>
                  <option value="4">4 Travelers (Family / Friends)</option>
                  <option value="6">6+ Travelers (Group)</option>
                </select>
              </div>
            </div>

            {/* Bottom Row: Style & Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E5E7EB]">
              {/* Quick Preset Tags */}
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto py-1">
                <span className="text-xs text-[#64748B] font-medium whitespace-nowrap">Popular:</span>
                {CURATED_DESTINATIONS.slice(0, 4).map((d) => (
                  <button
                    type="button"
                    key={d.id}
                    onClick={() => handleSelectPreset(d.name + ', ' + d.country, d.suggestedDurationDays)}
                    className="text-xs px-2.5 py-1 rounded-full bg-[#F8F7F3] hover:bg-[#DCE9DF] hover:text-[#176B52] text-[#475569] font-medium whitespace-nowrap transition-colors cursor-pointer"
                  >
                    {d.name}
                  </button>
                ))}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#176B52] text-white text-sm font-semibold hover:bg-[#125440] active:scale-98 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#D6AD60]" />
                <span>Generate Itinerary</span>
              </button>
            </div>
          </form>
        </div>

        {/* Highlight Metrics / Quality badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-4xl mx-auto">
          <div className="p-4 rounded-xl bg-white/60 border border-[#E5E7EB]">
            <div className="text-2xl font-bold font-serif text-[#101827]">100% Custom</div>
            <div className="text-xs text-[#64748B] mt-0.5">Built around your exact pace & budget</div>
          </div>
          <div className="p-4 rounded-xl bg-white/60 border border-[#E5E7EB]">
            <div className="text-2xl font-bold font-serif text-[#176B52]">Dynamic Days</div>
            <div className="text-xs text-[#64748B] mt-0.5">Regenerate individual days anytime</div>
          </div>
          <div className="p-4 rounded-xl bg-white/60 border border-[#E5E7EB]">
            <div className="text-2xl font-bold font-serif text-[#101827]">Interactive Maps</div>
            <div className="text-xs text-[#64748B] mt-0.5">Visual activity markers & coordinates</div>
          </div>
          <div className="p-4 rounded-xl bg-white/60 border border-[#E5E7EB]">
            <div className="text-2xl font-bold font-serif text-[#176B52]">Smart Budget</div>
            <div className="text-xs text-[#64748B] mt-0.5">Realistic itemized spending breakdown</div>
          </div>
        </div>
      </div>
    </section>
  );
}
