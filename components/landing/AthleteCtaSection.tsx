'use client';

import React from 'react';
import { motion } from 'motion/react';

interface AthleteCtaSectionProps {
  onLaunchApp?: () => void;
}

export function AthleteCtaSection({ onLaunchApp }: AthleteCtaSectionProps) {
  return (
    <section className="w-full py-16 sm:py-24 bg-white border-t border-[#E7E2E8]" id="section-athlete-cta">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full bg-gradient-to-br from-neutral-900 via-neutral-900 to-[#1e1724] rounded-[36px] p-8 sm:p-14 lg:p-16 text-center text-white relative overflow-hidden shadow-xl flex flex-col items-center">
          {/* Subtle Ambient Light Bloom */}
          <div
            aria-hidden="true"
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none"
          />

          <span className="text-[12px] font-bold text-amber-400 tracking-wider uppercase mb-4 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm">
            Ready to Train with Precision
          </span>

          <h2 className="font-['Manrope'] text-[32px] sm:text-[48px] lg:text-[56px] font-bold text-white tracking-tight leading-[1.08] max-w-3xl mb-6">
            Level up your athletic practice with FitFlow today
          </h2>

          <p className="max-w-xl text-[15px] sm:text-[17px] text-white/80 leading-relaxed mb-10">
            Sync reps, track heart-rate zones, and build lifelong healthy momentum in one calm, fluid workspace.
          </p>

          {/* Action Button Cluster */}
          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onLaunchApp}
              className="px-8 py-3.5 rounded-full bg-[#ffbd5a] hover:bg-[#ffa726] text-[#291800] font-bold text-[14px] sm:text-[15px] transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <span>Launch FitFlow Web App</span>
              <span className="material-symbols-outlined text-[18px]">north_east</span>
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              href="#home"
              className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-[14px] sm:text-[15px] transition-all backdrop-blur-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
              <span>Back to Top</span>
            </motion.a>
          </div>

          {/* Platform Availability Badges */}
          <div className="pt-12 mt-12 border-t border-white/10 w-full flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[12px] text-white/60 font-medium">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-amber-400">devices</span>
              <span>Web Desktop & PWA</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-amber-400">phone_iphone</span>
              <span>iOS & Android</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-amber-400">watch</span>
              <span>Apple Watch & WearOS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Version 1.0.0 Production Build</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
