'use client';

import { Trip, Activity, ActualExpense } from '../types/trip';
import { SAMPLE_TRIPS } from '../data/sampleTrips';

const TRIPS_STORAGE_KEY = 'wayfarer_saved_trips';
const ACTIVE_TRIP_KEY = 'wayfarer_active_trip_id';

export function getSavedTrips(): Trip[] {
  if (typeof window === 'undefined') return SAMPLE_TRIPS;
  try {
    const raw = localStorage.getItem(TRIPS_STORAGE_KEY);
    if (!raw) {
      // Initialize with sample trips
      localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(SAMPLE_TRIPS));
      return SAMPLE_TRIPS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SAMPLE_TRIPS;
  } catch (e) {
    console.error('Failed to parse saved trips from localStorage:', e);
    return SAMPLE_TRIPS;
  }
}

export function saveTrip(trip: Trip): void {
  if (typeof window === 'undefined') return;
  try {
    const trips = getSavedTrips();
    const index = trips.findIndex(t => t.id === trip.id);
    const updatedTrip = { ...trip, updatedAt: new Date().toISOString() };
    let newTrips: Trip[];
    if (index >= 0) {
      newTrips = [...trips];
      newTrips[index] = updatedTrip;
    } else {
      newTrips = [updatedTrip, ...trips];
    }
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(newTrips));
    localStorage.setItem(ACTIVE_TRIP_KEY, updatedTrip.id);
  } catch (e) {
    console.error('Failed to save trip to localStorage:', e);
  }
}

export function deleteTrip(tripId: string): Trip[] {
  if (typeof window === 'undefined') return [];
  try {
    const trips = getSavedTrips();
    const filtered = trips.filter(t => t.id !== tripId);
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(filtered));
    if (getActiveTripId() === tripId && filtered.length > 0) {
      localStorage.setItem(ACTIVE_TRIP_KEY, filtered[0].id);
    }
    return filtered;
  } catch (e) {
    console.error('Failed to delete trip:', e);
    return [];
  }
}

export function getActiveTripId(): string {
  if (typeof window === 'undefined') return SAMPLE_TRIPS[0].id;
  const activeId = localStorage.getItem(ACTIVE_TRIP_KEY);
  if (activeId) return activeId;
  const trips = getSavedTrips();
  return trips[0]?.id || SAMPLE_TRIPS[0].id;
}

export function setActiveTripId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_TRIP_KEY, id);
}

export function toggleActivityCompleted(tripId: string, dayNumber: number, activityId: string): Trip | null {
  const trips = getSavedTrips();
  const trip = trips.find(t => t.id === tripId);
  if (!trip) return null;

  const day = trip.days.find(d => d.dayNumber === dayNumber);
  if (!day) return null;

  const act = day.activities.find(a => a.id === activityId);
  if (!act) return null;

  act.isCompleted = !act.isCompleted;
  saveTrip(trip);
  return trip;
}

export function updateActivity(tripId: string, dayNumber: number, updatedActivity: Activity): Trip | null {
  const trips = getSavedTrips();
  const trip = trips.find(t => t.id === tripId);
  if (!trip) return null;

  const day = trip.days.find(d => d.dayNumber === dayNumber);
  if (!day) return null;

  const idx = day.activities.findIndex(a => a.id === updatedActivity.id);
  if (idx === -1) return null;

  day.activities[idx] = updatedActivity;
  saveTrip(trip);
  return trip;
}

export function deleteActivity(tripId: string, dayNumber: number, activityId: string): Trip | null {
  const trips = getSavedTrips();
  const trip = trips.find(t => t.id === tripId);
  if (!trip) return null;

  const day = trip.days.find(d => d.dayNumber === dayNumber);
  if (!day) return null;

  day.activities = day.activities.filter(a => a.id !== activityId);
  saveTrip(trip);
  return trip;
}

export function addCustomActivity(tripId: string, dayNumber: number, activity: Activity): Trip | null {
  const trips = getSavedTrips();
  const trip = trips.find(t => t.id === tripId);
  if (!trip) return null;

  const day = trip.days.find(d => d.dayNumber === dayNumber);
  if (!day) return null;

  day.activities.push(activity);
  saveTrip(trip);
  return trip;
}

export function addActualExpense(tripId: string, expense: ActualExpense): Trip | null {
  const trips = getSavedTrips();
  const trip = trips.find(t => t.id === tripId);
  if (!trip) return null;

  if (!trip.actualExpenses) trip.actualExpenses = [];
  trip.actualExpenses.push(expense);
  saveTrip(trip);
  return trip;
}

