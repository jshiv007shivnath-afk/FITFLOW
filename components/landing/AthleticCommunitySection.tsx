'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AthleticCommunitySectionProps {
  onOpenDownload: () => void;
}

export function AthleticCommunitySection({ onOpenDownload }: AthleticCommunitySectionProps) {
  // Live ticker cycling events
  const tickerEvents = [
    'Rohan M. synced 5.2km Tempo Run (4:40 /km) • 12s ago',
    'Maya K. completed 45m Kettlebell Strength (620 kcal) • 1m ago',
    'Dev P. locked 14-Day Streak milestone 🔥 • 3m ago',
    'Elena S. achieved personal record on 10km Trail • 5m ago',
    'Marcus W. completed Zone-2 Recovery Flush (380 kcal) • 8m ago',
  ];
  const [currentEventIdx, setCurrentEventIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEventIdx((prev) => (prev + 1) % tickerEvents.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [tickerEvents.length]);

  // Interactive Athlete cards state (Kudos counter)
  const [athleteKudos, setAthleteKudos] = useState<{ [key: string]: number }>({
    maya: 142,
    rohan: 98,
    liam: 114,
  });
  const [bumpedAthlete, setBumpedAthlete] = useState<string | null>(null);

  const handleKudos = (id: string) => {
    setAthleteKudos((prev) => ({ ...prev, [id]: prev[id] + 1 }));
    setBumpedAthlete(id);
    setTimeout(() => setBumpedAthlete(null), 800);
  };

  return (
    <section className="w-full py-16 sm:py-24 relative z-10" id="section-community">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-Column Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Editorial Column (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-mono font-medium text-[#FF5500] tracking-wider mb-4 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] shadow-[0_0_8px_#ff5500]" />
              <span>[ ATHLETIC COMMUNITY ]</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.12] mb-5 [text-wrap:balance]">
              Built for athletes committed to{' '}
              <span className="font-['Instrument_Serif',Georgia,serif] italic font-normal text-[#FF5500] text-[1.14em]">
                progressive discipline
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 [text-wrap:pretty]">
              Join over 2,000+ everyday athletes tracking reps, heart-rate zones, and habits together. Share verified biometric logs and hold your streak accountable.
            </p>

            {/* Live Member Count Pill */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.05] border border-white/10 mb-8 backdrop-blur-md">
              <div className="flex -space-x-2 overflow-hidden shrink-0">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=faces',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=faces',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces',
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=faces',
                ].map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="Active athlete member"
                    className="w-8 h-8 rounded-full ring-2 ring-[#0C101A] object-cover"
                  />
                ))}
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white font-mono">
                  <span>2,048+ Active Athletes</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <span className="text-[11px] text-slate-400 font-mono">99.4% Sync Reliability</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              onClick={onOpenDownload}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white hover:bg-neutral-100 text-[#07090E] font-semibold text-sm transition-all shadow-[0_0_24px_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer"
            >
              <span>Download Mobile App</span>
              <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
          </div>

          {/* Right Column: 3 Interactive Athlete Cards (col-span-7) */}
          <div className="lg:col-span-7 flex flex-col gap-3.5 select-none">
            {/* Card 1: Maya K. */}
            <div className="rounded-2xl bg-[#0C101A]/85 backdrop-blur-xl border border-white/10 p-4 sm:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.4)] flex items-center justify-between gap-4 transition-all hover:border-white/20">
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=faces"
                  alt="Maya K."
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10"
                />
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm sm:text-base">Maya K.</span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono">
                      Endurance Runner
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-1">
                    12.4km Trail Run • <span className="text-white font-bold">820 kcal</span> • 4:42 /km pace
                  </div>
                </div>
              </div>

              {/* Kudos Button */}
              <button
                type="button"
                onClick={() => handleKudos('maya')}
                className="relative px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer text-xs font-mono font-bold text-white shrink-0"
              >
                <span>🔥</span>
                <span className="tabular-nums">{athleteKudos.maya}</span>
                {bumpedAthlete === 'maya' && (
                  <motion.span
                    initial={{ opacity: 1, y: 0, scale: 1 }}
                    animate={{ opacity: 0, y: -18, scale: 1.4 }}
                    transition={{ duration: 0.6 }}
                    className="absolute -top-3 right-2 text-orange-400 font-mono text-[10px] pointer-events-none"
                  >
                    +1
                  </motion.span>
                )}
              </button>
            </div>

            {/* Card 2: Rohan M. */}
            <div className="rounded-2xl bg-[#0C101A]/85 backdrop-blur-xl border border-white/10 p-4 sm:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.4)] flex items-center justify-between gap-4 transition-all hover:border-white/20">
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=faces"
                  alt="Rohan M."
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10"
                />
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm sm:text-base">Rohan M.</span>
                    <span className="px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-[10px] font-mono">
                      Hybrid Athlete
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-1">
                    Heavy Squat Wave 5x5 • <span className="text-white font-bold">640 kcal</span> • RPE 8.5
                  </div>
                </div>
              </div>

              {/* Kudos Button */}
              <button
                type="button"
                onClick={() => handleKudos('rohan')}
                className="relative px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer text-xs font-mono font-bold text-white shrink-0"
              >
                <span>🔥</span>
                <span className="tabular-nums">{athleteKudos.rohan}</span>
                {bumpedAthlete === 'rohan' && (
                  <motion.span
                    initial={{ opacity: 1, y: 0, scale: 1 }}
                    animate={{ opacity: 0, y: -18, scale: 1.4 }}
                    transition={{ duration: 0.6 }}
                    className="absolute -top-3 right-2 text-orange-400 font-mono text-[10px] pointer-events-none"
                  >
                    +1
                  </motion.span>
                )}
              </button>
            </div>

            {/* Card 3: Liam T. */}
            <div className="rounded-2xl bg-[#0C101A]/85 backdrop-blur-xl border border-white/10 p-4 sm:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.4)] flex items-center justify-between gap-4 transition-all hover:border-white/20">
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=faces"
                  alt="Liam T."
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10"
                />
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm sm:text-base">Liam T.</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                      Metabolic HIIT
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-1">
                    Kettlebell Snatch Ladder • <span className="text-white font-bold">590 kcal</span> • 162 BPM
                  </div>
                </div>
              </div>

              {/* Kudos Button */}
              <button
                type="button"
                onClick={() => handleKudos('liam')}
                className="relative px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer text-xs font-mono font-bold text-white shrink-0"
              >
                <span>🔥</span>
                <span className="tabular-nums">{athleteKudos.liam}</span>
                {bumpedAthlete === 'liam' && (
                  <motion.span
                    initial={{ opacity: 1, y: 0, scale: 1 }}
                    animate={{ opacity: 0, y: -18, scale: 1.4 }}
                    transition={{ duration: 0.6 }}
                    className="absolute -top-3 right-2 text-orange-400 font-mono text-[10px] pointer-events-none"
                  >
                    +1
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Live Network Ticker */}
        <div className="mt-12 w-full rounded-2xl bg-[#080B12]/80 backdrop-blur-xl border border-white/10 px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span className="font-bold text-white uppercase tracking-wider">Telemetry Stream:</span>
          </div>

          <div className="flex-1 overflow-hidden h-5 relative flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentEventIdx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="text-slate-300 truncate"
              >
                {tickerEvents[currentEventIdx]}
              </motion.div>
            </AnimatePresence>
          </div>

          <span className="text-[11px] text-slate-400 hidden md:inline">
            Global Sync Ping: <strong className="text-emerald-400">14ms</strong>
          </span>
        </div>
      </div>
    </section>
  );
}
