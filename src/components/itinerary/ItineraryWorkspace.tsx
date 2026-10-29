'use client';

import React, { useState } from 'react';
import {
  MapPin, Calendar, DollarSign, Plus, Share2,
  RefreshCw, CloudRain,
  Layers, Map as MapIcon, CheckCircle2
} from 'lucide-react';
import { Trip, Activity, ActualExpense } from '@/types/trip';
import ActivityCard from './ActivityCard';
import { EditActivityModal, AddActivityModal } from './ActivityModals';
import TripMap from '../map/TripMap';
import BudgetPlanner from '../budget/BudgetPlanner';
import { generateSingleDay, getDestinationGeo } from '@/lib/ai-generator';
import { formatCurrency } from '@/lib/currency';
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
  const [periodFilter, setPeriodFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');

  // Active day lookup
  const activeDay = trip.days.find(d => d.dayNumber === selectedDayNumber) || trip.days[0];

  // Activities filtered by period
  const filteredActivities = (activeDay?.activities || []).filter(a => {
    if (periodFilter === 'all') return true;
    return a.period === periodFilter;
  });

  const completedActivitiesCount = (activeDay?.activities || []).filter(a => a.isCompleted).length;
  const totalDayActivitiesCount = activeDay?.activities?.length || 0;

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
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-white border border-white/20">
                {trip.preferences?.budgetStyle || 'Curated'} Travel Style
              </span>
              <span className="px-3 py-1 rounded-full bg-[#176B52] text-xs font-bold text-white shadow-xs">
                {trip.durationDays} Days Itinerary
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenShareModal}
                className="px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-xs font-semibold transition-colors flex items-center gap-1.5 text-white cursor-pointer border border-white/20"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share & Export</span>
              </button>
              <button
                type="button"
                onClick={onOpenPlanner}
                className="px-3.5 py-1.5 rounded-full bg-[#D6AD60] hover:bg-[#c49b4c] text-xs font-bold text-[#101827] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>New Trip</span>
              </button>
            </div>
          </div>

          {/* Bottom Content on Banner */}
          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              {trip.title}
            </h2>
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
                <span>Est. Budget: {formatCurrency(trip.budget?.totalPlanned, trip.budget?.currency || 'INR')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Switcher Tabs (Timeline / Map / Budget) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-3 no-print">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveView('timeline')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeView === 'timeline'
                ? 'bg-[#101827] text-white shadow-xs'
                : 'bg-white border border-[#E5E7EB] text-[#475569] hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Day-by-Day Timeline</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('map')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeView === 'map'
                ? 'bg-[#101827] text-white shadow-xs'
                : 'bg-white border border-[#E5E7EB] text-[#475569] hover:bg-slate-50'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Interactive Map</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('budget')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeView === 'budget'
                ? 'bg-[#101827] text-white shadow-xs'
                : 'bg-white border border-[#E5E7EB] text-[#475569] hover:bg-slate-50'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Smart Budget Planner</span>
          </button>
        </div>

        {/* Days count label */}
        <span className="text-xs text-[#64748B]">
          {trip.days.length} Total Days Planned · {completedActivitiesCount} of {totalDayActivitiesCount} done today
        </span>
      </div>

      {/* VIEW 1: TIMELINE */}
      {activeView === 'timeline' && (
        <div className="space-y-6">
          {/* Day Selector Horizontal Strip */}
          <div className="overflow-x-auto pb-2 flex items-center gap-3 no-print scrollbar-thin">
            {trip.days.map((day) => {
              const isSelected = day.dayNumber === selectedDayNumber;
              return (
                <button
                  type="button"
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
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#176B52] bg-[#DCE9DF] px-2.5 py-0.5 rounded-full">
                    Day {activeDay?.dayNumber || 1} Schedule
                  </span>
                  {activeDay?.date && (
                    <span className="text-xs text-[#64748B] font-medium">
                      {activeDay.date}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#101827] mt-1.5">
                  {activeDay?.title || 'Daily Itinerary'}
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Theme: {activeDay?.theme} · Estimated Day Cost: {formatCurrency(activeDay?.dailyEstimatedCost, trip.budget?.currency || 'INR')}
                </p>
              </div>

              {/* Day Action Buttons */}
              <div className="flex items-center gap-2 no-print">
                <button
                  type="button"
                  onClick={handleRegenerateCurrentDay}
                  disabled={isRegeneratingDay}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#101827] transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  title="Regenerate only this day's activities"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#176B52] ${isRegeneratingDay ? 'animate-spin' : ''}`} />
                  <span>{isRegeneratingDay ? 'Regenerating...' : 'Regenerate Day'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddActivityOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#176B52] hover:bg-[#125440] text-xs font-semibold text-white transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Activity</span>
                </button>
              </div>
            </div>

            {/* Weather Tip for the Day */}
            {activeDay?.weatherRecommendation && (
              <div className="p-3 bg-[#F8F7F3] rounded-xl border border-slate-200 text-xs text-[#475569] flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-[#176B52] shrink-0" />
                <span><strong>Weather Note:</strong> {activeDay.weatherRecommendation}</span>
              </div>
            )}

            {/* Period Filters (All / Morning / Afternoon / Evening) */}
            <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 no-print">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mr-2">
                Filter:
              </span>
              {(['all', 'morning', 'afternoon', 'evening'] as const).map(p => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPeriodFilter(p)}
                  className={`text-xs px-3 py-1 rounded-full font-medium capitalize transition-colors cursor-pointer ${
                    periodFilter === p
                      ? 'bg-[#101827] text-white'
                      : 'bg-slate-100 text-[#475569] hover:bg-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Rail & Activity Cards */}
          {filteredActivities.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-[#E5E7EB] space-y-3">
              <p className="text-sm text-[#64748B]">
                No activities found for this time period.
              </p>
              <button
                type="button"
                onClick={() => setPeriodFilter('all')}
                className="px-4 py-2 rounded-xl bg-[#176B52] text-white text-xs font-semibold"
              >
                Show All Activities
              </button>
            </div>
          ) : (
            <div className="relative sm:border-l-2 sm:border-[#DCE9DF] sm:ml-7 sm:pl-7 space-y-6">
              {filteredActivities.map((act, idx) => (
                <ActivityCard
                  key={act.id}
                  activity={act}
                  currency={trip.budget?.currency || 'INR'}
                  isFirst={idx === 0}
                  isLast={idx === filteredActivities.length - 1}
                  onToggleComplete={() => handleToggleComplete(act.id)}
                  onEdit={() => setEditingActivity(act)}
                  onDelete={() => handleDeleteActivity(act.id)}
                  onMoveUp={() => handleMoveActivity(idx, 'up')}
                  onMoveDown={() => handleMoveActivity(idx, 'down')}
                />
              ))}
            </div>
          )}

          {/* Practical Tips & Alternatives for This Trip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Practical Tips */}
            <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-2xs space-y-3">
              <h4 className="font-serif text-lg font-bold text-[#101827] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#176B52]" />
                <span>Field-Tested Local Tips</span>
              </h4>
              <ul className="space-y-2 text-xs text-[#475569] leading-relaxed">
                {trip.practicalTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#176B52] font-bold shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Inclement Weather Alternatives */}
            <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-2xs space-y-3">
              <h4 className="font-serif text-lg font-bold text-[#101827] flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-[#D6AD60]" />
                <span>Rain & Weather Fallbacks</span>
              </h4>
              <ul className="space-y-2 text-xs text-[#475569] leading-relaxed">
                {trip.weatherAlternatives.map((alt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#D6AD60] font-bold shrink-0">•</span>
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
        <TripMap
          activities={activeDay?.activities || []}
          destinationName={trip.destination}
          selectedActivityId={selectedMapActivityId}
          onSelectActivity={(id) => setSelectedMapActivityId(id)}
        />
      )}

      {/* VIEW 3: BUDGET */}
      {activeView === 'budget' && (
        <BudgetPlanner
          budget={trip.budget}
          actualExpenses={trip.actualExpenses || []}
          durationDays={trip.durationDays}
          onAddExpense={handleAddExpense}
          onUpdateBudget={(newBudget) => {
            const updated = { ...trip, budget: newBudget };
            saveTrip(updated);
            onTripUpdated(updated);
          }}
        />
      )}

      {/* Edit Activity Modal */}
      {editingActivity && (
        <EditActivityModal
          activity={editingActivity}
          isOpen={true}
          onClose={() => setEditingActivity(null)}
          onSave={(updated) => {
            handleSaveActivity(updated);
            setEditingActivity(null);
          }}
        />
      )}

      {/* Add Custom Activity Modal */}
      {isAddActivityOpen && (
        <AddActivityModal
          isOpen={true}
          dayNumber={selectedDayNumber}
          onClose={() => setIsAddActivityOpen(false)}
          onAdd={(newAct) => {
            handleAddActivity(newAct);
            setIsAddActivityOpen(false);
          }}
        />
      )}
    </div>
  );
}
