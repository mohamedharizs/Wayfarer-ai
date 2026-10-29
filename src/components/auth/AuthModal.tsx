'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, Sparkles, CheckCircle2, AlertCircle, Database } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
  userEmail?: string | null;
  onSignOut: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  userEmail,
  onSignOut
}: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setMessage(null);

    // Explicit transparent local session handling
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(email.trim());
      onClose();
    }, 400);
  };

  const handleDemoLogin = () => {
    onLoginSuccess('traveler@wayfarer.ai');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E5E7EB] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#176B52] flex items-center justify-center text-white">
              <Lock className="w-4 h-4 text-[#DCE9DF]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#101827]">
                {userEmail ? 'Traveler Session' : isSignUp ? 'Create Traveler Account' : 'Sign In to Wayfarer AI'}
              </h3>
              <p className="text-xs text-[#64748B]">
                {userEmail ? 'Active local guest session' : 'Sync your personalized itineraries'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cloud Authentication Architecture Notice */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#475569] space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-[#101827]">
            <Database className="w-3.5 h-3.5 text-[#176B52]" />
            <span>Environment Status: Local Storage Mode</span>
          </div>
          <p className="text-[11px] leading-relaxed text-[#64748B]">
            Cloud Supabase credentials are not connected in this environment. Your journeys are saved securely in browser storage.
          </p>
        </div>

        {userEmail ? (
          /* Logged In State */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-900">Signed in as:</p>
                <p className="text-xs text-emerald-700 font-mono mt-0.5">{userEmail}</p>
              </div>
            </div>

            <p className="text-xs text-[#64748B] leading-relaxed">
              Your trips and custom preferences are stored locally in your browser cache.
            </p>

            <button
              type="button"
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors cursor-pointer"
            >
              Sign Out Session
            </button>
          </div>
        ) : (
          /* Sign In / Sign Up Form */
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {message && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <div>
              <label className="block uppercase font-semibold text-[#64748B] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="traveler@example.com"
                  className="w-full pl-9 pr-3 py-2 border rounded-xl text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block uppercase font-semibold text-[#64748B] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 border rounded-xl text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-[#101827] text-white font-semibold text-xs hover:bg-[#1f2937] transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Setting up session...' : isSignUp ? 'Create Traveler Session' : 'Sign In'}
            </button>

            {/* Quick Demo Mode Button */}
            <div className="pt-2">
              <div className="relative flex py-2 items-center">
                <div className="grow border-t border-slate-200"></div>
                <span className="shrink mx-3 text-slate-400 text-[10px] uppercase font-bold tracking-wider">or</span>
                <div className="grow border-t border-slate-200"></div>
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2.5 rounded-xl bg-[#DCE9DF] hover:bg-[#c9ddcd] text-[#176B52] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#176B52]" />
                <span>Continue as Guest Traveler</span>
              </button>
            </div>

            {/* Switch Sign in / Sign up */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-[#176B52] hover:underline font-semibold cursor-pointer"
              >
                {isSignUp ? 'Already have a session? Sign in' : "New traveler? Set up profile"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
