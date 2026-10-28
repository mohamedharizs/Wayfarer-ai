'use client';

import React, { useState } from 'react';
import { Compass, Sparkles, Bookmark, Menu, X, User } from 'lucide-react';

interface NavbarProps {
  savedTripsCount: number;
  onOpenPlanner: () => void;
  onOpenSavedTrips: () => void;
  onOpenAuth: () => void;
  userEmail?: string | null;
  activeTab: 'itinerary' | 'discover' | 'budget';
  setActiveTab: (tab: 'itinerary' | 'discover' | 'budget') => void;
}

export default function Navbar({
  savedTripsCount,
  onOpenPlanner,
  onOpenSavedTrips,
  onOpenAuth,
  userEmail,
  activeTab,
  setActiveTab
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#F8F7F3]/90 backdrop-blur-md border-b border-[#E5E7EB] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('itinerary')}>
            <div className="w-10 h-10 rounded-xl bg-[#176B52] flex items-center justify-center text-white shadow-sm">
              <Compass className="w-6 h-6 text-[#DCE9DF]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif tracking-tight text-xl font-bold text-[#101827]">
                  WAYFARER
                </span>
                <span className="text-[11px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#DCE9DF] text-[#176B52]">
                  AI
                </span>
              </div>
              <span className="text-[11px] text-[#64748B] tracking-wide font-medium hidden sm:inline">
                Intelligent Travel Companion
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/70 px-3 py-1.5 rounded-full border border-[#E5E7EB] shadow-2xs">
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'itinerary'
                  ? 'bg-[#176B52] text-white shadow-2xs'
                  : 'text-[#475569] hover:text-[#101827] hover:bg-black/5'
              }`}
            >
              Itinerary
            </button>
            <button
              onClick={() => setActiveTab('discover')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'discover'
                  ? 'bg-[#176B52] text-white shadow-2xs'
                  : 'text-[#475569] hover:text-[#101827] hover:bg-black/5'
              }`}
            >
              Discover Destinations
            </button>
            <button
              onClick={() => setActiveTab('budget')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'budget'
                  ? 'bg-[#176B52] text-white shadow-2xs'
                  : 'text-[#475569] hover:text-[#101827] hover:bg-black/5'
              }`}
            >
              Budget Planner
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenSavedTrips}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#E5E7EB] bg-white text-[#101827] text-sm font-medium hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Bookmark className="w-4 h-4 text-[#176B52]" />
              <span>Saved Trips</span>
              {savedTripsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#DCE9DF] text-[#176B52] text-xs font-bold flex items-center justify-center">
                  {savedTripsCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-transparent text-[#475569] text-sm font-medium hover:text-[#101827] hover:bg-black/5 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>{userEmail ? userEmail.split('@')[0] : 'Sign In'}</span>
            </button>

            <button
              onClick={onOpenPlanner}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#101827] text-white text-sm font-medium hover:bg-[#1f2937] active:scale-95 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#D6AD60]" />
              <span>Plan My Trip</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenPlanner}
              className="px-3.5 py-2 rounded-full bg-[#101827] text-white text-xs font-medium flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D6AD60]" />
              <span>Plan</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#101827] hover:bg-black/5"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E5E7EB] bg-[#F8F7F3] px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => { setActiveTab('itinerary'); setMobileMenuOpen(false); }}
              className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
                activeTab === 'itinerary' ? 'bg-[#176B52] text-white' : 'text-[#101827] hover:bg-black/5'
              }`}
            >
              Current Itinerary
            </button>
            <button
              onClick={() => { setActiveTab('discover'); setMobileMenuOpen(false); }}
              className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
                activeTab === 'discover' ? 'bg-[#176B52] text-white' : 'text-[#101827] hover:bg-black/5'
              }`}
            >
              Discover Destinations
            </button>
            <button
              onClick={() => { setActiveTab('budget'); setMobileMenuOpen(false); }}
              className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
                activeTab === 'budget' ? 'bg-[#176B52] text-white' : 'text-[#101827] hover:bg-black/5'
              }`}
            >
              Budget & Expense Planner
            </button>
          </div>

          <div className="pt-3 border-t border-[#E5E7EB] flex flex-col gap-2">
            <button
              onClick={() => { onOpenSavedTrips(); setMobileMenuOpen(false); }}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-sm font-medium text-[#101827]"
            >
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#176B52]" />
                <span>Saved Trips</span>
              </div>
              {savedTripsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#DCE9DF] text-[#176B52] text-xs font-bold flex items-center justify-center">
                  {savedTripsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-sm font-medium text-[#101827]"
            >
              <User className="w-4 h-4" />
              <span>{userEmail ? userEmail : 'Sign In / Account'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
