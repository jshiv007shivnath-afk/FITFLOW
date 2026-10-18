'use client';

import React from 'react';

interface PhoneSimulatorProps {
  children: React.ReactNode;
  bottomNav?: React.ReactNode;
  topToast?: React.ReactNode;
}

export function PhoneSimulator({ children, bottomNav, topToast }: PhoneSimulatorProps) {
  return (
    <div className="min-h-screen w-full bg-[#07080B] flex flex-col items-center justify-center p-2 sm:p-4 selection:bg-[#B8F45A] selection:text-[#111111]">
      {/* Outer Phone Wrapper with Realistic iPhone 17 Pro Max Side Hardware Buttons */}
      <div className="relative flex items-center justify-center my-auto">
        {/* Left Side Hardware Buttons (Action Button + Volume Up + Volume Down) */}
        <div className="absolute -left-[3.5px] top-[148px] w-[3.5px] h-[34px] bg-[#3B3E48] rounded-l-full shadow-sm pointer-events-none" />
        <div className="absolute -left-[3.5px] top-[198px] w-[3.5px] h-[58px] bg-[#3B3E48] rounded-l-full shadow-sm pointer-events-none" />
        <div className="absolute -left-[3.5px] top-[268px] w-[3.5px] h-[58px] bg-[#3B3E48] rounded-l-full shadow-sm pointer-events-none" />

        {/* Right Side Hardware Buttons (Side Power + Camera Control) */}
        <div className="absolute -right-[3.5px] top-[204px] w-[3.5px] h-[82px] bg-[#3B3E48] rounded-r-full shadow-sm pointer-events-none" />
        <div className="absolute -right-[3.5px] top-[340px] w-[3px] h-[64px] bg-[#2E313A] rounded-r-full shadow-sm pointer-events-none" />

        {/* iPhone 17 Pro Max Precision Chassis (6.9" 440px x 956px Titanium Frame) */}
        <div className="relative w-[440px] max-w-[94vw] h-[956px] max-h-[96vh] rounded-[40px] p-[4px] bg-gradient-to-b from-[#2E313C] via-[#1B1D25] to-[#121319] shadow-[0_36px_110px_rgba(0,0,0,0.95),_0_0_0_1px_rgba(255,255,255,0.12),_inset_0_1px_2px_rgba(255,255,255,0.22)] border border-[#3A3D4A]/80 flex flex-col overflow-hidden">
          
          {/* Subtle Titanium Inner Bezel Rim */}
          <div className="relative w-full h-full bg-[#F8F8F6] rounded-[36px] overflow-hidden flex flex-col shadow-inner">
            
            {/* Top Fixed Toast Notification HUD (Zero Overlap with Bottom Nav/Cards) */}
            {topToast}

            {/* Scrollable Viewport (Long, Deep, Feature-Rich Health Flow) */}
            <main className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col bg-[#F8F8F6]">
              {children}
            </main>

            {/* Floating Apple Liquid Glass Navigation Bar */}
            {bottomNav}

            {/* Precision iOS Home Indicator Bar */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-50 select-none pointer-events-none">
              <div className="w-36 h-[4.5px] bg-black/25 rounded-full backdrop-blur-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

