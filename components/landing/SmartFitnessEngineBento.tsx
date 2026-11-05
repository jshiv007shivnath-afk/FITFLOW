'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';

interface SmartFitnessEngineBentoProps {
  onOpenDownload: () => void;
}

export function SmartFitnessEngineBento({ onOpenDownload }: SmartFitnessEngineBentoProps) {
  // Card 1: Interactive Strain Curve state
  const [activeDataPoint, setActiveDataPoint] = useState<{
    rep: number;
    bpm: number;
    watts: number;
    velocity: string;
  }>({
    rep: 8,
    bpm: 148,
    watts: 620,
    velocity: '0.82 m/s',
  });
  const [repCount, setRepCount] = useState(8);

  // Card 3: Heatmap hover state
  const [hoveredDay, setHoveredDay] = useState<{ day: number; kcal: number; isRest?: boolean } | null>(null);

  // Card 4: Live Activity Rest Timer simulation
  const [restSeconds, setRestSeconds] = useState(45);
  const [liveBpm, setLiveBpm] = useState(142);

  useEffect(() => {
    const timer = setInterval(() => {
      setRestSeconds((prev) => (prev > 1 ? prev - 1 : 45));
    }, 1000);
    const bpmTimer = setInterval(() => {
      setLiveBpm(140 + Math.floor(Math.random() * 5));
    }, 2400);
    return () => {
      clearInterval(timer);
      clearInterval(bpmTimer);
    };
  }, []);

  // Spotlight mouse tracking on Bento Grid
  const gridRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll<HTMLDivElement>('.bento-spotlight-card');
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  };

  // Strain curve data points for Card 1
  const points = [
    { x: 30, y: 130, rep: 1, bpm: 118, watts: 380, velocity: '1.05 m/s' },
    { x: 90, y: 105, rep: 3, bpm: 128, watts: 450, velocity: '0.98 m/s' },
    { x: 160, y: 80, rep: 5, bpm: 138, watts: 520, velocity: '0.91 m/s' },
    { x: 240, y: 55, rep: 8, bpm: 148, watts: 620, velocity: '0.82 m/s' },
    { x: 320, y: 40, rep: 10, bpm: 156, watts: 690, velocity: '0.74 m/s' },
    { x: 410, y: 25, rep: 12, bpm: 164, watts: 760, velocity: '0.68 m/s' },
  ];

  // 28-day streak matrix data
  const daysMatrix = Array.from({ length: 28 }, (_, i) => {
    const day = i + 1;
    // active if not on day 3, 10, 17, 24 (scheduled rest days)
    const isRest = day % 7 === 3;
    const intensity = isRest ? 0 : day > 14 ? 0.95 : 0.65 + (day % 3) * 0.12;
    const kcal = isRest ? 0 : 540 + ((day * 37) % 320);
    return { day, isRest, intensity, kcal };
  });

  return (
    <section className="w-full py-16 sm:py-24 relative z-10" id="section-bento">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs font-mono font-medium text-[#38BDF8] tracking-wider mb-4 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38bdf8]" />
            <span>[ SMART FITNESS ENGINE ]</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.12] mb-4 [text-wrap:balance]">
            Every Rep,{' '}
            <span className="font-['Instrument_Serif',Georgia,serif] italic font-normal text-[#FF5500] text-[1.14em]">
              Every Milestone
            </span>
          </h2>

          <p className="max-w-xl text-sm sm:text-base text-slate-300 leading-relaxed [text-wrap:pretty]">
            Engineered telemetry built for everyday athletes. Synchronize your velocity, biometric rings, and habit streaks in real time.
          </p>
        </div>

        {/* 4-Card Asymmetric Bento Grid */}
        <div
          ref={gridRef}
          onMouseMove={handleMouseMove}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 select-none"
        >
          {/* ============================================================== */}
          {/* CARD 1: Kinetic Workout & Rep Velocity Tracker (md:col-span-2)  */}
          {/* ============================================================== */}
          <div className="bento-spotlight-card relative md:col-span-2 rounded-3xl bg-[#0C101A]/85 backdrop-blur-xl border border-white/10 p-6 sm:p-8 overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.45)] flex flex-col justify-between">
            {/* Spotlight pseudo overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
              style={{
                background:
                  'radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(56, 189, 248, 0.08), transparent 40%)',
              }}
            />

            {/* Top Stats Bar */}
            <div className="relative z-10 flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
                  Telemetry Module 01
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                  Rep Velocity & Strain Curve
                </h3>
              </div>

              {/* Rep Ticker Badge */}
              <div className="flex items-center gap-3 bg-white/[0.05] border border-white/10 rounded-2xl px-4 py-2">
                <div className="flex flex-col text-right">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Live Set</span>
                  <span className="text-base sm:text-lg font-mono font-bold text-white tabular-nums">
                    {repCount.toString().padStart(2, '0')} / 12 REPS
                  </span>
                </div>
                <div className="w-2 h-7 rounded-full bg-gradient-to-t from-slate-700 to-[#FF5500] relative overflow-hidden">
                  <motion.div
                    className="w-full bg-[#FF5500] absolute bottom-0 left-0 rounded-full"
                    animate={{ height: `${(repCount / 12) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                </div>
              </div>
            </div>

            {/* Interactive SVG Strain Chart */}
            <div className="relative z-10 w-full h-44 sm:h-52 my-2 bg-[#080B12]/60 border border-white/5 rounded-2xl p-4 flex flex-col justify-end overflow-hidden">
              {/* Background Chart Grid */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                }}
              />

              <svg className="w-full h-full overflow-visible" viewBox="0 0 440 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="strainGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Fill area under curve */}
                <path
                  d="M 30 130 C 90 105, 160 80, 240 55 C 320 40, 370 30, 410 25 L 410 160 L 30 160 Z"
                  fill="url(#strainGradient)"
                />

                {/* Main Stroke Curve */}
                <path
                  d="M 30 130 C 90 105, 160 80, 240 55 C 320 40, 370 30, 410 25"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Target Strain Horizon Line */}
                <line
                  x1="20"
                  y1="55"
                  x2="420"
                  y2="55"
                  stroke="rgba(255,85,0,0.4)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Interactive Points on Curve */}
                {points.map((pt) => {
                  const isSelected = activeDataPoint.rep === pt.rep;
                  return (
                    <g
                      key={pt.rep}
                      className="cursor-pointer transition-transform"
                      onClick={() => {
                        setActiveDataPoint(pt);
                        setRepCount(pt.rep);
                      }}
                      onMouseEnter={() => {
                        setActiveDataPoint(pt);
                        setRepCount(pt.rep);
                      }}
                    >
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSelected ? 7 : 4.5}
                        fill={isSelected ? '#FF5500' : '#0C101A'}
                        stroke={isSelected ? '#FFFFFF' : '#38BDF8'}
                        strokeWidth="2.5"
                      />
                      {isSelected && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={14}
                          fill="none"
                          stroke="#FF5500"
                          strokeWidth="1.5"
                          opacity="0.5"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Live Tooltip Floating Header */}
              <div className="absolute top-3 left-4 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-300">
                <span className="text-[#38BDF8] font-bold">● Rep {activeDataPoint.rep}</span>
                <span>• Heart Rate: <strong className="text-white tabular-nums">{activeDataPoint.bpm} BPM</strong></span>
                <span>• Peak Strain: <strong className="text-[#FF5500] tabular-nums">{activeDataPoint.watts}W</strong></span>
                <span className="hidden sm:inline">• Velocity: <strong className="text-emerald-400 tabular-nums">{activeDataPoint.velocity}</strong></span>
              </div>
            </div>

            {/* Muscle Group Activation Pills */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-mono text-[11px]">Primary Engagement:</span>
                <span className="px-2.5 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 font-mono font-medium">
                  Quads 94%
                </span>
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-mono font-medium">
                  Core 88%
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-slate-300 font-mono font-medium">
                  Delts 76%
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                Auto-Calibrated 0.2s ago
              </span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* CARD 2: Triple-Ring Biometric Balance (md:col-span-1)          */}
          {/* ============================================================== */}
          <div className="bento-spotlight-card relative md:col-span-1 rounded-3xl bg-[#0C101A]/85 backdrop-blur-xl border border-white/10 p-6 sm:p-7 overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.45)] flex flex-col justify-between">
            <div
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
              style={{
                background:
                  'radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255, 85, 0, 0.08), transparent 40%)',
              }}
            />

            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF5500] font-bold">
                Telemetry Module 02
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight mt-1 mb-4">
                Biometric Balance
              </h3>
            </div>

            {/* Concentric SVG Rings */}
            <div className="relative z-10 w-44 h-44 mx-auto my-3 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 overflow-visible" viewBox="0 0 160 160">
                {/* Ring 1 Background & Arc: Calories (Orange) */}
                <circle cx="80" cy="80" r="70" fill="none" stroke="#222734" strokeWidth="10" />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#FF5500"
                  strokeWidth="10"
                  strokeDasharray="440"
                  strokeDashoffset={440 * (1 - 0.8)}
                  strokeLinecap="round"
                />

                {/* Ring 2 Background & Arc: Hydration (Cyan) */}
                <circle cx="80" cy="80" r="54" fill="none" stroke="#1B2230" strokeWidth="10" />
                <circle
                  cx="80"
                  cy="80"
                  r="54"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="10"
                  strokeDasharray="339"
                  strokeDashoffset={339 * (1 - 0.78)}
                  strokeLinecap="round"
                />

                {/* Ring 3 Background & Arc: Recovery (Emerald) */}
                <circle cx="80" cy="80" r="38" fill="none" stroke="#16202C" strokeWidth="10" />
                <circle
                  cx="80"
                  cy="80"
                  r="38"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="10"
                  strokeDasharray="238"
                  strokeDashoffset={238 * (1 - 0.94)}
                  strokeLinecap="round"
                />
              </svg>

              {/* Center Ring Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Recovery</span>
                <span className="text-xl font-mono font-bold text-white tabular-nums">94%</span>
                <span className="text-[9px] font-mono text-emerald-400">OPTIMAL</span>
              </div>
            </div>

            {/* Metric Legend Rows */}
            <div className="relative z-10 space-y-2 pt-4 border-t border-white/5 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500]" />
                  <span>Burn Target</span>
                </div>
                <span className="text-white font-bold tabular-nums">640 / 800 kcal</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
                  <span>Hydration</span>
                </div>
                <span className="text-white font-bold tabular-nums">2.4 / 3.0 L</span>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* CARD 3: 28-Day Progressive Discipline Matrix (md:col-span-1)   */}
          {/* ============================================================== */}
          <div className="bento-spotlight-card relative md:col-span-1 rounded-3xl bg-[#0C101A]/85 backdrop-blur-xl border border-white/10 p-6 sm:p-7 overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.45)] flex flex-col justify-between">
            <div
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
              style={{
                background:
                  'radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255, 189, 90, 0.08), transparent 40%)',
              }}
            />

            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  Telemetry Module 03
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold">
                  14-Day Streak 🔥
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight mt-1 mb-4">
                Discipline Heatmap
              </h3>
            </div>

            {/* 4x7 (28-day) Heatmap Grid */}
            <div className="relative z-10 my-2">
              <div className="grid grid-cols-7 gap-2">
                {daysMatrix.map((item) => (
                  <motion.div
                    key={item.day}
                    whileHover={{ scale: 1.25 }}
                    onMouseEnter={() => setHoveredDay(item)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className="aspect-square rounded-md transition-all cursor-pointer relative"
                    style={{
                      backgroundColor: item.isRest
                        ? 'rgba(255, 255, 255, 0.06)'
                        : `rgba(255, 85, 0, ${item.intensity})`,
                      boxShadow:
                        item.intensity > 0.8
                          ? '0 0 10px rgba(255, 85, 0, 0.45)'
                          : 'none',
                    }}
                    title={`Day ${item.day}: ${item.isRest ? 'Scheduled Rest' : `${item.kcal} kcal`}`}
                  />
                ))}
              </div>

              {/* Tooltip bar below grid */}
              <div className="h-6 mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
                {hoveredDay ? (
                  <span>
                    Day {hoveredDay.day}:{' '}
                    <strong className="text-white">
                      {hoveredDay.isRest ? 'Scheduled Recovery' : `${hoveredDay.kcal} kcal burned`}
                    </strong>
                  </span>
                ) : (
                  <span>Hover any cell to inspect volume</span>
                )}
                <span className="text-amber-400 font-bold">4 Weeks Active</span>
              </div>
            </div>

            {/* Streak Milestone Pill */}
            <div className="relative z-10 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-300">
              <span>Next Milestone</span>
              <span className="text-white font-bold">Day 21 (Habit Lock)</span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* CARD 4: Instant Phone & Wearable Live Sync (md:col-span-2)      */}
          {/* ============================================================== */}
          <div className="bento-spotlight-card relative md:col-span-2 rounded-3xl bg-[#0C101A]/85 backdrop-blur-xl border border-white/10 p-6 sm:p-8 overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.45)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
              style={{
                background:
                  'radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(56, 189, 248, 0.08), transparent 40%)',
              }}
            />

            {/* Left Value Pitch */}
            <div className="relative z-10 flex-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
                Telemetry Module 04
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 mb-2">
                Wearable & Live Activity Sync
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-md mb-6">
                Your workout never loses context. Stream real-time heart rate, set intervals, and rest timers directly to your phone’s dynamic lock screen.
              </p>
              <button
                type="button"
                onClick={onOpenDownload}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-neutral-100 text-[#07090E] font-semibold text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer"
              >
                <span>Install FitFlow on Phone</span>
                <span aria-hidden="true">↗</span>
              </button>
            </div>

            {/* Right: Realistic iOS Lock Screen Live Activity Widget Preview */}
            <div className="relative z-10 w-full sm:w-80 rounded-2xl bg-[#06080D]/95 border border-white/15 p-4 shadow-2xl shrink-0">
              {/* Dynamic Island Pill header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-[#FF5500] flex items-center justify-center text-white text-[10px] font-bold">
                    F
                  </div>
                  <span className="text-xs font-semibold text-white">FitFlow Training</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>LIVE</span>
                </div>
              </div>

              {/* Metric Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/[0.04] rounded-xl p-2.5 border border-white/5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Heart Rate</span>
                  <div className="text-lg font-mono font-bold text-white flex items-center gap-1 mt-0.5">
                    <span className="text-[#FF5500]">♥</span>
                    <span className="tabular-nums">{liveBpm}</span>
                    <span className="text-[10px] font-normal text-slate-400">BPM</span>
                  </div>
                </div>

                <div className="bg-white/[0.04] rounded-xl p-2.5 border border-white/5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Rest Countdown</span>
                  <div className="text-lg font-mono font-bold text-cyan-400 flex items-center gap-1 mt-0.5">
                    <span>⏱</span>
                    <span className="tabular-nums">00:{restSeconds.toString().padStart(2, '0')}</span>
                  </div>
                </div>
              </div>

              {/* Progress Line */}
              <div className="mt-3 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF5500] to-[#38BDF8] transition-all duration-1000"
                  style={{ width: `${((45 - restSeconds) / 45) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
