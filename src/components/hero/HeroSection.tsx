'use client';

import React, { useState } from 'react';
import { Sparkles, Calendar, Users, MapPin, ArrowRight, Compass, Star, Sun, ShieldCheck } from 'lucide-react';
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
      {/* Editorial Ambient Backdrops */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-[#DCE9DF]/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 -z-10 w-80 h-80 bg-[#D6AD60]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split Editorial Presentation: Left Copy, Right Visual Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-12">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCE9DF]/80 border border-[#176B52]/20 text-[#176B52] text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#176B52]" />
              <span>Intelligent Editorial Travel Design</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#101827] leading-[1.12]">
              The world is yours <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#176B52]">to explore.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#64748B] font-normal leading-relaxed max-w-xl">
              Transform your travel ideas into personalized, day-by-day itineraries. Geographically clustered activities, realistic cost modeling, and effortless offline access.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onStartPlanning()}
                className="px-7 py-3.5 rounded-full bg-[#101827] text-white text-sm font-semibold hover:bg-[#1f2937] active:scale-98 transition-all shadow-md flex items-center gap-2 cursor-pointer group"
              >
                <span>Plan Your Journey</span>
                <ArrowRight className="w-4 h-4 text-[#D6AD60] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onExploreDestinations}
                className="px-6 py-3.5 rounded-full bg-white border border-[#E5E7EB] text-[#101827] text-sm font-semibold hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
              >
                Explore Curated Cities
              </button>
            </div>

            {/* Trust & Quality Indicators */}
            <div className="pt-4 flex items-center gap-6 text-xs text-[#64748B] border-t border-[#E5E7EB]/70">
              <div className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#176B52]" />
                <span className="font-medium">Curated Local Gems</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D6AD60]" />
                <span className="font-medium">Transparent Cost Estimates</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Editorial Destination Preview Card */}
          <div className="lg:col-span-5 relative hidden sm:block">
            <div className="relative rounded-3xl overflow-hidden bg-white border border-[#E5E7EB] shadow-xl group transition-all duration-300 hover:shadow-2xl">
              {/* Cover Image */}
              <div className="relative h-64 sm:h-72 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80"
                  alt="Kyoto Japan"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101827]/80 via-[#101827]/20 to-transparent" />

                {/* Floating weather pill */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1.5 border border-white/20">
                  <Sun className="w-3.5 h-3.5 text-[#D6AD60]" />
                  <span>21°C · Clear Autumn</span>
                </div>

                {/* Floating rating badge */}
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#101827] text-xs font-bold flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Curated Expedition</span>
                </div>

                {/* Card Title on Image */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#DCE9DF] block mb-0.5">
                    Featured Journey
                  </span>
                  <h3 className="font-serif text-2xl font-bold tracking-tight">
                    Kyoto, Japan
                  </h3>
                  <p className="text-xs text-white/80 mt-0.5">
                    7 Days · Machiya Stays & Ancient Temples
                  </p>
                </div>
              </div>

              {/* Card Footer highlights */}
              <div className="p-4 bg-white flex items-center justify-between text-xs border-t border-slate-100">
                <div className="flex items-center gap-3 text-[#64748B]">
                  <span className="font-semibold text-[#101827]">$140/day est.</span>
                  <span>·</span>
                  <span>4 Highlights Scheduled</span>
                </div>

                <button
                  type="button"
                  onClick={() => onStartPlanning({ destination: 'Kyoto, Japan', durationDays: 7, budgetStyle: 'comfortable' })}
                  className="px-3 py-1.5 rounded-full bg-[#176B52] hover:bg-[#125440] text-white font-semibold transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <span>Use Template</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Elegant Trip Planning Search Panel */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl p-5 sm:p-7 shadow-xl border border-[#E5E7EB]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                  <span>Duration</span>
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
                <span className="text-xs text-[#64748B] font-semibold whitespace-nowrap">Popular:</span>
                {CURATED_DESTINATIONS.slice(0, 4).map((d) => (
                  <button
                    type="button"
                    key={d.id}
                    onClick={() => handleSelectPreset(d.name + ', ' + d.country, d.suggestedDurationDays)}
                    className="text-xs px-3 py-1 rounded-full bg-[#F8F7F3] hover:bg-[#DCE9DF] hover:text-[#176B52] text-[#475569] font-medium whitespace-nowrap transition-colors cursor-pointer border border-transparent hover:border-[#176B52]/20"
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
          <div className="p-4 rounded-2xl bg-white/70 border border-[#E5E7EB] shadow-2xs hover:border-slate-300 transition-colors">
            <div className="text-2xl font-bold font-serif text-[#101827]">100% Custom</div>
            <div className="text-xs text-[#64748B] mt-0.5">Built around your exact pace & budget</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/70 border border-[#E5E7EB] shadow-2xs hover:border-slate-300 transition-colors">
            <div className="text-2xl font-bold font-serif text-[#176B52]">Dynamic Days</div>
            <div className="text-xs text-[#64748B] mt-0.5">Regenerate individual days anytime</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/70 border border-[#E5E7EB] shadow-2xs hover:border-slate-300 transition-colors">
            <div className="text-2xl font-bold font-serif text-[#101827]">Interactive Maps</div>
            <div className="text-xs text-[#64748B] mt-0.5">Visual activity markers & coordinates</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/70 border border-[#E5E7EB] shadow-2xs hover:border-slate-300 transition-colors">
            <div className="text-2xl font-bold font-serif text-[#176B52]">Smart Budget</div>
            <div className="text-xs text-[#64748B] mt-0.5">Realistic itemized spending breakdown</div>
          </div>
        </div>
      </div>
    </section>
  );
}
