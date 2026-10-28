'use client';

import React from 'react';
import { Maximize2, ArrowLeft } from 'lucide-react';

interface PhoneSimulatorProps {
  children: React.ReactNode;
  bottomNav?: React.ReactNode;
  topToast?: React.ReactNode;
  embedded?: boolean;
  onExpand?: () => void;
  onBackToLanding?: () => void;
  className?: string;
}

export function PhoneSimulator({
  children,
  bottomNav,
  topToast,
  embedded = false,
  onExpand,
  onBackToLanding,
  className = '',
}: PhoneSimulatorProps) {
  if (embedded) {
    return (
      <div className={`relative flex flex-col items-center select-none ${className}`}>
        {/* Interactive HUD Control Pill */}
        <div className="w-full max-w-[420px] mb-3 px-3 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2 bg-[#181A18] text-[#E0E2DC] px-3 py-1.5 rounded-full border border-white/10 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#B8F45A] animate-pulse" />
            <span className="font-semibold text-white tracking-wide">LIVE DEMO</span>
            <span className="text-white/40">•</span>
            <span className="text-white/70">Interactive</span>
          </div>

          {onExpand && (
            <button
              onClick={onExpand}
              type="button"
              className="flex items-center gap-1.5 bg-[#B8F45A] text-[#111312] px-3.5 py-1.5 rounded-full font-bold shadow-md hover:bg-[#a5e347] transition-all duration-200 cursor-pointer active:scale-95"
            >
              <span>Full Screen</span>
              <Maximize2 size={13} className="stroke-[2.5]" />
            </button>
          )}
        </div>

        {/* Outer Phone Wrapper */}
        <div className="relative flex items-center justify-center">
          {/* Side Hardware Buttons */}
          <div className="absolute -left-[3px] top-[120px] w-[3px] h-[28px] bg-[#3B3E48] rounded-l-full pointer-events-none" />
          <div className="absolute -left-[3px] top-[160px] w-[3px] h-[48px] bg-[#3B3E48] rounded-l-full pointer-events-none" />
          <div className="absolute -left-[3px] top-[220px] w-[3px] h-[48px] bg-[#3B3E48] rounded-l-full pointer-events-none" />
          <div className="absolute -right-[3px] top-[170px] w-[3px] h-[68px] bg-[#3B3E48] rounded-r-full pointer-events-none" />

          {/* iPhone Precision Chassis */}
          <div className="relative w-[380px] sm:w-[410px] max-w-[92vw] h-[800px] sm:h-[840px] max-h-[86vh] rounded-[44px] p-[4px] bg-gradient-to-b from-[#323642] via-[#1B1D25] to-[#121319] shadow-[0_24px_80px_rgba(0,0,0,0.85),_0_0_0_1px_rgba(255,255,255,0.14),_inset_0_1px_2px_rgba(255,255,255,0.25)] border border-[#3A3D4A]/80 flex flex-col overflow-hidden">
            {/* Inner Bezel Rim */}
            <div className="relative w-full h-full bg-[#F8F8F6] rounded-[40px] overflow-hidden flex flex-col shadow-inner">
              {topToast}
              <main className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col bg-[#F8F8F6]">
                {children}
              </main>
              {bottomNav}
              {/* iOS Home Indicator */}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-50 select-none pointer-events-none">
                <div className="w-32 h-[4px] bg-black/25 rounded-full backdrop-blur-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full Screen Standalone Mode
  return (
    <div className="min-h-screen w-full bg-[#07080B] flex flex-col items-center justify-center p-2 sm:p-4 selection:bg-[#B8F45A] selection:text-[#111111] relative">
      {/* Floating Back to Landing Page Button if available */}
      {onBackToLanding && (
        <button
          onClick={onBackToLanding}
          type="button"
          className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-[#181A18]/90 text-white/90 hover:text-white px-4 py-2 rounded-full border border-white/15 backdrop-blur-md shadow-lg text-xs font-semibold hover:border-white/30 transition-all cursor-pointer active:scale-95"
        >
          <ArrowLeft size={14} />
          <span>Back to Landing Page</span>
        </button>
      )}

      {/* Outer Phone Wrapper */}
      <div className="relative flex items-center justify-center my-auto">
        <div className="absolute -left-[3.5px] top-[148px] w-[3.5px] h-[34px] bg-[#3B3E48] rounded-l-full shadow-sm pointer-events-none" />
        <div className="absolute -left-[3.5px] top-[198px] w-[3.5px] h-[58px] bg-[#3B3E48] rounded-l-full shadow-sm pointer-events-none" />
        <div className="absolute -left-[3.5px] top-[268px] w-[3.5px] h-[58px] bg-[#3B3E48] rounded-l-full shadow-sm pointer-events-none" />
        <div className="absolute -right-[3.5px] top-[204px] w-[3.5px] h-[82px] bg-[#3B3E48] rounded-r-full shadow-sm pointer-events-none" />
        <div className="absolute -right-[3.5px] top-[340px] w-[3px] h-[64px] bg-[#2E313A] rounded-r-full shadow-sm pointer-events-none" />

        <div className="relative w-[440px] max-w-[94vw] h-[956px] max-h-[96vh] rounded-[40px] p-[4px] bg-gradient-to-b from-[#2E313C] via-[#1B1D25] to-[#121319] shadow-[0_36px_110px_rgba(0,0,0,0.95),_0_0_0_1px_rgba(255,255,255,0.12),_inset_0_1px_2px_rgba(255,255,255,0.22)] border border-[#3A3D4A]/80 flex flex-col overflow-hidden">
          <div className="relative w-full h-full bg-[#F8F8F6] rounded-[36px] overflow-hidden flex flex-col shadow-inner">
            {topToast}
            <main className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col bg-[#F8F8F6]">
              {children}
            </main>
            {bottomNav}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-50 select-none pointer-events-none">
              <div className="w-36 h-[4.5px] bg-black/25 rounded-full backdrop-blur-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

