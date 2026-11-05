'use client';

import React from 'react';
import { motion } from 'motion/react';

interface AboutViewProps {
  onNavigateHome: () => void;
  onNavigateServices: () => void;
}

export function AboutView({ onNavigateHome, onNavigateServices }: AboutViewProps) {
  return (
    <div className="w-full flex flex-col bg-white text-neutral-900 selection:bg-[#FF5500] selection:text-white">
      {/* Container */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col gap-16 sm:gap-24">
        
        {/* ============================================================== */}
        {/* 1. HERO HEADER                                                 */}
        {/* ============================================================== */}
        <section className="flex flex-col items-center text-center max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#FF5500] text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FF5500]" />
            <span>The FitFlow Manifesto • Est. 2026</span>
          </div>

          <h1 className="font-['Manrope',sans-serif] text-3xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-950 tracking-tight leading-[1.12]">
            Built for athletes who{' '}
            <span className="text-[#FF5500]">respect the process</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed [text-wrap:pretty]">
            FitFlow was born out of frustration with noisy notification loops, toxic gym culture, and unrealistic 7-day shred routines that lead to burnout and injury.
          </p>
        </section>

        {/* ============================================================== */}
        {/* 2. THE PROBLEM & OUR CONVICTION (EDITORIAL 2-COLUMN)          */}
        {/* ============================================================== */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-start py-6 border-y border-neutral-200">
          <div className="text-left">
            <span className="text-xs font-mono font-bold text-[#FF5500] uppercase tracking-wider">
              The Reality
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight mt-2 mb-4">
              Modern fitness apps are engineered for engagement, not progress.
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Most digital fitness apps bombard you with fake AI coaches, aggressive subscription renewal popups, and algorithmic guilt trips when you miss a single workout. They want you addicted to their app, not thriving in your body.
            </p>
          </div>

          <div className="text-left">
            <span className="text-xs font-mono font-bold text-[#FF5500] uppercase tracking-wider">
              Our Antidote
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight mt-2 mb-4">
              A calm, distraction-free sanctuary for physical discipline.
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              FitFlow is designed like precision sporting equipment. Clean typography, local-first storage that works deep underground with zero Wi-Fi, and honest metrics that celebrate true consistency: progressive overload, hydration, and 21-day streaks.
            </p>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. FOUR CORE VALUES                                            */}
        {/* ============================================================== */}
        <section className="flex flex-col gap-8 text-left">
          <div>
            <span className="text-xs font-mono font-bold text-[#FF5500] uppercase tracking-wider">
              Foundational Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight mt-1">
              What we stand for
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Value 1 */}
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF5500] font-mono font-bold flex items-center justify-center text-sm mb-3">
                01
              </div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-950 mb-1">
                Zero Toxic Gamification
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                XP is earned only through verified physical exertion. If you uncheck a set, your XP rolls back symmetrically. We value truth over artificial numbers.
              </p>
            </div>

            {/* Value 2 */}
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF5500] font-mono font-bold flex items-center justify-center text-sm mb-3">
                02
              </div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-950 mb-1">
                Local-First Data Sovereignty
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Your heart rate, body weight, and workout logs belong to you. All telemetry is stored on your device first and synchronized securely with no third-party data selling.
              </p>
            </div>

            {/* Value 3 */}
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF5500] font-mono font-bold flex items-center justify-center text-sm mb-3">
                03
              </div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-950 mb-1">
                Biometric Precision
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Direct Web Bluetooth Low Energy (BLE) sensor integration ensures sub-15ms telemetry capture for chest straps, heart rate monitors, and smartwatches.
              </p>
            </div>

            {/* Value 4 */}
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF5500] font-mono font-bold flex items-center justify-center text-sm mb-3">
                04
              </div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-950 mb-1">
                Respect for Rest & Recovery
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Muscles grow during recovery, not during the workout. Scheduled rest days protect your streak instead of penalizing you, preventing overtraining syndrome.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. REAL ATHLETE BENCHMARKS                                     */}
        {/* ============================================================== */}
        <section className="p-8 sm:p-10 rounded-3xl bg-neutral-50 border border-neutral-200 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-neutral-200">
            <div>
              <span className="text-xs font-mono font-bold text-[#FF5500] uppercase tracking-wider">
                Real Performance Telemetry
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-950 mt-1">
                Community Milestones
              </h3>
            </div>
            <span className="text-xs font-mono text-neutral-500 bg-white px-3 py-1 rounded-full border border-neutral-200">
              Audited 2026
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-neutral-950 font-mono">2,048+</div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mt-1">Active Athletes</div>
              <p className="text-xs text-neutral-600 mt-1">Everyday runners, lifters, and hybrid athletes logging daily.</p>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#FF5500] font-mono">14.2M</div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mt-1">Reps Logged</div>
              <p className="text-xs text-neutral-600 mt-1">Verified weight and repetition sets stored locally.</p>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-neutral-950 font-mono">99.4%</div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mt-1">Offline Reliability</div>
              <p className="text-xs text-neutral-600 mt-1">Zero data loss even in dead-zone subterranean gym floors.</p>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 5. CALL TO ACTION FOOTER                                       */}
        {/* ============================================================== */}
        <section className="w-full rounded-3xl bg-neutral-950 text-white p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Experience intentional fitness.</h3>
            <p className="mt-2 text-sm sm:text-base text-neutral-400">
              Download the FitFlow native app package. Built for your body, not for an algorithm.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onNavigateHome}
              className="px-6 py-3 rounded-full bg-[#FF5500] hover:bg-[#ff6a1f] text-white font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Back to Home
            </button>
            <button
              type="button"
              onClick={onNavigateServices}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all border border-white/15 cursor-pointer"
            >
              Explore Services
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
