'use client';

import React, { useState } from 'react';
import {
  MapPin, Calendar, DollarSign, Plus, Share2,
  RefreshCw, Compass, CloudRain,
  Layers, Map as MapIcon
} from 'lucide-react';
import { Trip, Activity, ActualExpense } from '@/types/trip';
import ActivityCard from './ActivityCard';
import { EditActivityModal, AddActivityModal } from './ActivityModals';
import TripMap from '../map/TripMap';
import BudgetPlanner from '../budget/BudgetPlanner';
import { generateSingleDay, getDestinationGeo } from '@/lib/ai-generator';
import {
  saveTrip,
  toggleActivityCompleted,
  updateActivity,
  deleteActivity,
  addCustomActivity,
  addActualExpense
} from '@/lib/storage';

interface ItineraryWorkspaceProps {
  trip: Trip;
  onTripUpdated: (updated: Trip) => void;
  onOpenShareModal: () => void;
  onOpenPlanner: () => void;
}

export default function ItineraryWorkspace({
  trip,
  onTripUpdated,
  onOpenShareModal,
  onOpenPlanner
}: ItineraryWorkspaceProps) {
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [activeView, setActiveView] = useState<'timeline' | 'map' | 'budget'>('timeline');
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [selectedMapActivityId, setSelectedMapActivityId] = useState<string | null>(null);
  const [isRegeneratingDay, setIsRegeneratingDay] = useState(false);

  // Active day lookup
  const activeDay = trip.days.find(d => d.dayNumber === selectedDayNumber) || trip.days[0];

  // Handler: Toggle complete activity
  const handleToggleComplete = (activityId: string) => {
    const updated = toggleActivityCompleted(trip.id, selectedDayNumber, activityId);
    if (updated) onTripUpdated(updated);
  };

  // Handler: Delete activity
  const handleDeleteActivity = (activityId: string) => {
    if (window.confirm('Are you sure you want to remove this activity from your schedule?')) {
      const updated = deleteActivity(trip.id, selectedDayNumber, activityId);
      if (updated) onTripUpdated(updated);
    }
  };

  // Handler: Move activity Up/Down (immutable)
  const handleMoveActivity = (idx: number, direction: 'up' | 'down') => {
    if (!activeDay) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= activeDay.activities.length) return;

    const newActivities = [...activeDay.activities];
    const temp = newActivities[idx];
    newActivities[idx] = newActivities[targetIdx];
    newActivities[targetIdx] = temp;

    const updatedDays = trip.days.map(d =>
      d.dayNumber === selectedDayNumber ? { ...d, activities: newActivities } : d
    );
    const updatedTrip = { ...trip, days: updatedDays };
    saveTrip(updatedTrip);
    onTripUpdated(updatedTrip);
  };

  // Handler: Save edited activity
  const handleSaveActivity = (updatedAct: Activity) => {
    const updated = updateActivity(trip.id, selectedDayNumber, updatedAct);
    if (updated) onTripUpdated(updated);
  };

  // Handler: Add custom activity
  const handleAddActivity = (newAct: Activity) => {
    const updated = addCustomActivity(trip.id, selectedDayNumber, newAct);
    if (updated) onTripUpdated(updated);
  };

  // Handler: Regenerate current day (immutable)
  const handleRegenerateCurrentDay = () => {
    setIsRegeneratingDay(true);
    setTimeout(() => {
      const geo = getDestinationGeo(trip.destination);
      const newDay = generateSingleDay(
        selectedDayNumber,
        trip.preferences,
        activeDay.theme || 'Discovery',
        geo
      );

      const updatedDays = trip.days.map(d =>
        d.dayNumber === selectedDayNumber ? newDay : d
      );
      const updatedTrip = { ...trip, days: updatedDays };
      saveTrip(updatedTrip);
      onTripUpdated(updatedTrip);
      setIsRegeneratingDay(false);
    }, 600);
  };

  // Handler: Add actual expense
  const handleAddExpense = (expense: ActualExpense) => {
    const updated = addActualExpense(trip.id, expense);
    if (updated) onTripUpdated(updated);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto itinerary-print-container">
      {/* Editorial Trip Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#101827] text-white shadow-xl border border-slate-800">
        {/* Cover Photo */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={trip.coverImage}
            alt={trip.destination}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101827] via-[#101827]/40 to-transparent" />

          {/* Top Bar on Banner */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between no-print">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-white">
                {trip.preferences?.budgetStyle || 'Curated'} Travel Style
              </span>
              <span className="px-3 py-1 rounded-full bg-[#176B52] text-xs font-bold text-white">
                {trip.durationDays} Days Itinerary
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenShareModal}
                className="px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-xs font-semibold transition-colors flex items-center gap-1.5 text-white cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share & Export</span>
              </button>
              <button
                onClick={onOpenPlanner}
                className="px-3.5 py-1.5 rounded-full bg-[#D6AD60] hover:bg-[#c49b4c] text-xs font-bold text-[#101827] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>New Trip</span>
              </button>
            </div>
          </div>

          {/* Bottom Content on Banner */}
          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              {trip.title}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl line-clamp-2">
              {trip.summary}
            </p>

            {/* Meta Row */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D6AD60]" />
                <span>{trip.destination}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#176B52]" />
                <span>{trip.startDate} to {trip.endDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Est. Budget: ${trip.budget?.totalPlanned?.toLocaleString() || 0} USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Switcher Tabs (Timeline / Map / Budget) */}
      <div className="flex items-center justify-between gap-4 border-b border-[#E5E7EB] pb-3 no-print">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('timeline')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeView === 'timeline'
                ? 'bg-[#101827] text-white shadow-2xs'
                : 'bg-white border border-[#E5E7EB] text-[#475569] hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Day-by-Day Timeline</span>
          </button>
          <button
            onClick={() => setActiveView('map')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeView === 'map'
                ? 'bg-[#101827] text-white shadow-2xs'
                : 'bg-white border border-[#E5E7EB] text-[#475569] hover:bg-slate-50'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Interactive Map</span>
          </button>
          <button
            onClick={() => setActiveView('budget')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeView === 'budget'
                ? 'bg-[#101827] text-white shadow-2xs'
                : 'bg-white border border-[#E5E7EB] text-[#475569] hover:bg-slate-50'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Smart Budget Planner</span>
          </button>
        </div>

        {/* Days count label */}
        <span className="text-xs text-[#64748B] hidden sm:inline">
          {trip.days.length} Total Days Planned
        </span>
      </div>

      {/* VIEW 1: TIMELINE */}
      {activeView === 'timeline' && (
        <div className="space-y-6">
          {/* Day Selector Horizontal Strip */}
          <div className="overflow-x-auto pb-2 flex items-center gap-3 no-print">
            {trip.days.map((day) => {
              const isSelected = day.dayNumber === selectedDayNumber;
              return (
                <button
                  key={day.dayNumber}
                  onClick={() => setSelectedDayNumber(day.dayNumber)}
                  className={`px-4 py-3 rounded-2xl border text-left shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#176B52] shadow-md ring-2 ring-[#176B52]/20'
                      : 'bg-white/80 border-[#E5E7EB] hover:bg-white text-[#475569]'
                  }`}
                >
                  <span className={`text-[11px] uppercase font-bold block ${isSelected ? 'text-[#176B52]' : 'text-slate-500'}`}>
                    Day {day.dayNumber}
                  </span>
                  <span className="text-xs font-bold text-[#101827] block truncate max-w-[130px]">
                    {day.theme || `Highlights`}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {day.activities?.length || 0} activities
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Day Header & Actions */}
          <div className="p-6 bg-white rounded-3xl border border-[#E5E7EB] shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#176B52] bg-[#DCE9DF] px-2.5 py-0.5 rounded-full">
                  Day {activeDay?.dayNumber || 1} Schedule
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#101827] mt-1.5">
                  {activeDay?.title || 'Daily Itinerary'}
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Theme: {activeDay?.theme} · Estimated Day Cost: ${activeDay?.dailyEstimatedCost || 0}
                </p>
              </div>

              {/* Day Action Buttons */}
              <div className="flex items-center gap-2 no-print">
                <button
                  onClick={handleRegenerateCurrentDay}
                  disabled={isRegeneratingDay}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#101827] transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  title="Regenerate only this day's activities"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#176B52] ${isRegeneratingDay ? 'animate-spin' : ''}`} />
                  <span>{isRegeneratingDay ? 'Regenerating...' : 'Regenerate Day'}</span>
                </button>

                <button
                  onClick={() => setIsAddActivityOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#176B52] hover:bg-[#125440] text-xs font-semibold text-white transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Activity</span>
                </button>
              </div>
            </div>

            {/* Weather & Practical Day Notice */}
            {activeDay?.weatherRecommendation && (
              <div className="p-3 rounded-2xl bg-[#F8F7F3] border border-[#E5E7EB] text-xs text-[#475569] flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-[#176B52] shrink-0" />
                <span>
                  <strong>Local Conditions Note:</strong> {activeDay.weatherRecommendation}
                </span>
              </div>
            )}
          </div>

          {/* Activities Timeline List */}
          <div className="space-y-4">
            {(!activeDay?.activities || activeDay.activities.length === 0) ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#E5E7EB] space-y-3">
                <p className="text-sm text-[#64748B]">No activities scheduled for this day.</p>
                <button
                  onClick={() => setIsAddActivityOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#176B52] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Activity</span>
                </button>
              </div>
            ) : (
              activeDay.activities.map((activity, idx) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  isFirst={idx === 0}
                  isLast={idx === activeDay.activities.length - 1}
                  onToggleComplete={() => handleToggleComplete(activity.id)}
                  onEdit={() => setEditingActivity(activity)}
                  onDelete={() => handleDeleteActivity(activity.id)}
                  onMoveUp={() => handleMoveActivity(idx, 'up')}
                  onMoveDown={() => handleMoveActivity(idx, 'down')}
                />
              ))
            )}
          </div>

          {/* Practical Tips & Rain Alternatives Footer Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Practical Tips */}
            <div className="p-6 bg-white rounded-3xl border border-[#E5E7EB] space-y-3">
              <h4 className="font-serif text-base font-bold text-[#101827] flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#176B52]" />
                <span>Practical Travel Insights</span>
              </h4>
              <ul className="space-y-2 text-xs text-[#475569]">
                {trip.practicalTips?.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#176B52] font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bad Weather Alternatives */}
            <div className="p-6 bg-white rounded-3xl border border-[#E5E7EB] space-y-3">
              <h4 className="font-serif text-base font-bold text-[#101827] flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-[#D6AD60]" />
                <span>Inclement Weather Alternatives</span>
              </h4>
              <ul className="space-y-2 text-xs text-[#475569]">
                {trip.weatherAlternatives?.map((alt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#D6AD60] font-bold">•</span>
                    <span>{alt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: MAP */}
      {activeView === 'map' && (
        <div className="space-y-6">
          <TripMap
            activities={activeDay?.activities || []}
            destinationName={trip.destination}
            selectedActivityId={selectedMapActivityId}
            onSelectActivity={(id) => setSelectedMapActivityId(id)}
          />
        </div>
      )}

      {/* VIEW 3: BUDGET */}
      {activeView === 'budget' && (
        <BudgetPlanner
          budget={trip.budget}
          actualExpenses={trip.actualExpenses || []}
          durationDays={trip.durationDays}
          onAddExpense={handleAddExpense}
          onUpdateBudget={(newBudget) => {
            const updatedTrip = { ...trip, budget: newBudget };
            saveTrip(updatedTrip);
            onTripUpdated(updatedTrip);
          }}
        />
      )}

      {/* Edit Activity Modal */}
      <EditActivityModal
        activity={editingActivity}
        isOpen={!!editingActivity}
        onClose={() => setEditingActivity(null)}
        onSave={handleSaveActivity}
      />

      {/* Add Custom Activity Modal */}
      <AddActivityModal
        isOpen={isAddActivityOpen}
        dayNumber={selectedDayNumber}
        onClose={() => setIsAddActivityOpen(false)}
        onAdd={handleAddActivity}
      />
    </div>
  );
}
