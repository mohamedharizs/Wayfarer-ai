'use client';

import React from 'react';
import {
  Clock, MapPin, CheckCircle2, Circle, Edit3,
  Trash2, ChevronUp, ChevronDown, Lightbulb, AlertCircle
} from 'lucide-react';
import { Activity, ActivityCategory } from '@/types/trip';

interface ActivityCardProps {
  activity: Activity;
  isFirst: boolean;
  isLast: boolean;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const CATEGORY_COLORS: Record<ActivityCategory, { bg: string; text: string; border: string }> = {
  Culture: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  Food: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  Nature: { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' },
  Adventure: { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' },
  Relaxation: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' },
  Architecture: { bg: 'bg-stone-50', text: 'text-stone-800', border: 'border-stone-200' },
  Shopping: { bg: 'bg-pink-50', text: 'text-pink-800', border: 'border-pink-200' },
  Nightlife: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  Sightseeing: { bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200' }
};

export default function ActivityCard({
  activity,
  isFirst,
  isLast,
  onToggleComplete,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown
}: ActivityCardProps) {
  const catStyle = CATEGORY_COLORS[activity.category] || CATEGORY_COLORS.Sightseeing;

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-200 ${
        activity.isCompleted
          ? 'bg-slate-50/70 border-slate-200 opacity-75'
          : 'bg-white border-[#E5E7EB] hover:border-slate-300 shadow-2xs'
      } p-5 sm:p-6`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Time & Period */}
        <div className="flex items-start gap-3.5 flex-1">
          {/* Completion Checkbox */}
          <button
            type="button"
            onClick={onToggleComplete}
            className="mt-0.5 text-slate-400 hover:text-[#176B52] transition-colors"
            title={activity.isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
          >
            {activity.isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-[#176B52] fill-[#DCE9DF]" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>

          <div className="space-y-1.5 flex-1">
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#101827] flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                <Clock className="w-3.5 h-3.5 text-[#176B52]" />
                {activity.time}
              </span>

              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
                {activity.category}
              </span>

              <span className="text-xs text-[#64748B]">
                Approx. {activity.duration}
              </span>

              {activity.bookingRequired && (
                <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Booking Advised
                </span>
              )}
            </div>

            {/* Title */}
            <h5
              className={`font-serif text-lg font-bold ${
                activity.isCompleted ? 'line-through text-slate-500' : 'text-[#101827]'
              }`}
            >
              {activity.name}
            </h5>

            {/* Description */}
            <p className="text-sm text-[#475569] leading-relaxed">
              {activity.description}
            </p>

            {/* Location & Insider Tip */}
            <div className="pt-2 space-y-1.5 text-xs">
              {activity.location?.name && (
                <div className="flex items-center gap-1.5 text-[#64748B]">
                  <MapPin className="w-3.5 h-3.5 text-[#176B52]" />
                  <span>{activity.location.name}</span>
                </div>
              )}

              {activity.insiderTip && (
                <div className="flex items-start gap-1.5 text-[#176B52] bg-[#DCE9DF]/40 p-2.5 rounded-xl border border-[#176B52]/10">
                  <Lightbulb className="w-3.5 h-3.5 text-[#D6AD60] shrink-0 mt-0.5" />
                  <span className="italic leading-normal">
                    Tip: {activity.insiderTip}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Cost & Action Controls */}
        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className="text-right">
            <span className="text-xs text-[#64748B] block">Estimated</span>
            <span className="text-sm font-bold text-[#101827]">
              {activity.estimatedCost > 0 ? `$${activity.estimatedCost}` : 'Free'}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={isFirst}
              onClick={onMoveUp}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20"
              title="Move Up"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={isLast}
              onClick={onMoveDown}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20"
              title="Move Down"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              title="Edit Activity"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
              title="Delete Activity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
