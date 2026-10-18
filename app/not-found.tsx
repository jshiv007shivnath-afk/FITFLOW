import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#111312] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-[#ECECE9] shadow-sm text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4F5F2] border border-[#E2E4DE] text-xs font-bold text-[#737771] mb-6">
          <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
          <span>Status 404 · Page Not Found</span>
        </div>

        {/* Brand Display */}
        <div className="w-16 h-16 rounded-2xl bg-[#111312] text-[#B8F45A] font-extrabold text-2xl flex items-center justify-center mx-auto mb-4 tracking-tighter shadow-sm">
          F
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-[#111312] mb-2">
          Page Not Found
        </h1>
        <p className="text-sm text-[#737771] leading-relaxed mb-6">
          The requested health screen, workout log, or destination cannot be found.
        </p>

        {/* Tactile Actions */}
        <div className="flex flex-col gap-2.5">
          <Link
            href="/"
            className="w-full py-3.5 px-4 rounded-xl bg-[#111312] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#232724] active:scale-[0.99] transition shadow-xs"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Return to FitFlow Dashboard</span>
          </Link>
        </div>

        {/* Footer info */}
        <div className="mt-8 pt-4 border-t border-[#F4F5F2] flex items-center justify-between text-xs text-[#A0A49E]">
          <span>FitFlow v2.4</span>
          <span>Wellness &amp; Activity Tracker</span>
        </div>
      </div>
    </div>
  );
}
