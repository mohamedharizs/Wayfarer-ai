'use client';

import React from 'react';
import { Compass, ShieldCheck, Heart, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#101827] text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#176B52] flex items-center justify-center text-white">
                <Compass className="w-6 h-6 text-[#DCE9DF]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-serif tracking-tight text-2xl font-bold text-white">
                  WAYFARER
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#DCE9DF] text-[#176B52]">
                  AI
                </span>
              </div>
            </div>
            <p className="text-[#94A3B8] text-sm leading-relaxed max-w-md">
              Wayfarer AI creates custom, human-paced travel itineraries that balance celebrated landmarks with authentic hidden gems. Built with intelligent schedule optimization, real-time budget forecasting, and offline flexibility.
            </p>
            <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D6AD60]" />
                <span>Transparent AI Estimates</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#176B52]" />
                <span>Worldwide Destinations</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white/90">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              <li><a href="#itinerary" className="hover:text-white transition-colors">Trip Workspace</a></li>
              <li><a href="#discover" className="hover:text-white transition-colors">Explore Destinations</a></li>
              <li><a href="#planner" className="hover:text-white transition-colors">AI Trip Wizard</a></li>
              <li><a href="#budget" className="hover:text-white transition-colors">Budget Breakdown</a></li>
            </ul>
          </div>

          {/* Editorial / Transparency */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white/90">
              Traveler Transparency
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Cost figures and timing shown across Wayfarer AI are curated estimates derived from regional averages and travel databases. Always verify seasonal opening hours and ticket availability prior to departure.
            </p>
            <div className="pt-2 text-xs text-[#64748B]">
              Standard Currency: USD ($) · Lat/Lng Geo-coordinated
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-4">
          <p>© {new Date().getFullYear()} Wayfarer AI Inc. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for curious travelers worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

