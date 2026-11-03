'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';

interface ServicesViewProps {
  onNavigateHome: () => void;
  onNavigateAbout: () => void;
}

export function ServicesView({ onNavigateHome, onNavigateAbout }: ServicesViewProps) {
  const [activeTab, setActiveTab] = useState<'strength' | 'biometrics' | 'hydration' | 'habits'>('strength');

  const tracks = {
    strength: {
      tag: 'Track 01 • Core Engineering',
      title: 'Progressive Overload & Workout Logging',
      description:
        'Structure your weekly micro-cycles with automated weight increments, RPE fatigue tracking, and balanced push/pull/legs periodization.',
      metrics: [
        { label: 'Tracking Precision', value: 'Per-Set & Rep' },
        { label: 'Split Templates', value: '5 Preset Routines' },
        { label: 'Fatigue Protection', value: 'Auto-Deload Weeks' },
      ],
      features: [
        'Real-time set logging with weight, reps, and RPE rating.',
        'Dynamic volume progression graphs across compound lifts.',
        'Automated rest timers between sets with audio notifications.',
        'Rest-day logging with symmetric XP rollback defense.',
      ],
      phonePreview: {
        screenTitle: 'Workout Session',
        exercise: 'Barbell Back Squat',
        set: 'Set 3 of 4',
        weight: '100 kg • 8 Reps',
        status: 'Active Set (RPE 8.5)',
      },
    },
    biometrics: {
      tag: 'Track 02 • Biometric Telemetry',
      title: 'Real-Time Sensor & Heart Rate Sync',
      description:
        'Synchronize your Bluetooth Low Energy (BLE) chest straps and smartwatches to balance fat-oxidation Zone 2 intervals with peak VO2 max thresholds.',
      metrics: [
        { label: 'Sensor Standard', value: 'BLE 5.0 + HealthKit' },
        { label: 'Latency', value: '14ms Direct Stream' },
        { label: 'HR Zones', value: 'Zone 1 to 5' },
      ],
      features: [
        'Direct connection to standard heart rate monitors via Web Bluetooth.',
        'Continuous active calorie computation synced with workout intensity.',
        'Automatic heart rate recovery rate (HRR) calculation post-set.',
        'Zero cloud latency: biometrics processed locally on your phone.',
      ],
      phonePreview: {
        screenTitle: 'Telemetry Stream',
        exercise: 'Metabolic Conditioning',
        set: 'Zone 4 Threshold',
        weight: '158 BPM (88% Max)',
        status: 'Active Sync • 480 kcal',
      },
    },
    hydration: {
      tag: 'Track 03 • Metabolic Balance',
      title: 'Intelligent Hydration & Macro Pacing',
      description:
        'Keep your cellular energy and muscle recovery optimal. FitFlow calculates precise fluid benchmarks adjusted for ambient temperature and training volume.',
      metrics: [
        { label: 'Logging Speed', value: 'One-Tap 250ml' },
        { label: 'Daily Target', value: '3,000 ml Baseline' },
        { label: 'Notification', value: 'Circadian Pacing' },
      ],
      features: [
        'Dynamic hydration target adjusting for active sweat loss.',
        'Quick-tap volume buttons (250ml, 500ml, custom glass).',
        'Daily intake timeline highlighting hydration gaps.',
        'Subtle circadian reminders timed between workout windows.',
      ],
      phonePreview: {
        screenTitle: 'Hydration Tracker',
        exercise: 'Daily Water Intake',
        set: '2,400 / 3,000 ml',
        weight: '80% of Daily Goal',
        status: 'Optimal Cellular Balance',
      },
    },
    habits: {
      tag: 'Track 04 • Habit Architecture',
      title: '21-Day Streak Consistency & XP Leveling',
      description:
        'Transform physical fitness from an occasional chore into an unshakeable daily reflex using positive reinforcement, streak shields, and tiered XP unlocks.',
      metrics: [
        { label: 'Streak Target', value: '21 Days to Habit' },
        { label: 'Level Cap', value: 'Level 10 Master' },
        { label: 'Offline Sync', value: '100% PWA Cache' },
      ],
      features: [
        'Visual 28-day habit matrix celebrating continuous discipline.',
        'Symmetric XP engine: 500 XP per level with rollover safeguards.',
        'Milestone badges for volume, attendance, and streak breakthroughs.',
        'Offline resilience: all progress is saved locally and synced automatically.',
      ],
      phonePreview: {
        screenTitle: 'Habit Mastery',
        exercise: 'Current Streak',
        set: '14 Days Unbroken 🔥',
        weight: 'Level 3 Athlete (340/500 XP)',
        status: 'Habit Shield Active',
      },
    },
  };

  const current = tracks[activeTab];

  return (
    <div className="w-full flex flex-col bg-white text-neutral-900 selection:bg-[#FF5500] selection:text-white">
      {/* Container */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col gap-16 sm:gap-24">
        
        {/* ============================================================== */}
        {/* 1. HERO HEADER                                                 */}
        {/* ============================================================== */}
        <section className="flex flex-col items-center text-center max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#FF5500] text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FF5500]" />
            <span>FitFlow Architecture & Services</span>
          </div>

          <h1 className="font-['Manrope',sans-serif] text-3xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-950 tracking-tight leading-[1.12]">
            Fitness engineering for{' '}
            <span className="text-[#FF5500]">serious progress</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed [text-wrap:pretty]">
            FitFlow replaces guesswork with structured progressive overload, real-time wearable telemetry, and 21-day habit architecture designed for everyday athletes.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-10 w-full grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-left">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-mono">4</div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mt-0.5">Core Tracks</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#FF5500] font-mono">100%</div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mt-0.5">Offline-Ready</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-mono">14ms</div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mt-0.5">BLE Sensor Sync</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#FF5500] font-mono">21 Days</div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mt-0.5">Habit Horizon</div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 2. INTERACTIVE TRACK SELECTOR & SHOWCASE                       */}
        {/* ============================================================== */}
        <section className="w-full flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-neutral-200">
            <div>
              <span className="text-xs font-bold text-[#FF5500] uppercase tracking-wider">Methodology & Capabilities</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 mt-1">Explore FitFlow Capabilities</h2>
            </div>
            <span className="text-xs sm:text-sm text-neutral-500 font-medium">Select a track to inspect real app telemetry</span>
          </div>

          {/* Tab Navigation Pill Bar */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-neutral-100 border border-neutral-200 w-full sm:w-fit">
            {[
              { id: 'strength', label: 'Workout Overload' },
              { id: 'biometrics', label: 'Sensor & Heart Rate' },
              { id: 'hydration', label: 'Hydration Pacing' },
              { id: 'habits', label: '21-Day Streaks' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-neutral-950 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Track Deep-Dive Card (Split Layout) */}
          <div className="w-full rounded-3xl bg-neutral-50 border border-neutral-200/90 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center shadow-xs">
            {/* Left Content (col-span-7) */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <span className="text-xs font-mono font-bold text-[#FF5500] uppercase tracking-wider mb-2">
                {current.tag}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight mb-4">
                {current.title}
              </h3>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-6">
                {current.description}
              </p>

              {/* Metric Highlights Row */}
              <div className="grid grid-cols-3 gap-3 w-full py-4 border-y border-neutral-200 mb-6">
                {current.metrics.map((m, idx) => (
                  <div key={idx}>
                    <div className="text-xs text-neutral-500 font-medium">{m.label}</div>
                    <div className="text-sm sm:text-base font-bold text-neutral-950 mt-0.5">{m.value}</div>
                  </div>
                ))}
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2.5 w-full">
                {current.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                    <span className="w-4 h-4 rounded-full bg-orange-100 text-[#FF5500] flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                      ✓
                    </span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Phone Mockup (col-span-5) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[280px] rounded-[36px] bg-neutral-950 p-3 shadow-2xl border-4 border-neutral-800 text-white select-none">
                {/* iPhone Notch */}
                <div className="w-24 h-4 bg-neutral-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                </div>

                {/* Screen Content */}
                <div className="bg-neutral-900 rounded-[28px] p-4 flex flex-col gap-3 min-h-[360px] justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono pb-2 border-b border-neutral-800">
                      <span>{current.phonePreview.screenTitle}</span>
                      <span className="text-[#FF5500] font-bold">LIVE</span>
                    </div>

                    <div className="mt-4">
                      <div className="text-[11px] text-neutral-400 uppercase font-mono">Current Activity</div>
                      <div className="text-lg font-bold text-white mt-0.5">{current.phonePreview.exercise}</div>
                    </div>

                    <div className="mt-3 p-3 rounded-xl bg-neutral-800/80 border border-neutral-700">
                      <div className="text-xs text-neutral-300 font-mono">{current.phonePreview.set}</div>
                      <div className="text-base font-extrabold text-[#FF5500] font-mono mt-1">{current.phonePreview.weight}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-[#FF5500] text-xs font-mono font-bold flex items-center justify-between">
                    <span>{current.phonePreview.status}</span>
                    <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. FOUR DISTINCT APPLICATION PILLARS (CLEAN 2x2 GRID)         */}
        {/* ============================================================== */}
        <section className="w-full flex flex-col gap-6">
          <div>
            <span className="text-xs font-bold text-[#FF5500] uppercase tracking-wider">Engineered For Endurance</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 mt-1">Four Pillars of FitFlow</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-neutral-50 border border-neutral-200/90 text-left">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#FF5500] flex items-center justify-center font-mono font-extrabold text-base mb-4">
                01
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-950 mb-2">Scientific Progressive Overload</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Log every set with RPE fatigue benchmarks. FitFlow auto-calculates whether you should add weight, reps, or volume in your next training session to ensure steady progress without injury.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-neutral-50 border border-neutral-200/90 text-left">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#FF5500] flex items-center justify-center font-mono font-extrabold text-base mb-4">
                02
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-950 mb-2">Offline-First Local Storage</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Never lose a workout in basement gym gyms with dead cell reception. All data logs instantly to your device local storage and synchronizes automatically when your signal recovers.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-neutral-50 border border-neutral-200/90 text-left">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#FF5500] flex items-center justify-center font-mono font-extrabold text-base mb-4">
                03
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-950 mb-2">Dynamic Hydration Equilibrium</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Sweat rates vary drastically between strength training and outdoor running. FitFlow calculates real-time hydration adjustments to prevent cramping and maintain central nervous system drive.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-neutral-50 border border-neutral-200/90 text-left">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#FF5500] flex items-center justify-center font-mono font-extrabold text-base mb-4">
                04
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-950 mb-2">21-Day Habit Reinforcement</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Psychologically engineered 21-day milestones with symmetric workout rollback protection. You earn XP only when putting in genuine reps, building authentic athletic consistency.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. CALL TO ACTION FOOTER BANNER                                */}
        {/* ============================================================== */}
        <section className="w-full rounded-3xl bg-neutral-950 text-white p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ready to elevate your training?</h3>
            <p className="mt-2 text-sm sm:text-base text-neutral-400">
              Download the FitFlow native package today. Zero subscription traps, zero data selling.
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
              onClick={onNavigateAbout}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all border border-white/15 cursor-pointer"
            >
              Read About Us
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
