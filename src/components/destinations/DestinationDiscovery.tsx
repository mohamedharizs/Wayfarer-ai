'use client';

import React, { useState } from 'react';
import { Search, MapPin, Sparkles, Filter, X, RotateCcw } from 'lucide-react';
import { CURATED_DESTINATIONS } from '@/data/destinations';
import { Destination } from '@/types/trip';

interface DestinationDiscoveryProps {
  onPlanDestination: (dest: Destination) => void;
}

export default function DestinationDiscovery({ onPlanDestination }: DestinationDiscoveryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');

  const filteredDestinations = CURATED_DESTINATIONS.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRegion = selectedRegion === 'all' || dest.region.toLowerCase() === selectedRegion.toLowerCase();
    const matchesStyle = selectedStyle === 'all' || dest.travelStyle === selectedStyle;

    return matchesSearch && matchesRegion && matchesStyle;
  });

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedRegion('all');
    setSelectedStyle('all');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCE9DF] text-[#176B52] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Travel Inspirations</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#101827]">
          Discover Extraordinary Destinations
        </h2>
        <p className="text-sm sm:text-base text-[#64748B] max-w-2xl">
          Explore iconic landscapes and historic capitals. Each destination is pre-configured with realistic budgets, suggested durations, and curated attractions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by city, country, or interest..."
            className="w-full pl-10 pr-9 py-2 rounded-xl border border-[#E5E7EB] bg-[#F8F7F3] text-sm focus:ring-2 focus:ring-[#176B52] focus:bg-white focus:outline-hidden"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Region & Style Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-[#64748B] font-semibold uppercase flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Region:</span>
          </span>
          {['all', 'Asia', 'Europe', 'Americas'].map((reg) => (
            <button
              type="button"
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
                selectedRegion === reg
                  ? 'bg-[#176B52] text-white shadow-2xs'
                  : 'bg-[#F8F7F3] text-[#475569] hover:bg-slate-200'
              }`}
            >
              {reg}
            </button>
          ))}

          <span className="text-xs text-[#64748B] font-semibold uppercase ml-2 flex items-center gap-1">
            <span>Style:</span>
          </span>
          {['all', 'economy', 'comfortable', 'luxury'].map((style) => (
            <button
              type="button"
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
                selectedStyle === style
                  ? 'bg-[#101827] text-white shadow-2xs'
                  : 'bg-[#F8F7F3] text-[#475569] hover:bg-slate-200'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#64748B]">
        <span>Showing {filteredDestinations.length} curated {filteredDestinations.length === 1 ? 'destination' : 'destinations'}</span>
        {(searchTerm || selectedRegion !== 'all' || selectedStyle !== 'all') && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-[#176B52] hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Destination Grid or Empty State */}
      {filteredDestinations.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-[#E5E7EB] space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#101827]">
              No matching destinations found
            </h3>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              We couldn&apos;t find any curated journeys matching &quot;{searchTerm}&quot;. Try adjusting your keywords or clearing the filters.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-[#176B52] text-white text-xs font-semibold hover:bg-[#125440] transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              className="group rounded-3xl bg-white border border-[#E5E7EB] overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Destination Image Banner */}
              <div className="relative h-56 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dest.heroImage}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Badges on Image */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-semibold">
                    {dest.region}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#176B52] text-xs font-bold capitalize">
                    {dest.travelStyle}
                  </span>
                </div>

                {/* Title on Image bottom */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-serif text-2xl font-bold tracking-tight">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D6AD60]" />
                    <span>{dest.country}</span>
                    <span className="mx-1">·</span>
                    <span>Best: {dest.bestMonths}</span>
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-sm text-[#475569] leading-relaxed">
                  {dest.description}
                </p>

                {/* Key Highlights */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                    Top Highlights
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {dest.highlights.map((h) => (
                      <span
                        key={h}
                        className="text-xs px-2.5 py-1 rounded-lg bg-[#F8F7F3] text-[#101827] border border-[#E5E7EB]"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Metrics & CTA */}
                <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#64748B] block">Avg. Daily Budget</span>
                    <span className="text-sm font-bold text-[#101827]">
                      ${dest.avgDailyBudget} / day
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onPlanDestination(dest)}
                    className="px-4 py-2 rounded-xl bg-[#176B52] text-white text-xs font-semibold hover:bg-[#125440] active:scale-95 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D6AD60]" />
                    <span>Plan This Trip</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
