'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Info, Compass } from 'lucide-react';
import { Activity } from '@/types/trip';

interface TripMapProps {
  activities: Activity[];
  destinationName: string;
  selectedActivityId?: string | null;
  onSelectActivity: (id: string) => void;
}

export default function TripMap({
  activities,
  destinationName,
  selectedActivityId,
  onSelectActivity
}: TripMapProps) {
  const [activeMarker, setActiveMarker] = useState<string | null>(selectedActivityId || null);

  // Filter activities with valid locations
  const mappedActivities = activities.filter(a => a.location?.lat && a.location?.lng);
  const selectedActivity = activities.find(a => a.id === (activeMarker || selectedActivityId));

  // Generate external Google Maps / OpenStreetMap directions link
  const openExternalDirections = () => {
    if (selectedActivity?.location?.lat && selectedActivity?.location?.lng) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          selectedActivity.location.name || destinationName
        )}`,
        '_blank',
        'noopener,noreferrer'
      );
    } else {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destinationName)}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-sm flex flex-col h-full min-h-[450px]">
      {/* Map Header */}
      <div className="px-5 py-4 border-b border-[#E5E7EB] bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#176B52] flex items-center justify-center text-white">
            <Compass className="w-4 h-4 text-[#DCE9DF]" />
          </div>
          <div>
            <h4 className="font-serif text-sm font-bold text-[#101827]">
              Interactive Route Map
            </h4>
            <p className="text-[11px] text-[#64748B]">
              {destinationName} · {mappedActivities.length} Waypoints
            </p>
          </div>
        </div>

        <button
          onClick={openExternalDirections}
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-[#176B52] hover:bg-[#DCE9DF]/40 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <span>Open Directions</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Visual Cartographic Canvas */}
      <div className="relative flex-1 bg-[#EEF2F6] overflow-hidden min-h-[280px] p-4 flex flex-col justify-between">
        {/* Subtle Map Grid lines simulation */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#176B52_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Top notice banner */}
        <div className="relative z-10 self-start bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full border border-slate-200 text-xs text-[#475569] shadow-2xs flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#176B52]" />
          <span>Coordinates centered around {destinationName}</span>
        </div>

        {/* Interactive Pinboard */}
        <div className="relative z-10 w-full my-auto py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
            {activities.map((act, idx) => {
              const isSelected = act.id === (activeMarker || selectedActivityId);
              return (
                <button
                  key={act.id}
                  onClick={() => {
                    setActiveMarker(act.id);
                    onSelectActivity(act.id);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all backdrop-blur-xs cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#176B52] shadow-md ring-2 ring-[#176B52]/20'
                      : 'bg-white/85 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isSelected
                          ? 'bg-[#176B52] text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[11px] font-semibold text-[#64748B] block">
                        {act.time} · {act.period}
                      </span>
                      <span className="text-xs font-bold text-[#101827] truncate block">
                        {act.name}
                      </span>
                      <span className="text-[11px] text-slate-500 truncate block mt-0.5">
                        {act.location?.name || destinationName}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Marker Detail Drawer */}
        {selectedActivity && (
          <div className="relative z-10 bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-lg flex items-center justify-between gap-4 mt-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#DCE9DF] flex items-center justify-center text-[#176B52]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#101827]">
                  {selectedActivity.name}
                </h5>
                <p className="text-[11px] text-[#64748B]">
                  {selectedActivity.location?.name || destinationName} · Approx. {selectedActivity.duration}
                </p>
              </div>
            </div>

            <button
              onClick={openExternalDirections}
              className="px-3 py-1.5 rounded-xl bg-[#176B52] text-white text-xs font-medium hover:bg-[#125440] transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Navigate</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

