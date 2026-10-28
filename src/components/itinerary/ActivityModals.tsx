'use client';

import React, { useState } from 'react';
import { X, Plus, Edit3 } from 'lucide-react';
import { Activity, ActivityCategory } from '@/types/trip';

interface EditActivityModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Activity) => void;
}

function EditActivityForm({
  activity,
  onClose,
  onSave
}: {
  activity: Activity;
  onClose: () => void;
  onSave: (updated: Activity) => void;
}) {
  const [name, setName] = useState(activity.name);
  const [time, setTime] = useState(activity.time);
  const [category, setCategory] = useState<ActivityCategory>(activity.category);
  const [duration, setDuration] = useState(activity.duration);
  const [cost, setCost] = useState(activity.estimatedCost);
  const [description, setDescription] = useState(activity.description);
  const [locationName, setLocationName] = useState(activity.location?.name || '');
  const [insiderTip, setInsiderTip] = useState(activity.insiderTip || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...activity,
      name,
      time,
      category,
      duration,
      estimatedCost: Number(cost) || 0,
      description,
      location: {
        ...activity.location,
        name: locationName
      },
      insiderTip
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-sm">
      <div>
        <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Activity Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-xl"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Time</label>
          <input
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="e.g. 10:00 AM"
            className="w-full px-3 py-2 border rounded-xl"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ActivityCategory)}
            className="w-full px-3 py-2 border rounded-xl"
          >
            <option value="Sightseeing">Sightseeing</option>
            <option value="Culture">Culture</option>
            <option value="Food">Food</option>
            <option value="Nature">Nature</option>
            <option value="Adventure">Adventure</option>
            <option value="Relaxation">Relaxation</option>
            <option value="Architecture">Architecture</option>
            <option value="Shopping">Shopping</option>
            <option value="Nightlife">Nightlife</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Duration</label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g. 2 hrs"
            className="w-full px-3 py-2 border rounded-xl"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Estimated Cost ($)</label>
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-xl"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Location Name</label>
        <input
          type="text"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          className="w-full px-3 py-2 border rounded-xl"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Description</label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-xl"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Insider Tip</label>
        <input
          type="text"
          value={insiderTip}
          onChange={(e) => setInsiderTip(e.target.value)}
          placeholder="e.g. Arrive early for tranquil views"
          className="w-full px-3 py-2 border rounded-xl"
        />
      </div>

      <div className="pt-3 flex justify-end gap-2 border-t">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 rounded-xl bg-[#176B52] text-white font-medium hover:bg-[#125440] cursor-pointer"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

export function EditActivityModal({ activity, isOpen, onClose, onSave }: EditActivityModalProps) {
  if (!isOpen || !activity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-[#E5E7EB] space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-serif text-lg font-bold text-[#101827] flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#176B52]" />
            <span>Edit Activity</span>
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <EditActivityForm
          key={activity.id}
          activity={activity}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}

interface AddActivityModalProps {
  isOpen: boolean;
  dayNumber: number;
  onClose: () => void;
  onAdd: (newAct: Activity) => void;
}

export function AddActivityModal({ isOpen, dayNumber, onClose, onAdd }: AddActivityModalProps) {
  const [name, setName] = useState('');
  const [time, setTime] = useState('02:00 PM');
  const [period, setPeriod] = useState<'morning' | 'afternoon' | 'evening'>('afternoon');
  const [category, setCategory] = useState<ActivityCategory>('Culture');
  const [duration, setDuration] = useState('1.5 hrs');
  const [cost, setCost] = useState(15);
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [insiderTip, setInsiderTip] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newActivity: Activity = {
      id: `act-custom-${Date.now()}`,
      name: name.trim() || 'Custom Activity',
      time,
      period,
      category,
      duration,
      estimatedCost: Number(cost) || 0,
      description: description.trim() || 'Custom planned travel experience.',
      location: {
        name: locationName.trim() || 'Central District'
      },
      insiderTip: insiderTip.trim() || undefined,
      isCompleted: false
    };

    onAdd(newActivity);
    setName('');
    setDescription('');
    setLocationName('');
    setInsiderTip('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-[#E5E7EB] space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-serif text-lg font-bold text-[#101827] flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#176B52]" />
            <span>Add Custom Activity to Day {dayNumber}</span>
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Activity Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Afternoon Tea Ceremony at Gion"
              className="w-full px-3 py-2 border rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Period</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as 'morning' | 'afternoon' | 'evening')}
                className="w-full px-3 py-2 border rounded-xl"
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                className="w-full px-3 py-2 border rounded-xl"
              >
                <option value="Sightseeing">Sightseeing</option>
                <option value="Culture">Culture</option>
                <option value="Food">Food</option>
                <option value="Nature">Nature</option>
                <option value="Adventure">Adventure</option>
                <option value="Relaxation">Relaxation</option>
                <option value="Architecture">Architecture</option>
                <option value="Shopping">Shopping</option>
                <option value="Nightlife">Nightlife</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Cost ($)</label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Location</label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g. Nanzen-ji Temple Garden"
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief overview of what to see or do..."
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Insider Tip</label>
            <input
              type="text"
              value={insiderTip}
              onChange={(e) => setInsiderTip(e.target.value)}
              placeholder="e.g. Arrive early for tranquil views"
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#176B52] text-white font-medium hover:bg-[#125440] cursor-pointer"
            >
              Add Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
