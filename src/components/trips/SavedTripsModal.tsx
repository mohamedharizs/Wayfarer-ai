'use client';

import React from 'react';
import { X, Trash2, Copy, Sparkles, Bookmark } from 'lucide-react';
import { Trip } from '@/types/trip';
import { formatCurrency } from '@/lib/currency';

interface SavedTripsModalProps {
  isOpen: boolean;
  trips: Trip[];
  activeTripId: string;
  onClose: () => void;
  onSelectTrip: (tripId: string) => void;
  onDeleteTrip: (tripId: string) => void;
  onDuplicateTrip: (trip: Trip) => void;
  onCreateNew: () => void;
}

export default function SavedTripsModal({
  isOpen,
  trips,
  activeTripId,
  onClose,
  onSelectTrip,
  onDeleteTrip,
  onDuplicateTrip,
  onCreateNew
}: SavedTripsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl bg-[#F8F7F3] rounded-3xl shadow-2xl border border-[#E5E7EB] overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-white border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#176B52] flex items-center justify-center text-white">
              <Bookmark className="w-5 h-5 text-[#DCE9DF]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#101827]">
                Your Saved Itineraries
              </h3>
              <p className="text-xs text-[#64748B]">
                {trips.length} {trips.length === 1 ? 'trip' : 'trips'} saved locally
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onCreateNew();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#176B52] text-white text-xs font-semibold hover:bg-[#125440] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D6AD60]" />
              <span>New Trip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Trips List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {trips.length === 0 ? (
            <div className="text-center py-12 text-sm text-[#64748B]">
              No saved trips yet. Click &quot;New Trip&quot; to design your first itinerary!
            </div>
          ) : (
            trips.map((trip) => {
              const isActive = trip.id === activeTripId;
              return (
                <div
                  key={trip.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-white border-[#176B52] shadow-md ring-1 ring-[#176B52]'
                      : 'bg-white border-[#E5E7EB] hover:border-slate-300 shadow-2xs'
                  } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
                >
                  {/* Trip Details */}
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#DCE9DF] text-[#176B52]">
                        {trip.durationDays} Days
                      </span>
                      {isActive && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#101827] text-white">
                          Active Now
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif text-base font-bold text-[#101827]">
                      {trip.title}
                    </h4>
                    <p className="text-xs text-[#64748B] flex items-center gap-2">
                      <span>{trip.destination}</span>
                      <span>·</span>
                      <span>Budget: {formatCurrency(trip.budget?.totalPlanned, trip.budget?.currency || 'INR')}</span>
                      <span>·</span>
                      <span>{trip.days?.length || 0} Days Planned</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => {
                        onSelectTrip(trip.id);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#101827] transition-colors cursor-pointer"
                    >
                      {isActive ? 'Current' : 'Open'}
                    </button>
                    <button
                      onClick={() => onDuplicateTrip(trip)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                      title="Duplicate Trip"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTrip(trip.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Delete Trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

