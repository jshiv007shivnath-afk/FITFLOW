'use client';

import React, { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('FitFlow Application Exception Caught:', error.message);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#111312] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-[#ECECE9] shadow-sm text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0DF] border border-[#FDBA74] text-xs font-bold text-[#C2410C] mb-6">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>Status 500 · Runtime State Error</span>
        </div>

        {/* Brand Display */}
        <div className="w-16 h-16 rounded-2xl bg-[#111312] text-[#B8F45A] font-extrabold text-2xl flex items-center justify-center mx-auto mb-4 tracking-tighter shadow-sm">
          F
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-[#111312] mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-[#737771] leading-relaxed mb-6">
          FitFlow encountered an unexpected state while rendering your health metrics. Your local data remains safely intact.
        </p>

        {/* Tactile Recovery Actions */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full py-3.5 px-4 rounded-xl bg-[#111312] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#232724] active:scale-[0.99] transition shadow-xs"
          >
            <span>Try Again &amp; Recover State</span>
          </button>
          <button
            type="button"
            onClick={() => {
              window.location.href = '/';
            }}
            className="w-full py-3 px-4 rounded-xl bg-[#F4F5F2] text-[#5A5E59] font-medium text-xs flex items-center justify-center gap-2 hover:bg-[#EAECE8] active:scale-[0.99] transition"
          >
            <span>Return to Dashboard Home</span>
          </button>
        </div>

        {error.digest && (
          <p className="mt-4 text-xs text-[#A0A49E]">
            Incident Ref: {error.digest}
          </p>
        )}

        <div className="mt-8 pt-4 border-t border-[#F4F5F2] flex items-center justify-between text-xs text-[#A0A49E]">
          <span>FitFlow Health Guard</span>
          <span>Zero Telemetry Leaked</span>
        </div>
      </div>
    </div>
  );
}
