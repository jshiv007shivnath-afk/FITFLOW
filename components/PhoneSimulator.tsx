'use client';

import React from 'react';

interface PhoneSimulatorProps {
  children: React.ReactNode;
  bottomNav?: React.ReactNode;
  topToast?: React.ReactNode;
}

export function PhoneSimulator({ children, bottomNav, topToast }: PhoneSimulatorProps) {
  return (
    <div className="w-full min-h-[100dvh] bg-[#F8F8F6] sm:bg-[#07080B] flex flex-col items-center justify-center p-0 sm:p-4 selection:bg-[#B8F45A] selection:text-[#111111]">
      {/* Outer Phone Wrapper: On mobile it is 100% full-screen edge-to-edge; on desktop it simulates a titanium phone */}
      <div className="relative w-full h-[100dvh] sm:h-auto flex items-center justify-center sm:my-auto">
        {/* Left Side Hardware Buttons (Desktop Only) */}
        <div className="hidden sm:block absolute -left-[3.5px] top-[148px] w-[3.5px] h-[34px] bg-[#3B3E48] rounded-l-full shadow-sm pointer-events-none" />
        <div className="hidden sm:block absolute -left-[3.5px] top-[198px] w-[3.5px] h-[58px] bg-[#3B3E48] rounded-l-full shadow-sm pointer-events-none" />
        <div className="hidden sm:block absolute -left-[3.5px] top-[268px] w-[3.5px] h-[58px] bg-[#3B3E48] rounded-l-full shadow-sm pointer-events-none" />

        {/* Right Side Hardware Buttons (Desktop Only) */}
        <div className="hidden sm:block absolute -right-[3.5px] top-[204px] w-[3.5px] h-[82px] bg-[#3B3E48] rounded-r-full shadow-sm pointer-events-none" />
        <div className="hidden sm:block absolute -right-[3.5px] top-[340px] w-[3px] h-[64px] bg-[#2E313A] rounded-r-full shadow-sm pointer-events-none" />

        {/* Chassis: Full screen on mobile, 440px rounded phone preview on desktop */}
        <div className="relative w-full h-full sm:w-[440px] sm:max-w-[94vw] sm:h-[956px] sm:max-h-[96vh] rounded-none sm:rounded-[40px] p-0 sm:p-[4px] bg-[#F8F8F6] sm:bg-gradient-to-b sm:from-[#2E313C] sm:via-[#1B1D25] sm:to-[#121319] sm:shadow-[0_36px_110px_rgba(0,0,0,0.95),_0_0_0_1px_rgba(255,255,255,0.12),_inset_0_1px_2px_rgba(255,255,255,0.22)] sm:border sm:border-[#3A3D4A]/80 flex flex-col overflow-hidden">
          
          {/* Inner Content Area */}
          <div className="relative w-full h-full bg-[#F8F8F6] rounded-none sm:rounded-[36px] overflow-hidden flex flex-col sm:shadow-inner">
            
            {/* Top Fixed Toast Notification HUD */}
            {topToast}

            {/* Scrollable Viewport (Long, Deep, Feature-Rich Health Flow) */}
            <main className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col bg-[#F8F8F6]">
              {children}
            </main>

            {/* Floating Apple Liquid Glass Navigation Bar */}
            {bottomNav}

            {/* Simulated iOS Home Indicator Bar (Desktop Preview Only - Real phones have their own system bar) */}
            <div className="hidden sm:block absolute bottom-1.5 left-1/2 -translate-x-1/2 z-50 select-none pointer-events-none">
              <div className="w-36 h-[4.5px] bg-black/25 rounded-full backdrop-blur-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
