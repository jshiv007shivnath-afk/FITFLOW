'use client';

import React from 'react';
import { RuangEditLandingPage } from '@/components/landing/RuangEditLandingPage';
import Link from 'next/link';

export default function LandingRoute() {
  return (
    <div className="relative w-full min-h-screen">
      <div className="fixed top-4 right-4 z-[999]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1c1b1f] hover:bg-[#ffbd5a] hover:text-[#291800] text-white border border-neutral-300 shadow-xl text-xs font-semibold backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>📱 Open FitFlow App</span>
        </Link>
      </div>
      <RuangEditLandingPage
        onLaunchApp={() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
        }}
      />
    </div>
  );
}
