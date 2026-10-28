'use client';

import React, { useState } from 'react';
import { X, Share2, Printer, Download, Check, Copy, Link as LinkIcon } from 'lucide-react';
import { Trip } from '@/types/trip';

interface ShareExportModalProps {
  isOpen: boolean;
  trip: Trip;
  onClose: () => void;
}

export default function ShareExportModal({ isOpen, trip, onClose }: ShareExportModalProps) {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}?tripId=${trip.id}`
    : `https://wayfarer.ai/trips/${trip.id}`;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(trip, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${trip.destination.toLowerCase().replace(/[^a-z0-9]/g, '-')}-itinerary.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E5E7EB] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#176B52] flex items-center justify-center text-white">
              <Share2 className="w-5 h-5 text-[#DCE9DF]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#101827]">
                Share & Export Itinerary
              </h3>
              <p className="text-xs text-[#64748B]">
                {trip.title}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Share Link Box */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569]">
            Shareable Web Link
          </label>
          <div className="flex items-center gap-2 p-1.5 rounded-xl border border-[#E5E7EB] bg-[#F8F7F3]">
            <LinkIcon className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-transparent text-xs text-[#101827] focus:outline-hidden font-mono truncate"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-[#101827] text-white text-xs font-semibold hover:bg-[#1f2937] transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569]">
            Export Itinerary Formats
          </label>

          <div className="grid grid-cols-2 gap-3">
            {/* Print / Save to PDF */}
            <button
              onClick={handlePrint}
              className="p-4 rounded-2xl border border-[#E5E7EB] hover:border-[#176B52] bg-[#F8F7F3] hover:bg-[#DCE9DF]/30 text-left transition-all group cursor-pointer"
            >
              <Printer className="w-5 h-5 text-[#176B52] mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold text-[#101827] block">
                Print / Save PDF
              </span>
              <span className="text-[11px] text-[#64748B] block mt-0.5">
                Clean editorial print stylesheet
              </span>
            </button>

            {/* Download JSON Data */}
            <button
              onClick={handleDownloadJSON}
              className="p-4 rounded-2xl border border-[#E5E7EB] hover:border-[#176B52] bg-[#F8F7F3] hover:bg-[#DCE9DF]/30 text-left transition-all group cursor-pointer"
            >
              <Download className="w-5 h-5 text-[#176B52] mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold text-[#101827] block">
                Download JSON
              </span>
              <span className="text-[11px] text-[#64748B] block mt-0.5">
                Structured trip dataset
              </span>
            </button>
          </div>
        </div>

        <div className="pt-2 text-[11px] text-[#64748B] text-center border-t border-[#E5E7EB]">
          Recipients can view this trip read-only without requiring an account.
        </div>
      </div>
    </div>
  );
}
